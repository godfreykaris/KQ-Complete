import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../../config';

import LoadingComponent from '../LoadingComponent';


type Opening = {
    id:number,
    
    title: '',
    description: '',
    qualifications: [],
    skills: [],
};

const ViewOpenings: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);

  
  const [openings, setOpenings] = useState<Opening[] | null>(null);

  const [filterValue, setFilterValue] = useState<string>('');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchOpenings();    
  }, []); // Empty dependency array ensures the effect runs only once on mount

  

  const fetchOpenings = async () => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/openings`);
      const data = await response.json();
      setOpenings(data.openings);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  
  const filteredData = openings
    ? openings.filter((item) =>
        item.title.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];


  const getResponseClass = () => {
    
      if (responseStatus === 1) 
      {
        return 'text-success'; // Green color for success
      } 
      else if (responseStatus === 0) 
      {
        return 'text-danger'; // Red color for error
      } 
      else 
      {
        return ''; // No specific styles (default)
      }
  };

  return (
    <div className="form-container ">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <h2 className="text-center">View Openings</h2>
            {isLoading ? (
                /**Show loading */
                <LoadingComponent />
            ): (                
                <>
                    <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
                        
                    { openings && (
                     <>
                      <div>
                        <input
                          type="text"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="form-control mb-3 mt-3"
                          placeholder="Filter by opening title"
                        />

                        <div className="table-responsive">
                          {/* Display the data in a table */}
                          <table className="table">
                            <thead>
                              <tr>
                                <th>*</th>
                                <th>Edit</th>
                                <th>Delete</th>     
                                <th>Title</th>
                                <th>Description</th>                                                                                           
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (  
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <Link
                                      to={`/manage_openings/edit/${item.id}`} // Replace "edit-opening" with the actual URL for the EditOpeningComponent
                                      className="btn btn-primary"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/manage_openings/delete/openings/${item.id}`} // Replace "delete-opening" with the actual URL for the DeleteOpeningComponent
                                      className="btn btn-danger"
                                    >
                                      Delete
                                    </Link>
                                  </td>
                                  <td>{item.title}</td>
                                  <td>{item.description}</td>                                                                                                                     
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      </>
                    )}
                    </>                

              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOpenings;
