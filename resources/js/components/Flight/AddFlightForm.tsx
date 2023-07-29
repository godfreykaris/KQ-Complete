import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import apiBaseUrl from '../../config';

const AddFlightForm = () => {
  const [airlines, setAirlines] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [flightStatuses, setFlightStatuses] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    airline_id: '',
    plane_id: '',
    is_international: false,
    departure_time: '',
    arrival_time: '',
    flight_status_id: '',
    departure_city_id: '',
    arrival_city_id: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);

  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        airlinesResponse,
        planesResponse,
        flightStatusesResponse,
        citiesResponse,
      ] = await Promise.all([
        fetch(`${apiBaseUrl}/airlines`),
        fetch(`${apiBaseUrl}/planes`),
        fetch(`${apiBaseUrl}/flightStatuses`),
        fetch(`${apiBaseUrl}/cities`),
      ]);

      const [
        airlinesData,
        planesData,
        flightStatusesData,
        citiesData,
      ] = await Promise.all([
        airlinesResponse.json(),
        planesResponse.json(),
        flightStatusesResponse.json(),
        citiesResponse.json(),
      ]);

      setAirlines(airlinesData.airlines);
      setPlanes(planesData.planes);
      setFlightStatuses(flightStatusesData.flightStatuses);
      setCities(citiesData.cities);
    } catch (error) {
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        console.error('CSRF token not found.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status) {
          setResponseStatus(1); // Success
          setResponseMessage(`Success: ${data.success}`);
          // Redirect to the flights list page after successful creation
          history.push('/flights');
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
      setResponseMessage('Error submitting data: An error occurred');
      console.error('Error submitting data:', error);
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
    <div className="col-md-8">
      <h2>Add New Flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="airline_id">Airline</label>
          <select
            id="airline_id"
            className="form-control"
            name="airline_id"
            value={formData.airline_id}
            onChange={handleChange}
            required
          >
            <option value="">Select an airline</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add other form fields for plane, is_international, departure_time, arrival_time, flight_status_id, departure_city_id, and arrival_city_id */}
        {/* Example: */}
        <div className="form-group">
          <label htmlFor="plane_id">Plane</label>
          <select
            id="plane_id"
            className="form-control"
            name="plane_id"
            value={formData.plane_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a plane</option>
            {planes.map((plane) => (
              <option key={plane.id} value={plane.id}>
                {plane.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add other form fields here */}
        <div className="form-check">
          <input
            type="checkbox"
            id="is_international"
            className="form-check-input"
            name="is_international"
            checked={formData.is_international}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="is_international">
            International Flight
          </label>
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">
            Add Flight
          </button>
        </div>
        <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
      </form>
    </div>
  );
};

export default AddFlightForm;
