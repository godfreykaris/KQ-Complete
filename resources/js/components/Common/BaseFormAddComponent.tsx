
import React, { useState } from 'react';

import apiBaseUrl from '../../config'

import { useNavigate } from 'react-router-dom';


  interface EntityType {
    entityType: string;
    value: string;
  }
  
  interface Props {
    dataCategory: string;
    entityTypes: EntityType[] | null;
  }

    
  const BaseFormAddComponent: React.FC<Props> = ({ dataCategory, entityTypes }) => {
    // State variables to store user inputs
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [code, setCode] = useState<string>('');



    // State variables to store responses
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
  
    // Event handler for the entity selection dropdown
    const handleEntityChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
    {
      setSelectedEntity(event.target.value);
    };
  
    // Event handler for the name input field
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    };

    // Event handler for the country input field
    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCountry(event.target.value);
    };

    // Event handler for the code input field
    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
    };

    // Event handler for form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if ( name && (selectedEntity  ||  country || code)) 
        {
            try 
            {
                const navigate = useNavigate();
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
              
                if (!csrfToken) 
                {
                  console.error('CSRF token not found.');
                
                  navigate('/signin');
                  return;
                }
              
                const accessToken = sessionStorage.getItem('access_token');
                if (!accessToken) {
                  // Redirect to the sign-in page if the accessToken is not set
                  navigate('/signin');
                  return;
                }
                
                const requestData = {
                  name,
                  ...(dataCategory === 'city' && { country }),
                  ...(dataCategory === 'airline' && { code }),
                };

                // Determine the item based on selectedEntity or dataCategory
                const item = selectedEntity || (dataCategory === 'city' ? 'cities' : dataCategory === 'airline' ? 'airlines' : '');

                const response = await fetch(`${apiBaseUrl}/${item}/add`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify(requestData),
                });
              
                const data = await response.json();

                if (response.ok) 
                {
                    if(data.status)
                    {
                        setResponseStatus(1); // Success
                        setResponseMessage(`Success: ${data.success}`);
                    }
                    else
                    {
                        setResponseStatus(0); // Error
                        setResponseMessage(`Error: ${data.error}`);
                    }
                    
                    setName(''); // Clear the input field after successful submission
                } 
                else 
                {
                    setResponseStatus(0); // Error
                    setResponseMessage(`Error: ${data.error}`);
                }
            } 
            catch (error) 
            {
                setResponseStatus(0); // Error
                setResponseMessage('Error submitting data: An error occurred');
                console.error('Error submitting data:', error);
            }
        }
      };

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

    // JSX code for the form component
    return (
        <div className="form-container">
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-sm-12 col-md-9 col-lg-6">
                <h2 className="text-center">Add Data</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                    {entityTypes !== null && (
                        <div>
                          <label htmlFor="selectEntity" className="form-label">
                            You can select a:
                          </label>

                          {/* Use an unordered list to display the entity types */}
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
                            {entityTypes.map((entityType) =>
                              entityType.entityType ? (
                                <option key={entityType.value} value={entityType.value}>
                                  {entityType.entityType}
                                </option>
                              ) : null
                            )}
                            {/* Add more options for other entities as needed */}
                          </select>
                        </div>
                      )}

                    </div>
            
                    {((selectedEntity && dataCategory === 'other') ||  dataCategory === 'city' || dataCategory === 'airline') && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="inputName">Name</label>
                          <input
                            type="text"
                            id="inputName"
                            className="form-control"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Enter name"
                            required
                          />
                        </div>
                        {dataCategory === 'city' && (
                            <div className="form-group">
                              <label htmlFor="inputCountry">Country</label>
                              <input
                                type="text"
                                id="inputCountry"
                                className="form-control"
                                value={country}
                                onChange={handleCountryChange}
                                placeholder="Enter Country"
                                required
                              />
                            </div>
                          )}

                        {dataCategory === 'airline' && (
                            <div className="form-group">
                              <label htmlFor="inputCode">Code</label>
                              <input
                                type="text"
                                id="inputCode"
                                className="form-control"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="Enter Code"
                                required
                              />
                            </div>
                          )}
                        
                        <div className="text-center mt-3">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                          
                      </div>
                    )}
                                      

                  {/* Display response message with appropriate styles */}
                  <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
  
    );
};

export default BaseFormAddComponent;