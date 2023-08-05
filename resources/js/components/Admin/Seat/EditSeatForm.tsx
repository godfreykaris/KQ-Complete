import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';

type Plane = {
  id: number;
  name: string;
};

type FlightClass = {
  id: number;
  name: string;
};

type SeatLocation = {
  id: number;
  name: string;
};



const EditSeatForm: React.FC = () => {
  const { plane_id, flight_class_id, location_id, price, seat_number } = useParams<{
    plane_id: string;
    location_id: string;
    flight_class_id: string;
    seat_number: string;
    price: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);

  const [prevSeatNumber, setPrevSeatNumber] = useState<string>(seat_number || '');
  const [prevPlaneId, setPrevPlaneId] = useState<string>(plane_id || '');


  const [seatNumber, setSeatNumber] = useState<string>(seat_number || '');
  const [seatPrice, setSeatPrice] = useState<number>(price ? parseFloat(price) : 0);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(location_id ? parseInt(location_id) : 0);
  const [selectedPlaneId, setSelectedPlaneId] = useState<number>(plane_id ? parseInt(plane_id) : 0);
  const [selectedFlightClassId, setSelectedFlightClassId] = useState<number>(flight_class_id ? parseInt(flight_class_id) : 0);

  const [planes, setPlanes] = useState<Plane[]>([]);
  const [flightClasses, setFlightClasses] = useState<FlightClass[]>([]);
  const [seatLocations, setSeatLocations] = useState<SeatLocation[]>([]);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try 
    {
      const [planesResponse, flightClassesResponse, seatLocationsResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/planes`),
        fetch(`${apiBaseUrl}/flightClasses`),
        fetch(`${apiBaseUrl}/seatLocations`),
      ]);

      const [planesData, flightClassesData, seatLocationsData] = await Promise.all([
        planesResponse.json(),
        flightClassesResponse.json(),
        seatLocationsResponse.json(),
      ]);

      setPlanes(planesData.planes);
      setFlightClasses(flightClassesData.items);
      setSeatLocations(seatLocationsData.items);

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

  const handleSaveChanges = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try 
    {
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

      const seatData = {
        seat_number: seatNumber,
        price: seatPrice,
        location_id: selectedLocationId,
        plane_id: selectedPlaneId,
        flight_class_id: selectedFlightClassId,
      };

      const response = await fetch(`${apiBaseUrl}/seats/change/${prevPlaneId}/${prevSeatNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(seatData),
      });

      const data = await response.json();

      if (response.ok) 
      {
        if (data.status) 
        {
          setResponseStatus(1); // Success
          setResponseMessage(`Success: ${data.success}`);
          
          setPrevSeatNumber(seatNumber);
          setPrevPlaneId(selectedPlaneId.toString());
        } 
        else 
        {
          setResponseStatus(0); // Error
          setResponseMessage(`Error: ${data.error}`);
        }
      } 
      else {
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
      <h2 className="text-center">Edit Seat</h2>
      {isLoading ? (
          /**Show loading */
          <LoadingComponent />
        ): (  
         <>
            <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

            <form onSubmit={handleSaveChanges}>
              {/* Add plane and flight class selection */}
              <div className="form-group">
                <label htmlFor="planeId">Plane</label>
                <select
                  id="planeId"
                  className="form-control"
                  value={selectedPlaneId || ''}
                  onChange={(e) => setSelectedPlaneId(parseInt(e.target.value))}
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
                <label htmlFor="flightClassId">Flight Class</label>
                <select
                  id="flightClassId"
                  className="form-control"
                  value={selectedFlightClassId || ''}
                  onChange={(e) => setSelectedFlightClassId(parseInt(e.target.value))}
                  required
                >
                  <option value="">Select a flight class</option>
                  {flightClasses.map((flightClass) => (
                    <option key={flightClass.id} value={flightClass.id}>
                      {flightClass.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="seatNumber">Seat Number</label>
                <input
                  type="text"
                  id="seatNumber"
                  className="form-control"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="seatPrice">Seat Price (USD $)</label>
                <input
                  type="number"
                  id="seatPrice"
                  className="form-control"
                  value={seatPrice}
                  onChange={(e) => setSeatPrice(parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="seatLocation">Seat Location</label>
                <select
                  id="seatLocation"
                  className="form-control"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(parseInt(e.target.value))}
                  required
                >
                  <option value="">Select a location</option>
                  {seatLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
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

export default EditSeatForm;
