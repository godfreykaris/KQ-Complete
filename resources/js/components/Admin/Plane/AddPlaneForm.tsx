import React, { useState, ChangeEvent, FormEvent } from 'react';
import apiBaseUrl from '../../../config';

const AddPlaneForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    capacity: '',
  });


  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        console.error('CSRF token not found.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/planes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) 
      {
         if (data.status) 
         {
           setResponseStatus(1); // Success
           setResponseMessage(`Success: ${data.success}`);
         } 
         else 
         {
           setResponseStatus(0); // Error
           setResponseMessage(`Error: ${data.error}`);
         }
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

  return (
    <div className="form-container col-md-4">
      <h2>Add Plane</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inputName">Name</label>
          <input
            type="text"
            id="inputName"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputModel">Model</label>
          <input
            type="text"
            id="inputModel"
            className="form-control"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputCapacity">Capacity</label>
          <input
            type="number"
            id="inputCapacity"
            className="form-control"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">
            Add Plane
          </button>
        </div>
      </form>
      <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
    </div>
  );
};

export default AddPlaneForm;
