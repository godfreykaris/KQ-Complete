import React, { FormEvent, useEffect, useState } from "react";
import { Container, Form, Button, Table, Modal, Spinner } from "react-bootstrap";
import PassengerSeat from "../seats/viewseat.js";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import {Col} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiBaseUrl from "../../../../../config.js";
import LoadingComponent from "../../../../Common/LoadingComponent.js";
import { useEditBookingContext } from "../../context/booking/editbookingcontext.js";
import { PassengerContextType, usePassengerContext } from "../../context/passengers/passengercontext";


interface FlightClass{
  id: number;
  name: string;
}

interface Location{
  id: number;
  name: string;
}

interface Seat{
  seat_id: number | 0;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}

interface Passenger {
  passenger_id: string;
  name: string;
  passport_number: number;
  identification_number: number;
  date_of_birth: string;
  seat: Seat;
  seat_id: number;
  index: number | null;

}

export default function ChangePassenger() { 

  const {flight_id, setFlightId, passengers, setPassengers, removePassenger, updatePassenger, newFlightId} = usePassengerContext() as PassengerContextType;
  const {bookingReference, setBookingReference, ticketNumber, setTicketNumber,isBookingValid, setIsBookingValid} = useEditBookingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [refError, setRefError] = useState("");

  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseMessage1, setResponseMessage1] = useState("");
  const [responseStatus1, setResponseStatus1] = useState<number | null>(null);

  const navigate2 = useNavigate();


  //to edit passenger when the edit button is clicked
  const handleEditPassenger = (passenger: Passenger, index: number) => {  
    const backTo = "changepassenger";
    navigate2('/addpassenger1', {state: {passenger, index, backTo}});
  };

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
        if (name === "bookingReference") 
        {
          setBookingReference(newValue);
        } 
        else if (name === "ticketNumber")
        {
          setTicketNumber(newValue);
        }
        setRefError(""); // Clear any previous errors
    } 
    else 
    {
        setRefError("The input must be the appropriate prefix followed by 6 characters or less");
    }
};

const getResponseClass = (status: any) => {
  if (status === 1) {
    return "text-success"; // Green color for success
  } else if (status === 0) {
    return "text-danger"; // Red color for error
  } else {
    return ""; // No specific styles (default)
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

        const response = await fetch(`${apiBaseUrl}/passengers/get/${bookingReference}/${ticketNumber}`, {
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

            setFlightId(data.flightId);
            setIsBookingValid(true);
                      
            const passengersData = data.passengers;


            const modifiedPassengers: any[] = [];

            for (const passengerData of passengersData) {
              const modifiedPassenger = {
                id:passengerData.id,
                passenger_id: passengerData.passenger_id,
                name: passengerData.name,
                passport_number: passengerData.passport_number,
                identification_number: passengerData.identification_number,
                date_of_birth: passengerData.date_of_birth,
                seat: {
                  seat_number: passengerData.seat.seat_number,
                  flight_class: {
                    id: passengerData.seat.flight_class.id,
                    name: passengerData.seat.flight_class.name,
                  },
                  location: {
                    id: passengerData.seat.location.id,
                    name: passengerData.seat.location.name,
                  },
                  is_available: passengerData.seat.is_available,
                  price: passengerData.seat.price,
                  seat_id: passengerData.seat.id,
                },
                index: null,
              };

              modifiedPassengers.push(modifiedPassenger);
            }

            setPassengers(modifiedPassengers);

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


  const handleSeat = (passengerSeatData: Seat) => {
    setIsButtonClicked(true);
    setPassengerSeat(passengerSeatData);
    setShowSeatModal(true);
  };


  const handleCloseSeatModal = () => {
    setShowSeatModal(false);
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


      const response = await fetch(`${apiBaseUrl}/passengers/change/${bookingReference}/${ticketNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,

        },
        body: JSON.stringify({ passengers: passengers.map((passenger) => ({
          passenger_id: passenger.passenger_id || 'empty',
          name: passenger.name,
          passport_number: passenger.passport_number || null,
          identification_number: passenger.identification_number || null,
          date_of_birth: passenger.date_of_birth,
          seat_id: passenger.seat.seat_id,
        })) }),
      });

      
      const data = await response.json();

      if (response.ok) 
      {
        if (data.status) 
        {
          setResponseStatus1(1); // Success
          setResponseMessage1(`Success: ${data.success}`);

          if(data.redirect)
          {
              // Redirect to the Stripe payment page
              window.location.href = data.redirect;
          }
         
        } 
        else 
        {
          setResponseStatus1(0); // Error
          setResponseMessage1(`Error: ${data.error}`);
        }
      } 
      else 
      {
        setResponseStatus1(0); // Error
        setResponseMessage1(`Error: ${response.statusText}`);
      }

      setIsLoading(false);

    } 
    catch (error: any) 
    {
      setIsLoading(false);
      setResponseStatus1(0); // Error
      setResponseMessage1('Error updating passengers.');
      console.error('Error updating passengers', error);
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
        {!isBookingValid ? (
          <>
        <Col md={6} className="mx-auto">

        {isLoading ? (
          <LoadingComponent />
        ) :
        (
          <>
            <p className={`response-message ${getResponseClass(responseStatus)} text-center`}>{responseMessage}</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Booking Reference:</Form.Label>
                <Form.Control
                  type="text"
                  id="bookingReference"
                  name="bookingReference"
                  maxLength={12}
                  value={bookingReference}
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
                  value={ticketNumber}
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
            </Form>
          </>
        )            
        }
        
        </Col>

        <br/>
        </>
          ) : (   
        <>
        <p className={`response-message ${getResponseClass(responseStatus1)} text-center`}>
             {responseMessage1}
         </p>
         <div className='d-flex justify-content-center mb-2'>                
           <Button type="button" variant="primary" onClick={ handleSubmitPassengers}>
             {isLoading ? (
               <Spinner animation='border' size='sm'/>
             ) : (
               "Save Changes"
             )}                    
           </Button>

         </div>
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
                    <Button onClick={() => handleEditPassenger(passenger, index)} variant="primary" type="button">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </div>
        </>
        )}
      </Container>

      
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