import React, { FormEvent, useEffect, useState } from "react";
import { Container, Form, Button, Table, Modal, Spinner } from "react-bootstrap";
import EditPassenger from "./editpassenger.js";
import PassengerSeat from "../seats/viewseat.js";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import {Col} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiBaseUrl from "../../../../../config.js";
import LoadingComponent from "../../../../Common/LoadingComponent.js";
import { useEditBookingContext } from "../../context/booking/editbookingcontext.js";


interface FlightClass{
  id: number;
  name: string;
}

interface Location{
  id: number;
  name: string;
}

interface Seat{
  id: number | 0;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: 0;
}

interface Passenger {
  id: number;
  passenger_id: string;
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat: Seat;
}

export default function ChangePassenger() {
  const [formData, setFormData] = useState({
    bookingReference: "",
    ticketNumber: ""
  });

  const {bookingReference, setBookingReference, ticketNumber, setTicketNumber} = useEditBookingContext();

  useEffect(() => {
    setBookingReference(formData.bookingReference);
    setTicketNumber(formData.ticketNumber);
  }, [bookingReference, formData.bookingReference, ticketNumber, formData.ticketNumber]);

  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [refError, setRefError] = useState("");

  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers

    let prefix = ""; // Initialize prefix based on context

    if (name === "bookingReference") 
    {
        prefix = "KQ-BR-"; // Booking reference prefix
    } 
    else if (name === "ticketNumber") 
    {
        prefix = "KQ-TK-"; // Ticket number prefix
    }

    if (sanitizedValue.length <= 10) 
    {
        const newValue = `${prefix}${sanitizedValue.slice(4, 11)}`; // Use the first 7 characters
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
        setRefError(""); // Clear any previous errors
    } 
    else 
    {
        setRefError("The input must be the appropriate prefix followed by 6 characters or less");
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    fetchPassengers();
  };

  const fetchPassengers = async () => {
    setIsLoading(true);
    setRefError("");

    try 
    {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) 
        {
          console.error('CSRF token not found.');
          setIsLoading(false);

          navigate('/');
          return;
        }

        const response = await fetch(`${apiBaseUrl}/passengers/get/${formData.bookingReference}/${formData.ticketNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': csrfToken,
          },
        });

        const data = await response.json();

        if (response.ok) 
        {
          if (data.status) 
          {
            setResponseStatus(1); // Success
            setResponseMessage(`Success: ${data.success} You can now edit passengers.`);

            setPassengers(data.passengers);
            setFlightId(data.flightId);

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
          setResponseMessage(`Error: ${response.statusText}`);
        }

        setIsLoading(false);

      } 
      catch (error) 
      {
        setIsLoading(false);
        setResponseStatus(0); // Error
        setResponseMessage('Error submitting data. Please try again or contact support.');
        console.error('Error submitting data:', error);
      }
  };

  //handling the edit button click
  const [isButtonClicked, setIsButtonClicked] = useState(true); // Set to true to show modals

  //handle the seat button click
  //states to set visibility of the modal
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [passengerSeat, setPassengerSeat] = useState<Seat>();
  const [passengerData, setPassengerData] = useState<Passenger>();
  const [flightId, setFlightId] = useState('');


  const handleSeat = (passengerSeatData: Seat) => {
    setIsButtonClicked(true);
    setPassengerSeat(passengerSeatData);
    setShowSeatModal(true);
  };


  const handleCloseSeatModal = () => {
    setShowSeatModal(false);
  };

  //the edit passenger button
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEdit = (passengerData: Passenger) => {
    setPassengerData(passengerData);
    setIsButtonClicked(true);
    setShowEditModal(true);
  };

  const handleResubmission = (editedPassenger : Passenger) => {
    // Find the index of the edited passenger in the passengers array
    const editedPassengerIndex = passengers.findIndex(
      (passenger) => passenger.id === editedPassenger.id
    );

    if (editedPassengerIndex !== -1) {
      // Update the seat data for the edited passenger only
      const updatedPassengers = [...passengers]; // Create a copy of the passengers array
      updatedPassengers[editedPassengerIndex] = {
        ...editedPassenger, // Copy the existing passenger data
        seat: {
          ...updatedPassengers[editedPassengerIndex].seat, // Copy the existing seat data
          seat_number: editedPassenger.seat.seat_number,
          flight_class: editedPassenger.seat.flight_class,
          location: editedPassenger.seat.location,
          is_available: editedPassenger.seat.is_available,
          price: editedPassenger.seat.price,
        },
      };

      setPassengers(updatedPassengers);

    }
    

    // Close the modal
    setShowEditModal(false);
  };

  const handleSubmitPassengers = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    
    try {

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) 
        {
          console.error('CSRF token not found.');
          setIsLoading(false);

          navigate('/');
          return;
        }
      const response = await fetch(`${apiBaseUrl}/passengers/change/${formData.bookingReference}/${formData.ticketNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,

        },
        body: JSON.stringify({ passengers: passengers }),
      });

      
      const data = await response.json();

        if (response.ok) 
        {
          if (data.status) 
          {
            setResponseStatus(1); // Success
            setResponseMessage(`Success: ${data.success}`);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
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
          setResponseMessage(`Error: ${response.statusText}`);
        }

        setIsLoading(false);

    } catch (error) {
      throw new Error("An error occurred during submission");
    }
  }

  return (
    <div>
      <MenuBar1 isAuthenticated={false}/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center container-md" style={{ minHeight: '100vh' }}>        
      <Container fluid>
      <h2 className="text-primary text-center">Edit Passenger Details|</h2>
        <hr/>
        <Col md={6} className="mx-auto">

        {isLoading ? (
          <LoadingComponent />
        ) :
        (
          <>
            <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Booking Reference:</Form.Label>
                <Form.Control
                  type="text"
                  id="bookingReference"
                  name="bookingReference"
                  maxLength={12}
                  value={formData.bookingReference}
                  onChange={handleChange}
                  required
                />
                {refError && (
                  <Form.Text className="text-danger">{refError}</Form.Text>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Ticket Number:</Form.Label>
                <Form.Control
                  type="text"
                  id="ticketNumber"
                  name="ticketNumber"
                  maxLength={12}
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <hr/>
              <div className="text-center">
                <Button type="submit" variant="primary">
                  Retrieve Passengers
                </Button>
              </div>

              <div className="text-center mt-5">
                <Button type="button" variant="primary" onClick={ handleSubmitPassengers}>
                  Save Changes
                </Button>
              </div>

            </Form>
          </>
        )            
        }
        
        </Col>

        <br/>
              

        {/* display passenger data */}
        <div style={{overflow: "auto"}}>
        {passengers.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pass. Id</th>
                <th>Passport</th>
                <th>ID No.</th>
                <th>Name</th>
                <th>Birth Date</th>
                <th>Seat</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={index}>
                  <td>{passenger.passenger_id }</td>
                  <td>{passenger.passport_number}</td>
                  <td>{passenger.identification_number}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.date_of_birth}</td>
                  <td>
                    <Button onClick={() => handleSeat(passenger.seat)} variant="primary" type="button">
                      Seat
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => handleEdit(passenger)} variant="primary" type="button">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </div>
      </Container>

      {/* EditPassenger Modal */}
      
        <EditPassenger
          showEditModal={showEditModal} // Pass the correct prop
          handleResubmission={handleResubmission}
          passengerDataObject={passengerData}
          flightId={flightId} // Pass the flightId as a prop
          handleClose={handleCloseEditModal}
        />

      {/* Seat Modal */}
      <Modal show={showSeatModal} onHide={handleCloseSeatModal}>
        {passengerSeat ? (
           <PassengerSeat
               showSeatModal={showSeatModal}
               handleCloseSeatModal={handleCloseSeatModal}
               seatObject={passengerSeat}
             />
           ) : (
             // You can add some loading or placeholder content here
             // if passengerSeat is not available yet
             <div>Loading...</div>
           )}
      </Modal>
    </Container>
    </div>
  );
}
