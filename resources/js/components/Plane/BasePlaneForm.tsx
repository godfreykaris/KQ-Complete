import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';
import { Button, Spinner } from 'react-bootstrap';
import LoadingComponent from '../LoadingComponent';

interface Entity {
    id: number;
    plane_id: string;
    name: string;
    model: string;
    capacity: number;
}

interface Props {
  formType: 'Edit' | 'Delete' | 'View';
}

const BasePlaneForm: React.FC<Props> = ({ formType}) => {
  const [planesData, setPlanesData] = useState<Entity[] | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const fetchData = async () => {
    try 
    {
      const response = await fetch(`${apiBaseUrl}/planes`);
      const data = await response.json();

      setPlanesData(data.planes);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
    }
  };

  
  const filteredData = planesData
    ? planesData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];


  return (
    <div className="form-container">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-9 col-lg-6">
            <h2 className="text-center">{`${formType} Planes`}</h2>
            
            {planesData ? (
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
                        <th>Plane ID</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Capacity</th>
                        {formType !== 'View' && (
                            <th>{`${formType}`}</th>
                          )} 
                        
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (                                    
                        <tr key={item.id}>
                          <td>{item.id}</td>                          
                          <td>{item.plane_id}</td>
                          <td>{item.name}</td>
                          <td>{item.model}</td>
                          <td>{item.capacity}</td>
                          {formType !== 'View' && (
                            //{/* Link to the EditFormComponent or DeleteFormComponent */}
                            <td>
                              <Link
                                to={`/planes/${formType.toLowerCase()}/${item.id}/${item.plane_id}/${item.model}/${item.name}`}
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
            ): (
                /**Show loading */
                <LoadingComponent />

              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasePlaneForm;
