import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';
import LoadingComponent from '../LoadingComponent';

interface Entity {
  id: number;
  name: string;
  country: string;
  code: string;
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

  const [isLoading, setIsLoading] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedEntityData, setSelectedEntityData] = useState<Entity[] | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    if (selectedEntity) {
      fetchData(selectedEntity);
    }
  }, [selectedEntity]);

  const fetchData = async (entityType: string) => {
    
    setIsLoading(true);

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
      
      setIsLoading(false);

    }
    catch (error: any) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);

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

    const generateLink = (selectedEntity: string, item: Entity) => 
    {
      let link = '';

      if (item.country) 
      {
        link = `/${dataCategory.toLowerCase()}/city/${formType.toLowerCase()}/${selectedEntity}/${item.id}/${item.name}/${item.country}`;
      }
      else if (item.code) 
      {
        link = `/${dataCategory.toLowerCase()}/airline/${formType.toLowerCase()}/${selectedEntity}/${item.id}/${item.name}/${item.code}`;
      }
      else
      {
        link = `/${dataCategory.toLowerCase()}/${formType.toLowerCase()}/${selectedEntity}/${item.id}/${item.name}`;
      }
    
      return link;

    };


  return (
    <div className="form-container">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-9 col-lg-6">
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

            {isLoading ? (
              <LoadingComponent />
            ) : (selectedEntity && selectedEntityData && (
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
                        {selectedEntity === 'cities' && (
                            <th>Country</th>
                          )} 
                        {selectedEntity === 'airlines' && (
                            <th>Code</th>
                          )} 
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
                          {selectedEntity === 'cities' && (
                            <td>{item.country}</td>
                          )}
                          {selectedEntity === 'airlines' && (
                            <td>{item.code}</td>
                          )} 
                          {formType !== 'View' && (
                            //{/* Link to the EditFormComponent or DeleteFormComponent */}
                            <td>
                              <Link
                                to={generateLink(selectedEntity, item)}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseFormComponent;
