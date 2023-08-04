import React, { useState, ChangeEvent, FormEvent, useEffect, useMemo, useCallback } from 'react';
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

type Seat = {
  seat_number: string;
  price: number;
  is_available: boolean;
  location_id: number;
};
  

const AddSeatForm = () => {
  
  const [formData, setFormData] = useState({
    seat_number: '',
    price: 0,
    is_available: false,      
    location_id: 0,
  });

  const { seat_number, price, is_available, location_id } = formData; // Destructuring formData here

  const [isLoading, setIsLoading] = useState(true);

  const [seatsAdded, setSeatsAdded] = useState<Seat[]>([]); // State to store the seats added by the user

  const [isEditing, setIsEditing] = useState(false);
  const [editingSeatIndex, setEditingSeatIndex] = useState<number | null>(null);

  const [selectedPlaneId, setSelectedPlaneId] = useState<number | null>(null);
  const [selectedFlightClassId, setSelectedFlightClassId] = useState<number | null>(null);
  
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [flightClasses, setFlightClasses] = useState<FlightClass[]>([]);
  const [seatLocations, setSeatLocations] = useState<SeatLocation[]>([]);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchPlanes();
    fetchFlightClasses();
    fetchSeatLocations();
  }, []);

  const fetchPlanes = async () => {
    setIsLoading(true);
    try 
    {
      const response = await fetch(`${apiBaseUrl}/planes`);
      const data = await response.json();
      setPlanes(data.planes);
      setIsLoading(false);
    } 
    catch (error: any) 
    {
      setIsLoading(false); 
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching planes:${error.message}`);
      console.error('Error fetching planes:', error);
    }
  };

  const fetchFlightClasses = async () => {
    setIsLoading(true); 
    try
    {
      const response = await fetch(`${apiBaseUrl}/flightClasses`); 
      const data = await response.json();
      setFlightClasses(data.items);
      setIsLoading(false); 
    } 
    catch (error: any) 
    {
      setIsLoading(false); 
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching flight classes:${error.message}`);
      console.error('Error fetching flight classes:', error);
    }
  };

  const fetchSeatLocations = async () => {
    setIsLoading(true); 

    try 
    {
      const response = await fetch(`${apiBaseUrl}/seatLocations`); 
      const data = await response.json();
      setSeatLocations(data.items);
      setIsLoading(false); 
    } 
    catch (error: any) 
    {
      setIsLoading(false); 
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching seat locations:${error.message}`);
      console.error('Error fetching seat locations:', error);
    }
  };


  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }, []);

  const handleEditSeat = (index: number) => {
    const seatToEdit = seatsAdded[index];
    setFormData(seatToEdit);
    setIsEditing(true);
    setEditingSeatIndex(index);
  };

  const handleDeleteSeat = (index: number) => {
      // When the user clicks on "Delete" for a seat, remove the seat from seatsAdded state
      setSeatsAdded((prevSeatsAdded) => {
        const updatedSeats = [...prevSeatsAdded];
        updatedSeats.splice(index, 1);
        return updatedSeats;
      });
      // If the seat being deleted was also in the editing mode, reset the form fields and editing index
      if (editingSeatIndex === index) 
      {
        setFormData({
          seat_number: '',
          price: 0,
          is_available: false,
          location_id: 0,
        });
        setEditingSeatIndex(null);
      }
  };

  const seatLocationMap = useMemo(() => {
     const locationMap: { [key: number]: string } = {};
     seatLocations.forEach((location) => {
       locationMap[location.id] = location.name;
     });
     return locationMap;
   }, [seatLocations]);
  

  const getLocationName = (locationId: number) => {
    return seatLocationMap[locationId] || '';
  };

  const handlePlaneChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaneId(parseInt(e.target.value));
  }, []);
  
  const handleFlightClassChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlightClassId(parseInt(e.target.value));
  }, []);
  
  const handleAddSeat = () => {

    // Validate form data
    if (seat_number.trim() === '' || price < 1 || location_id === 0)
    {
        // If any of the required fields are empty or 0, do not add the seat
        alert('Please fill all fields!');
        return;
    }

    const seatToAddOrUpdate =
    {
        is_available,
        seat_number,
        price,
        location_id,
    };

    if (isEditing && editingSeatIndex !== null) 
    {
        // If editing an existing seat, update the table
        const updatedSeats = [...seatsAdded];

        updatedSeats[editingSeatIndex] = seatToAddOrUpdate;

        setSeatsAdded(updatedSeats);
        setIsEditing(false);
        setEditingSeatIndex(null);
    }   
    else 
    {
        // Check if the seat with the same seat_number already exists in the seatsAdded array
        const seatAlreadyExists = seatsAdded.some((seatData) => seatData.seat_number === seat_number);
        
        if (seatAlreadyExists) 
        {
            // If the seat with the same seat_number already exists, do not add it again
            alert('Seat already in table!');
            return;
        }
        
        // When the user clicks on "Add Seat", add the current seat data to the seatsAdded state
        setSeatsAdded((prevSeatsAdded) => [...prevSeatsAdded, formData]);
      
        setFormData(
            {
              seat_number: '',
              price: 0,
              is_available: false,
              location_id: 0,
            }
          );
    }   
    
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (seatsAdded.length < 1) 
    {
        // If the seat with the same seat_number already exists, do not add it again
        alert('There are no seats to add!');
        return;
    }

    try 
    {
        setIsLoading(true); // Start loading data

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) 
        {
            console.error('CSRF token not found.');
            return;
        }

        // Create an array of seat objects to be submitted
        const seatsData = 
        {
            plane_id: selectedPlaneId,
            flight_class_id: selectedFlightClassId,
            seats: seatsAdded.map((seatData) => (
              {
                seat_number: seatData.seat_number,
                price: seatData.price,
                location_id: seatData.location_id,
              }
            )),
        };

        const response = await fetch(`${apiBaseUrl}/seats/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify(seatsData),
        });

        const data = await response.json();

        if (response.ok) 
        {
           setIsLoading(false); // Start loading data
           if (data.status) 
           {             
             setResponseStatus(1); // Success
             setResponseMessage(`Success: ${data.success}`);

             // Reset the seats added array after a successful submission
             setSeatsAdded([]);
           } 
           else 
           {
             setResponseStatus(0); // Error
             setResponseMessage(`Error: ${data.error}`);
           }
        }
        else 
        {
          setIsLoading(false); // Start loading data
          setResponseStatus(0); // Error
          setResponseMessage(`Error: ${data.error}`);
        }
    } 
    catch (error) 
    {
        setIsLoading(false); // Start loading data
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
      <h2 className="text-center">Add Seats</h2> 
      
      {isLoading ? (
        /**Show loading */
        <LoadingComponent />
      ) : (
      <div>
      
      <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label htmlFor="plane_id" className="form-label">Plane</label>
          <select
            name="plane_id"
            value={selectedPlaneId || ''}
            onChange={handlePlaneChange}
            className="form-select"
            required
          >
            <option value="">Select a plane</option>
            {planes && planes.length > 0 && planes.map((plane) => (
              <option key={plane.id} value={plane.id}>
                {plane.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="flight_class_id" className="form-label">Flight class</label>
          <select
            name="flight_class_id"
            value={selectedFlightClassId || ''}
            onChange={handleFlightClassChange}
            className="form-select"
            required
          >
            <option value="">Select a flight class</option>
            {flightClasses && flightClasses.length > 0 && flightClasses.map((flightClass) => (
              <option key={flightClass.id} value={flightClass.id}>
                {flightClass.name}
              </option>
            ))}
          </select>          
        </div>

        <hr
          style=
            {{
                height: '5px', // Adjust the thickness (height) as needed
                backgroundColor: 'black', // Change the color as needed
                border: 'none', // Remove the default border
                margin: '20px 0', // Add some margin for spacing
            }}
        />

        <div className="form-group">
            <label htmlFor="seat_number" className="form-label">Seat Number</label>
            <input
              type="text"
              name="seat_number"
              value={seat_number}
              onChange={handleChange}
              className="form-control"
              placeholder="Seat Number"
              maxLength={5}
            />
        </div>

        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Seat location</label>
          <select
            name="location_id"
            value={location_id }
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select a location</option>
            {seatLocations && seatLocations.length > 0 && seatLocations.map((seatLocation) => (
              <option key={seatLocation.id} value={seatLocation.id}>
                {seatLocation.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Seat Price (USD $)
          </label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={handleChange}
            className="form-control"
            placeholder="Seat Price"
          />
        </div>

        <div className="text-center mt-3">
          <button type="button" className="btn btn-primary" onClick={handleAddSeat}>
            {isEditing ? 'Save Changes' : 'Add Seat'}
          </button>          
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary ms-3">
            Submit Seats
          </button>
        </div>


        {isEditing && <div className="text-center text-info"><h3>Editing</h3></div>}

      </form>

      {/* Table to display multiple seats added before submision*/}
      {seatsAdded.length > 0 && (
        <div className="mt-4">
          <h3 className="form-label">Seats Added:</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Seat Price</th>                
                <th>Seat Location</th>
                <th>Edit</th> {/* Cell for Edit button */}
                <th>Delete</th> {/* Cell for Delete button */}
              </tr>
            </thead>
            <tbody>
              {seatsAdded.map((seatData, index) => (
                <tr key={index}>
                  <td>{seatData.seat_number}</td>
                  <td>{seatData.price}</td>                  
                  <td>{getLocationName(seatData.location_id)}</td> {/* Use getLocationName function */}
                  <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditSeat(index)}
                      >
                        Edit
                      </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteSeat(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </div>
    )}

    </div>
  );
};

export default AddSeatForm;
