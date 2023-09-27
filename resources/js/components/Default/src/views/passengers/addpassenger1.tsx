import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePassengerContext, PassengerContextType } from '../../context/passengers/passengercontext';
import { useSeatContext, SeatContextType } from '../../context/seats/sendseatdata';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1';
import MenuBar2 from '../../components/menubars/menubar2';


import apiBaseUrl from '../../../../../config';
import { useBookingContext } from '../../context/BookingContext';
import LoadingComponent from '../../../../Common/LoadingComponent';
import { BookingContextType } from '../../context/booking/bookflightcontext';
import { useEditBookingContext } from '../../context/booking/editbookingcontext';

interface FlightClass{
  id: number;
  name: string;
}

interface Location{
  id: number;
  name: string;
}

interface seat{
  seat_id: number;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}

interface seat1{
  id: number;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}

interface Passenger{
  passenger_id: string;
  name: string;
  passport_number: number;
  identification_number: number;
  date_of_birth: string;
  seat: Readonly<seat> | {
    seat_number: '',
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    seat_id: 0
  };
  seat_id: number,
  index: number | null;
}

const initPassenger: Passenger = {
  passenger_id: '',
  name: '',
  passport_number: 0,
  identification_number: 0,
  date_of_birth: '',
  seat: {
    seat_number: '',
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    seat_id: 0
  },
  seat_id: 0,
  index: null,
}

