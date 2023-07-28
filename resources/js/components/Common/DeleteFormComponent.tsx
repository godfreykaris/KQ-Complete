import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../config';

interface Entity {
  id: number;
  name: string;
}

const DeleteFormComponent: React.FC = () => {
  const { selectedEntity, id, name } = useParams<{ selectedEntity: string; id: string; name: string }>();

  const [itemName, setItemName] = useState<string>( name || '');
  const [itemId, setItemId] = useState<string>( id || '');

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    if (name) {
      fetchData(name);
    }
  }, [name]);

  const fetchData = async (itemName: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${selectedEntity}/${itemName}`);
      const data = await response.json();
      setItemName(data.item.name);
      setItemId(data.item.id);
    } catch (error) {
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
    } catch (error) {
      setResponseStatus(0); // Error
      setResponseMessage('Error deleting data: An error occurred');
      console.error('Error deleting data:', error);
    }
  };

  const getResponseClass = () => {
    if (responseStatus === 1) {
      return 'text-success'; // Green color for success
    } else if (responseStatus === 0) {
      return 'text-danger'; // Red color for error
    } else {
      return ''; // No specific styles (default)
    }
  };

  return (
    <div className="col-md-6">
      <h2>Delete Item</h2>

      <p>Are you sure you want to delete the following item?</p>
      <p>{itemName}</p>
      <div className="text-center mt-3">
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <p className={`response-message ${getResponseClass()} text-center mt-3`}>{responseMessage}</p>
    </div>
  );
};

export default DeleteFormComponent;
