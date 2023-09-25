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
import BookFlight from '../booking/bookflight';
import LoadingComponent from '../../../../Common/LoadingComponent';

interface FlightClass{
  id: number;
  name: string;
}

interface Location{
  id: number;
  name: string;
}

interface Seat{
  seat_id: number;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}

interface Passenger{
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat: Readonly<Seat> | {
    seat_number: '',
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: string,
    seat_id: number
  };
  index: number | null;
}

const intitPassenger: Passenger = {
  name: '',
  passport_number: '',
  identification_number: '',
  date_of_birth: '',
  seat: {
    seat_number: '',
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: "",
    seat_id: 0
  },
  index: null,
}

export default function AddPassenger1() {

  const location = useLocation();
  const navigate = useNavigate();

  //seat context props
  const { updateSeat } = useSeatContext() as SeatContextType;

  // Passenger Form State
  const [formData, setFormData] = useState<Passenger>(intitPassenger);

  //to store the form data and selected flight from the BookFlight component
  const formDataFromBookFlight = location.state?.formData;
  const selectedFlight = location.state?.selectedFlight;

  const [nameError, setNameError] = useState('');
  const [displaySeatTable, setDisplaySeatTable] = useState(false); // State to show/hide seat selection table

  const [index, setIndex] = useState(null);

  const { flightData, updateFlightData } = useBookingContext();

  // Passengers Context
  const {passengers, addPassenger, updatePassenger } = useBookingContext();
  const [passengerIndex, setPassengerIndex] = useState<number | null>(null);

  // Seat Selection State
  const [availableSeats, setAvailableSeats] = useState<Seat[] | []>([]);
  const [error, setError] = useState("");
  const [selectedSeatId, setSelectedSeatId] = useState<number>(0);

  const [pageHead, setPageHead] = useState("Add Passenger|");


  useEffect(() => {

    // Check if there is state data i.e. passenger data from the bookflight component
    if (location.state?.passenger) {
      // Update form fields with the data
      setPageHead("Edit Passenger|");
      const { name, passport_number, identification_number, date_of_birth } = location.state.passenger;
      const index = location.state?.index;

      const bookingDataFlight = location.state.flightData;

      // Create a new formData object
    const updatedFormData: Passenger = {
      ...formData,
      name,
      passport_number,
      identification_number,
      date_of_birth,
      ...(index !== undefined ? { index: index } : {}), // Only include index if it's defined
    };

      
      setFormData(updatedFormData);

      if (index !== undefined) {
        setIndex(index);
      }   
    }
  }, [location.state?.passenger]);  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/seats/flight/${flightData.flightId}`);
        if (!response.ok) 
        {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        //alert(JSON.stringify(data));
        setAvailableSeats(data.seats);
      } catch (error: any) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchData();
  }, []);


  //seat selection from the table
  const handleSeatSelection = (index: number) => {
    const selectedSeat = availableSeats[index];
    setSelectedSeatId(selectedSeat.seat_id);

    const selectedSeatObject: Seat = {
      seat_id: selectedSeat.seat_id,
      seat_number: selectedSeat.seat_number,
      flight_class: selectedSeat.flight_class,
      location: selectedSeat.location,
      is_available: selectedSeat.is_available,
      price: selectedSeat.price,
    };

    setFormData((prevData) => ({
      ...prevData,
      seat: selectedSeatObject,
    }))

    // Update the passenger's seat using the selectedPassengerIndex
    const updatedPassengers = [...passengers];    

    // Update the passenger in the context
    if(passengerIndex !== null){
      updatedPassengers[passengerIndex].seat = selectedSeatObject;
      updatePassenger(passengerIndex, updatedPassengers[passengerIndex]);
    }      

    updateSeat(index, selectedSeat);

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
    // Add your seat selection logic here
    setDisplaySeatTable(true); // Show the seat selection table

    //scroll to the table
    const tableSection = document.getElementById("seatTable");
    if(tableSection){
      tableSection.scrollIntoView({behavior: "smooth"});
    }
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
      addPassenger(passengerToUpdate);
    }
  
    navigate('/bookflight', {state: {formData: formDataFromBookFlight, selectedFlight}});

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
      <Container className="d-flex justify-content-center align-items-center mt-7 mb-0" style={{ height: '100vh' }}>
        <Container fluid>
          <Row>
            <h2 className="text-primary text-center">
              <b>{pageHead}</b>
            </h2>
            <hr />
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
          </Row>
        </Container>      
      </Container>

      {/* Display seat selection table when Select Seat button is clicked */}
      {displaySeatTable && (
        <Container className="mt-0">
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
                {availableSeats.map((availableSeat: Seat, index: number) => (
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

      {/* Show the success alert when a seat is selected */}
      {selectedSeatId && (
        <Alert variant="success" className="text-center">
          Seat {selectedSeatId} has been selected successfully!
        </Alert>
      )}
    </div>
  );
}