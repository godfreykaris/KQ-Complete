import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';

interface Entity {
  id: number;
  name: string;
}

interface Props {
  formType: 'Edit' | 'Delete';
}

const entityTypes = ['Skill', 'Qualification', 'Job Title', 'Flight Class', 'Flight Status', 'Seat Location'];

const BaseFormComponent: React.FC<Props> = ({ formType }) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedEntityData, setSelectedEntityData] = useState<Entity[] | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    if (selectedEntity) {
      fetchData(selectedEntity);
    }
  }, [selectedEntity]);

  const fetchData = async (entityType: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${entityType}`);
      const data = await response.json();
      setSelectedEntityData(data.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEntityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEntity(event.target.value);
    setSelectedEntityData(null);
    setFilterValue('');
  };

  const filteredData = selectedEntityData
    ? selectedEntityData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];

  return (
    <div className="form-container">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center">{`${formType} Data`}</h2>
            <div className="form-group">
              <label htmlFor="selectEntity" className="form-label">
                You can select a:
              </label>

              <ul className="entity-types">
                {entityTypes.map((entityType) => (
                  <li key={entityType} className="entity-item">
                    {entityType}
                  </li>
                ))}
              </ul>

              <label htmlFor="selectEntity" className="form-label">
                From here:
              </label>

              <select
                id="selectEntity"
                className="form-control"
                value={selectedEntity}
                onChange={handleEntityChange}
              >
                <option value="">Select an Item</option>
                <option value="skills">Skill</option>
                <option value="qualifications">Qualification</option>
                <option value="jobTitles">Job Title</option>
                <option value="flightClasses">Flight Class</option>
                <option value="flightStatuses">Flight Status</option>
                <option value="seatLocations">Seat Location</option>
              </select>
            </div>

            {selectedEntity && selectedEntityData && (
              <div>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="form-control mb-3 mt-3"
                  placeholder="Filter by name"
                />

                <div className="table-responsive">
                  {/* Display the data in a table */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>{`${formType}`}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>
                            {/* Link to the EditFormComponent or DeleteFormComponent */}
                            <Link
                              to={`/${formType.toLowerCase()}/${selectedEntity}/${item.id}/${item.name}`}
                              className="btn btn-primary"
                            >
                              {`${formType}`}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseFormComponent;
