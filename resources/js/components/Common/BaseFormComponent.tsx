import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';

interface Entity {
  id: number;
  name: string;
}
interface EntityType {
  entityType: string;
  value: string;
}

interface Props {
  dataCategory: string;
  formType: 'Edit' | 'Delete' | 'View';
  entityTypes: EntityType[];
}

const BaseFormComponent: React.FC<Props> = ({ dataCategory, formType, entityTypes }) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedEntityData, setSelectedEntityData] = useState<Entity[] | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    if (selectedEntity) {
      fetchData(selectedEntity);
    }
  }, [selectedEntity]);

  const fetchData = async (entityType: string) => {
    try 
    {
      const response = await fetch(`${apiBaseUrl}/${entityType}`);
      const data = await response.json();

      if(entityType === "cities")
        setSelectedEntityData(data.cities);
      else if(entityType === "airlines")
        setSelectedEntityData(data.airlines);
      else 
        setSelectedEntityData(data.items);
    }
    catch (error) 
    {
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
                  <li key={entityType.value} className="entity-item">
                    {entityType.entityType}
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
                {entityTypes.map((entityType) => (
                  <option key={entityType.value} value={entityType.value}>
                    {entityType.entityType}
                  </option>
                ))}
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
                        {formType !== 'View' && (
                            <th>{`${formType}`}</th>
                          )} 
                        
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          {formType !== 'View' && (
                            //{/* Link to the EditFormComponent or DeleteFormComponent */}
                            <td>
                              <Link
                                to={`/${dataCategory.toLowerCase()}/${formType.toLowerCase()}/${selectedEntity}/${item.id}/${item.name}`}
                                className="btn btn-primary"
                              >
                                {`${formType}`}
                              </Link>
                            </td>
                          )}                            
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
