import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import apiBaseUrl from '../../config';


// Define the types for your data
type Plane = {
    id: number;
    name: string;
    // other properties...
  };

type FlightClass = {
  id: number;
  name: string;
  // other properties...
};

type SeatLocation = {
  id: number;
  name: string;
  // other properties...
};

type Seat = {
    id: number;
    seat_number: string;
    price: number;
    is_available: boolean;
    plane_id: number;
    flight_class_id: number;
    location_id: number;
    // Add any other properties if needed
  };

  type SeatFormData = {
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


  const [seatsAdded, setSeatsAdded] = useState<SeatFormData[]>([]); // State to store the seats added by the user

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
    try 
    {
      const response = await fetch(`${apiBaseUrl}/planes`);
      const data = await response.json();
      setPlanes(data.planes);
    } 
    catch (error) 
    {
      setResponseStatus(0); // Error
      setResponseMessage('Error fetching planes: An error occurred');
      console.error('Error fetching planes:', error);
    }
  };

  const fetchFlightClasses = async () => {
    try
    {
      const response = await fetch(`${apiBaseUrl}/flightClasses`); 
      const data = await response.json();
      setFlightClasses(data.items);
    } 
    catch (error) 
    {
      setResponseStatus(0); // Error
      setResponseMessage('Error fetching flight classes: An error occurred');
      console.error('Error fetching flight classes:', error);
    }
  };

  const fetchSeatLocations = async () => {
    try 
    {
      const response = await fetch(`${apiBaseUrl}/seatLocations`); 
      const data = await response.json();
      setSeatLocations(data.items);
    } 
    catch (error) 
    {
      setResponseStatus(0); // Error
      setResponseMessage('Error fetching seat locations: An error occurred');
      console.error('Error fetching seat locations:', error);
    }
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    if (editingSeatIndex === index) {
      setFormData({
        seat_number: '',
        price: 0,
        is_available: false,
        location_id: 0,
      });
      setEditingSeatIndex(null);
    }
  };

  const handlePlaneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaneId(parseInt(e.target.value));
  };

  const handleFlightClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlightClassId(parseInt(e.target.value));
  };

  const handleAddSeat = () => {

    // Validate form data
    if (
      formData.seat_number.trim() === '' ||
      formData.price === 0 ||
      formData.price < 0 ||
      formData.price === 0 ||
      formData.location_id === 0
    ) {
      // If any of the required fields are empty or 0, do not add the seat
      alert('Please fill all fields!');
      return;
    }

    const seatToAddOrUpdate = {
      is_available: false,
      seat_number: formData.seat_number,
      price: formData.price,
      location_id: formData.location_id,
    };

    if (isEditing && editingSeatIndex !== null) {
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
    const seatAlreadyExists = seatsAdded.some(
      (seatData) => seatData.seat_number === formData.seat_number
    );

    if (seatAlreadyExists) {
      // If the seat with the same seat_number already exists, do not add it again
      alert('Seat already in table!');
      return;
    }
      // When the user clicks on "Add Seat", add the current seat data to the seatsAdded state
    setSeatsAdded((prevSeatsAdded) => [...prevSeatsAdded, formData]);

    setFormData({
        seat_number: '',
        price: 0,
        is_available: false,
        location_id: 0,
      });
    }

    
    
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try 
    {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) 
      {
        console.error('CSRF token not found.');
        return;
      }

      // Create an array of seat objects to be submitted
      const seatsData = {
        plane_id: selectedPlaneId,
        flight_class_id: selectedFlightClassId,
        seats: seatsAdded.map((seatData) => ({
          seat_number: seatData.seat_number,
          price: seatData.price,
          location_id: seatData.location_id,
        })),
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
      <h2 className="text-center">Add Seats</h2> 
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
        style={{
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
            value={formData.seat_number}
            onChange={handleChange}
            className="form-control"
            placeholder="Seat Number"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Seat location</label>
          <select
            name="location_id"
            value={formData.location_id }
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a location</option>
            {seatLocations && seatLocations.length > 0 && seatLocations.map((seatLocation) => (
              <option key={seatLocation.id} value={seatLocation.id}>
                {seatLocation.name}
              </option>
            ))}
          </select>
        </div>

      {/* Seat Price Input Field */}
      <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Seat Price (USD $)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            placeholder="Seat Price"
            required
          />
        </div>

        <div className="text-center mt-3">
          <button type="button" className="btn btn-primary" onClick={handleAddSeat}>
            Add Seat
          </button>
          <button type="submit" className="btn btn-primary ms-3">
            Create Seats
          </button>
        </div>
      </form>

      {/* Table to display the seats added */}
      {seatsAdded.length > 0 && (
        <div className="mt-4">
          <h3 className="form-label">Seats Added:</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Seat Price</th>                
                <th>Location ID</th>
                <th>Edit</th> {/* Cell for Edit button */}
                <th>Delete</th> {/* Cell for Delete button */}
              </tr>
            </thead>
            <tbody>
              {seatsAdded.map((seatData, index) => (
                <tr key={index}>
                  <td>{seatData.seat_number}</td>
                  <td>{seatData.price}</td>                  
                  <td>{seatData.location_id}</td>
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
      <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
    </div>
  );
};

export default AddSeatForm;
