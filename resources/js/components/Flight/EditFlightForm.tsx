import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../config';

import LoadingComponent from '../LoadingComponent';
import { useParams } from 'react-router-dom';

type Plane = {
    id: number;
    name: string;
};

type SeatLocation = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

type Airline = {
  id: number;
  name: string;
};

const EditFlightForm = () => {
  
  const { flight_id} = useParams<{flight_id: string; }>();

  const [isLoading, setIsLoading] = useState(true);

  const [prevFlightId, setPrevFlightId] = useState<string>(flight_id || '');

  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [formData, setFormData] = useState({
    airline_id: '',
    plane_id: '',
    is_international: false,
    departure_time: '',
    arrival_time: '',
    departure_city_id: '',
    arrival_city_id: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchFlight();
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try 
    {
      const [
        airlinesResponse,
        planesResponse,
        citiesResponse,
      ] = await Promise.all([
        fetch(`${apiBaseUrl}/airlines`),
        fetch(`${apiBaseUrl}/planes`),
        fetch(`${apiBaseUrl}/cities`),
      ]);

      const [
        airlinesData,
        planesData,
        citiesData,
      ] = await Promise.all([
        airlinesResponse.json(),
        planesResponse.json(),
        citiesResponse.json(),
      ]);

      setAirlines(airlinesData.airlines);
      setPlanes(planesData.planes);
      setCities(citiesData.cities);
      setIsLoading(false);

    } 
    catch (error: any) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  };

  const fetchFlight = async () => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/flights/${prevFlightId}`);
      const data = await response.json();
      setFormData(data.flight);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try 
    {

      if(formData.departure_city_id == formData.arrival_city_id)
      {
        alert('Departure City and Arrival City cannot be the same!');
        setIsLoading(false);
        return;
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) 
      {
        console.error('CSRF token not found.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/flights/change/${prevFlightId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
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
          // Redirect to the flights list page after successful creation
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

      setIsLoading(false);

    } 
    catch (error: any) 
    {
      setIsLoading(false);
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
    <div className="col-sm-12 col-md-4">
      <h2 className="text-center">Edit Flight</h2>
      {((isLoading) || (!formData.airline_id) || (!formData.plane_id)) ? (
        /**Show loading */
        <LoadingComponent />
      ) : (
        <>
            <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

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
              <div className="form-group m-2">
                <label htmlFor="isInternational">Is International</label>
                <input
                  type="checkbox"
                  id="isInternational"
                  name="is_international"
                  className="m-2"
                  checked={formData.is_international}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="departureTime">Departure Time</label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  className="form-control"
                  name="departure_time"
                  value={formData.departure_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="arrivalTime">Arrival Time</label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  className="form-control"
                  name="arrival_time"
                  value={formData.arrival_time}
                  onChange={handleChange}
                  required
                />
              </div>
                        
              <div className="form-group">
                <label htmlFor="departureCityId">Departure City</label>
                <select
                  id="departureCityId"
                  className="form-control"
                  name="departure_city_id"
                  value={formData.departure_city_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a departure city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="arrivalCityId">Arrival City</label>
                <select
                  id="arrivalCityId"
                  className="form-control"
                  name="arrival_city_id"
                  value={formData.arrival_city_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an arrival city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center mt-3">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </>
      )}
    </div>
  );
};

export default EditFlightForm;