export default function AddPassenger1() {

  const location = useLocation();
  const navigate = useNavigate();

  //seat context props
  const { updateSeat } = useSeatContext() as SeatContextType;

  // Passenger Form State
  const [formData, setFormData] = useState<Passenger>(initPassenger);

  //to store the form data and selected flight from the BookFlight component
  const formDataFromBookFlight = location.state?.formData;
  const selectedFlight = location.state?.selectedFlight;

  const [nameError, setNameError] = useState('');
  const [displaySeatTable, setDisplaySeatTable] = useState(false); // State to show/hide seat selection table

  const [index, setIndex] = useState(null);

  const { flightData, updateFlightData } = useBookingContext();

  // Passengers Context
  const { flight_id, passengers, addPassenger, updatePassenger } = usePassengerContext() as PassengerContextType;
  const [passengerIndex, setPassengerIndex] = useState<number | null>(null);

  const {bookingReference, setBookingReference, ticketNumber, setTicketNumber,isBookingValid, setIsBookingValid} = useEditBookingContext();


  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // Seat Selection State
  const [availableSeats, setAvailableSeats] = useState<seat1[] | []>([]);
  const [error, setError] = useState("");
  const [selectedSeatId, setSelectedSeatId] = useState<number>(0);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('');
  const [backTo, setBackTo] = useState<string>('');


  const [pageHead, setPageHead] = useState("Add Passenger|");


  useEffect(() => {

    // Check if there is state data i.e. passenger data from the bookflight component
    if (location.state?.passenger) {
      // Update form fields with the data
      setPageHead("Edit Passenger|");
      const { name, passport_number, identification_number, date_of_birth, seat_id, seat } = location.state.passenger;
      const index = location.state?.index;

      // Create a new formData object
    const updatedFormData: Passenger = {
      ...formData,
      name,
      passport_number,
      identification_number,
      date_of_birth,
      seat_id,
      seat,
      ...(index !== undefined ? { index: index } : {}), // Only include index if it's defined
    };

      setFormData(updatedFormData);

      setSelectedSeatId(location.state.passenger.seat.seat_id);
      setSelectedSeatNumber(location.state.passenger.seat.seat_number);


      if (index !== undefined) {
        setIndex(index);
      }   
    }

    setBackTo(location.state.backTo);

  }, [location.state?.passenger]);  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/seats/flight/${flight_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
       // Filter out seats that are already assigned to passengers
      const filteredSeats = data.seats.filter((seat: seat1) => {
        return !passengers.some((passenger) => passenger.seat?.seat_id === seat.id);
      });

      setAvailableSeats(filteredSeats);

      } catch (error: any) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchData();

    

  }, []);


  const showSeatsTable = () => {
    setDisplaySeatTable(true);
    tableContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  //seat selection from the table
  const handleSeatSelection = (index: number) => {
    const selectedSeat = availableSeats[index];
    setSelectedSeatId(selectedSeat.id);
    setSelectedSeatNumber(selectedSeat.seat_number);


    const selectedSeatObject: seat = {
      seat_id: selectedSeat?.id,
      seat_number: selectedSeat.seat_number,
      flight_class: selectedSeat.flight_class,
      location: selectedSeat.location,
      is_available: selectedSeat.is_available,
      price: selectedSeat.price,
    };

    setFormData((prevData) => ({
      ...prevData,
      seat: selectedSeatObject,
      seat_id: selectedSeatObject.seat_id,
    }))

    // Update the passenger's seat using the selectedPassengerIndex
    const updatedPassengers = [...passengers];    

    // Update the passenger in the context
    if(passengerIndex !== null){
      updatedPassengers[passengerIndex].seat = selectedSeatObject;
      updatePassenger(passengerIndex, updatedPassengers[passengerIndex]);
    }      

    updateSeat(index, selectedSeatObject);

    setDisplaySeatTable(false); // Hide the seat selection table after seat selection
  };

  //input validation
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;


    // Validate for the 'Name' field to contain only alphabetic characters
    if (name === 'name' && !/^[A-Za-z\s]+$/.test(value)) 
    {
      setNameError('Name must contain only alphabetic characters.');
    } 
    else 
    {
      setNameError(''); // Clear the error message if the input is valid
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //handle Select Seat
  const handleButtonClick = () => {
    
    showSeatsTable();
    //set selected passenger index
    setPassengerIndex(index);


  };

  //edit or add passenger form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form data before submitting
    if (nameError !== '') {
      return; // Don't submit if there are validation errors
    }

    if (passengers.length >= 10) {
      alert('Maximum number of passengers (10) reached. Cannot add more passengers.');
      return;
    }

    const passengerToUpdate = {...formData};

    if (index !== null) {
      // Update the existing passenger in the array
      updatePassenger(index, passengerToUpdate);
    } else {
      passengerToUpdate.index = passengers.length + 1;
      addPassenger(passengerToUpdate.index, passengerToUpdate);
    }
  
    navigate(`/${backTo}`, {state: {formData: formDataFromBookFlight, selectedFlight, isBookingValid}});

  };


  const renderTooltip = (message: string) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

  return (
    <div>
      <MenuBar1 isAuthenticated={false} />
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center mt-7 mb-0" >
        <Container fluid>
          <Row>
            <h2 className="text-primary text-center">
              <b>{pageHead}</b>
            </h2>
            <hr />

            { !displaySeatTable && (
            <Col md={6} className="mx-auto">
              <Form onSubmit={handleFormSubmit}>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    isInvalid={nameError !== ''}
                  />
                  {nameError && <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Passport Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="passport_number"
                    value={formData.passport_number}
                    onChange={handleChange}
                    maxLength={8}
                    minLength={6}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>ID Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="identification_number"
                    value={formData.identification_number}
                    onChange={handleChange}
                    maxLength={8}
                    minLength={6}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Birth Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <hr/>
                <div className='d-flex justify-content-center'>
                  <Button type="button" variant="primary" onClick={handleButtonClick}>
                    Select Seat
                  </Button>
                </div>

                <hr />

                <div className='d-flex justify-content-center'>
                  {formData.seat.seat_number === '' ? (
                    <OverlayTrigger
                      placement='top'
                      overlay={renderTooltip("Select a Seat before adding a passenger")}
                    >
                      <span>
                        <Button type="submit" variant="primary" disabled={formData.seat.seat_number === ''}>
                          Submit
                        </Button>
                      </span>
                    </OverlayTrigger>
                    ) : (
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    )}
                </div>
             </Form>
            </Col> 
            )}           
          </Row>
          {/* Show the success alert when a seat is selected */}
          {selectedSeatId != 0 && (
              <Row>
                  <Col>
                    <Alert variant="success" className="text-center mt-2">
                      Seat {selectedSeatNumber} has been selected successfully!
                    </Alert>
                  </Col>
              </Row>
          )}
         
                
            
        </Container>      
      </Container>

      {/* Display seat selection table when Select Seat button is clicked */}
      {displaySeatTable && (
        <Container ref={tableContainerRef} className="mt-2">
          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : availableSeats.length > 0 ? (
            <Table striped bordered hover id='seatTable'>
              <thead>
                <tr>
                  <th>Seat Number</th>
                  <th>Seat Location</th>
                  <th>Availability</th>
                  <th>Seat Price</th>
                  <th>Seat Class</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableSeats.map((availableSeat: seat1, index: number) => (
                  <tr key={index}>
                    <td>{availableSeat.seat_number}</td>
                    <td>{availableSeat.location.name}</td>
                    <td>{availableSeat.is_available}</td>
                    <td>{availableSeat.price}</td>
                    <td>{availableSeat.flight_class.name}</td>
                    <td>
                      <Button
                        onClick={() => handleSeatSelection(index)}
                        variant="primary"
                        type="button"
                        disabled={availableSeat.is_available == false}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <LoadingComponent/>
          )}
        </Container>
      )}

    </div>
  );
}