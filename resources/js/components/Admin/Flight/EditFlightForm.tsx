import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';
import { useParams, useNavigate } from 'react-router-dom';

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

type FlightStatus = {
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
  const [flight_statuses, setFlightStatuses] = useState<FlightStatus[]>([]);

  const [isDropdownsDataLoading, setDropdownsDataLoading] = useState(true);


  const [formData, setFormData] = useState({
    airline_id: '',
    plane_id: '',
    is_international: false,
    departure_time: '',
    arrival_time: '',
    return_time: '',
    flight_status_id: '',
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
      Promise.all([
        fetch(`${apiBaseUrl}/airlines`),
        fetch(`${apiBaseUrl}/planes`),
        fetch(`${apiBaseUrl}/cities`),
        fetch(`${apiBaseUrl}/flightStatuses`),
      ])
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then(
          ([
            airlinesData,
            planesData,
            citiesData,
            flightStatusesData,
          ]) => {
            // Do something with the fetched data
            setAirlines(airlinesData.airlines);
            setPlanes(planesData.planes);
            setCities(citiesData.cities);
            setFlightStatuses(flightStatusesData.items);
          }
        )
        .catch((error) => {
          // Handle any errors that occurred during fetching
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setDropdownsDataLoading(false);
          setIsLoading(false);
        });
      

    } 
    catch (error: any) 
    {      
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data: An error occured.');
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

      if(!isDropdownsDataLoading)
          setIsLoading(false);

    }
    catch (error: any) 
    {
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data: An error occurred.');
      console.error('Error fetching data:', error);
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

      const navigate = useNavigate();
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) 
      {
        console.error('CSRF token not found.');
        setIsLoading(false);

        navigate('/signin');
        return;
      }

      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        // Redirect to the sign-in page if the accessToken is not set
        navigate('/signin');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/flights/change/${prevFlightId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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
      setResponseMessage('Error submitting data: Make sure the dates are set correctly just in case');
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
      {isLoading ? (
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
              <div className="form-group">
                <label htmlFor="flight_status_id">Flight Status</label>
                <select
                  id="flight_status_id"
                  className="form-control"
                  name="flight_status_id"
                  value={formData.flight_status_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a flight status</option>
                  {flight_statuses.map((flight_status) => (
                    <option key={flight_status.id} value={flight_status.id}>
                      {flight_status.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="departureTime">Departure Date/Time</label>
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
                <label htmlFor="arrivalTime">Arrival Date/Time</label>
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
                <label htmlFor="returnTime">Return Date/Time</label>
                <input
                  type="datetime-local"
                  id="returnTime"
                  className="form-control"
                  name="return_time"
                  value={formData.return_time}
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
              <div className="form-group m-3">
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
