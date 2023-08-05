import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../config';


const EditFormComponent: React.FC = () => {
  const { selectedEntity, dataCategory, id, name, country, code } = useParams<{ selectedEntity: string; dataCategory: string; id: string; name: string; country: string; code: string; }>();

  const [itemId, setItemId] = useState<string>(id || '');
  const [itemName, setItemName] = useState<string>(name || '');

  const [itemCountry, setItemCountry] = useState<string | null >( country || null);
  const [itemCode, setItemCode] = useState<string | null>( code || null);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    if (itemName) {
      fetchData(itemName);
    }
  }, [itemName]);

  const fetchData = async (itemName: string) => {
    try {

      let url = `${apiBaseUrl}/${selectedEntity}`;

      if (itemCountry) 
      {
        url += `/${itemName}/${itemCountry}`;
      }
      else if (itemCode) 
      {
        url += `/${itemCode}`;
      }
      else
      {
        url += `/${itemName}`;
      }

      const response = await fetch(url);

      const data = await response.json();
      
      if (itemCountry) 
      {
        setItemName(data.city.name);
        setItemId(data.city.id);
        setItemCountry(data.city.country);
      }
      else if (itemCode) 
      {
        setItemName(data.airline.name);
        setItemId(data.airline.id);
        setItemCode(data.airline.code);
      }
      else
      {
        setItemName(data.item.name);
        setItemId(data.item.id);
      }
      
    } 
    catch (error) 
    {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (itemName && (selectedEntity  ||  itemCountry || itemCode) ) 
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
            ...(selectedEntity === 'cities' && { country: itemCountry }),
            ...(selectedEntity === 'airlines' && { code: itemCode }),
          };

         const response = await fetch(`${apiBaseUrl}/${selectedEntity}/change/${itemId}`, {
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
    <div className="col-sm-12 col-md-9 col-lg-6">
      <h2>Edit Item</h2>
      <form onSubmit={handleSaveChanges}>
        
        {(selectedEntity) && (
          <div>
            <div className="form-group">
              <label htmlFor="inputName">Name</label>
              <input
                type="text"
                id="inputName"
                className="form-control"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            {itemCountry && (
                <div className="form-group">
                  <label htmlFor="inputCountry">Country</label>
                  <input
                    type="text"
                    id="inputCountry"
                    className="form-control"
                    value={itemCountry}
                    onChange={(e) => setItemCountry(e.target.value)}
                    placeholder="Enter Country"
                    required
                  />
                </div>
              )}

            {itemCode && (
                <div className="form-group">
                  <label htmlFor="inputCode">Code</label>
                  <input
                    type="text"
                    id="inputCode"
                    className="form-control"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    placeholder="Enter Code"
                    required
                  />
                </div>
              )}         
            
              
          </div>
        )}
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

export default EditFormComponent;
