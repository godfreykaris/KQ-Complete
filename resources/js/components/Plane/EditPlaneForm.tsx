import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../config';


const EditPlaneForm: React.FC = () => {
  const { id, planeId, model, name } = useParams<{ id: string; planeId: string; model: string; name: string; }>();

  const [itemId, setItemId] = useState<string>(id || '');
  const [itemName, setItemName] = useState<string>(name || '');

  const [planeModel, setPlaneModel] = useState<string>(model || '');
  const [planeCapacity, setPlaneCapacity] = useState<number>(0);


  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    if (planeId) {
      fetchData(planeId);
    }
  }, [planeId]);

  const fetchData = async (planeId: string) => {
    try {

      const response = await fetch(`${apiBaseUrl}/planes/${planeId}`);

      const data = await response.json();
      
      if (data.plane) 
      {
        setItemName(data.plane.name);
        setItemId(data.plane.id);
        setPlaneModel(data.plane.model);
        setPlaneCapacity(data.plane.capacity);
      }     
      
    } 
    catch (error) 
    {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if ( itemId && planeId && itemName && planeModel && (planeCapacity > 0)) 
    {
      try 
      {
         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

         if (!csrfToken) 
         {
           console.error('CSRF token not found.');
           return;
         }

         const requestData = {
            id: itemId,
            name: itemName,
            plane_id: planeId,
            model: planeModel,
            capacity: planeCapacity
            
          };

         const response = await fetch(`${apiBaseUrl}/planes/change/${planeId}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
             'X-CSRF-TOKEN': csrfToken,
           },
           body: JSON.stringify(requestData),
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
      <h2>Edit Plane</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="form-group">
          <label htmlFor="inputName">Name</label>
          <input
            type="text"
            id="inputName"
            className="form-control"
            name="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
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
            value={planeModel}
            onChange={(e) => setPlaneModel(e.target.value)}
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
            value={planeCapacity}
            onChange={(e) => setPlaneCapacity(Number(e.target.value))}
            required
          />
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
      <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
    </div>
  );
};

export default EditPlaneForm;
