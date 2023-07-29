import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../config';

import LoadingComponent from '../LoadingComponent';

interface Entity {
  id: number;
  name: string;
}

const DeleteFormComponent: React.FC = () => {
  const { selectedEntity, id, name, country, code, seat_number, plane, plane_id, flight_id } = useParams<{ selectedEntity: string; id: string; name: string; country: string; code: string; seat_number: string; plane: string; plane_id: string; flight_id: string; }>();

  const [isLoading, setIsLoading] = useState(true);

  const [itemName, setItemName] = useState<string>( name || '');
  const [itemId, setItemId] = useState<string>( id || '');

  const [flightNumber, setFlightNumber] = useState<string>('');
  const [planeId, setPlaneId] = useState<string>( '');

  const [itemCountry, setItemCountry] = useState<string | null >( country || null);
  const [itemCode, setItemCode] = useState<string | null>( code || null);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  
  const fetchData = async () => {
    setIsLoading(true);

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
      else if (seat_number) 
      {
        url += `/${seat_number}/${plane_id}`;
      }
      else if (flight_id) 
      {
        url += `/${flight_id}`;
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
      }
      else if (itemCode) 
      {
        setItemName(data.airline.name);
        setItemId(data.airline.id);
      }
      else if (seat_number) 
      {
        setItemName(data.seat.name);
        setItemId(data.seat.id);
      }
      else if(flight_id) 
      {
        setItemId(data.flight.id);
        setFlightNumber(data.flight.flight_number);
        setPlaneId(data.flight.plane.plane_id);
      }
      {
        setItemName(data.item.name);
        setItemId(data.item.id);
      }

      setIsLoading(false);

            
    } 
    catch (error) 
    {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        console.error('CSRF token not found.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/${selectedEntity}/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status) {
          setResponseStatus(1); // Success
          setResponseMessage(`Success: ${data.success}`);
        } else {
          setResponseStatus(0); // Error
          setResponseMessage(`Error: ${data.error}`);
        }
      } else {
        setResponseStatus(0); // Error
        setResponseMessage(`Error: ${data.error}`);
      }
    } 
    catch (error: any) 
    {
      setResponseStatus(0); // Error
      setResponseMessage(`Error deleting data. An error occurred.`);
      console.error('Error deleting data:', error);
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
    <div className="text-center col-sm-12 col-md-9 col-lg-6">
      <h2>Delete {seat_number ? 'Seats' : flight_id ? 'Flight' : 'Item'}</h2>
      {isLoading ? (
        /**Show loading */
        <LoadingComponent />
      ) : (
        <>
          <p>Are you sure you want to delete the following {seat_number ? 'seat' : itemName ? 'item' : 'flight'}?</p>

          {seat_number ? (
            <p>
              <b>Seat Number</b>: {seat_number}
            </p>
          ) : flight_id ? (
            <p>
              <b>Flight Number</b>: {flightNumber} <br/>
              <b>Plane Id</b>: {planeId}
            </p>
          ) : (
            <p>
              <b>Item Name</b>: {itemName}
            </p>
          )}

          <div className="text-center mt-3">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
          <p className={`response-message ${getResponseClass()} text-center mt-3`}>{responseMessage}</p>
        </>
      )}

      
    </div>
  );
};

export default DeleteFormComponent;
