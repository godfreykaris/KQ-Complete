
import React, { useState } from 'react';

import apiBaseUrl from '../config'

interface Model 
  {
    id: number;
    name: string;
  }
  
  const BaseFormComponent: React.FC = () => {
    // State variables to store user inputs
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [name, setName] = useState<string>('');

    // State variables to store responses
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
  
    // Event handler for the entity selection dropdown
    const handleEntityChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
    {
      setSelectedEntity(event.target.value);
    };
  
    // Event handler for the name input field
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
      setName(event.target.value);
    };
  
    // Event handler for form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (selectedEntity && name) 
        {
            try 
            {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
                if (!csrfToken) 
                {
                  console.error('CSRF token not found.');
                  return;
                }

                const response = await fetch(`${apiBaseUrl}/${selectedEntity}/add`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                  },
                  body: JSON.stringify({ name }),
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
              <div className="col-md-6">
                <h2 className="text-center">Add Data</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="selectEntity">Select an Entity</label>
                      <select
                        id="selectEntity"
                        className="form-control"
                        value={selectedEntity}
                        onChange={handleEntityChange}
                      >
                        <option value="">Select an Entity</option>
                        <option value="skills">Skill</option>
                        <option value="qualifications">Qualification</option>
                        {/* Add more options for other entities as needed */}
                      </select>
                    </div>
            
                    {selectedEntity && (
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
                          />
                        </div>
                        <div className="text-center mt-3">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Display response message with appropriate styles */}
                  <p className={`response-message ${getResponseClass()}`}>{responseMessage}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
  
    );
};

export default BaseFormComponent;