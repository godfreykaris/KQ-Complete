import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePassengerContext, PassengerContextType } from '../../context/passengers/passengercontext';
import { useSeatContext, SeatContextType } from '../../context/seats/sendseatdata';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1';
import MenuBar2 from '../../components/menubars/menubar2';


import apiBaseUrl from '../../../../../config';

interface seat{
  _id: number;
  seat_number: number;
  flight_class: string;
  location: string;
  is_available: boolean;
  price: string;
}

interface passenger{
  name: string;
  passport: number;
  idNumber: number;
  birthDate: string;
  seat: seat | {};
}

const intitPassenger: passenger = {
  name: '',
  passport: 0,
  idNumber: 0,
  birthDate: '',
  seat: {},
}

export default function AddPassenger1() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seat, updateSeat } = useSeatContext() as SeatContextType;

  // Passenger Form State
  const [formData, setFormData] = useState<passenger>(intitPassenger);


  const [nameError, setNameError] = useState('');
  const [displaySeatTable, setDisplaySeatTable] = useState(false); // State to show/hide seat selection table

  const [index, setIndex] = useState(null);
  const [flightId, setFlightId] = useState<number>();

  useEffect(() => {
    // Check if there is state data i.e. passenger data from the bookflight component
    if (location.state?.passenger) {
      // Update form fields with the data
      const { name, passport, idNumber, birthDate } = location.state.passenger;
      const index = location.state?.index;
      const flight = location.state?.flightId;

      // Create a new formData object
    const updatedFormData: passenger = {
      ...formData,
      name,
      passport,
      idNumber,
      birthDate,
      ...(index !== undefined ? { index: index } : {}), // Only include index if it's defined
    };

      setFormData(updatedFormData);

      if (index !== undefined) {
        setIndex(index);
      }

      console.log(index);
      setFlightId(flight);     
    }
  }, [location.state?.passenger]);

  // Passengers Context
  const { passengers, addPassenger, updatePassenger } = usePassengerContext() as PassengerContextType;

  // Seat Selection State
  const [availableSeats, setAvailableSeats] = useState<seat[] | []>([]);
  const [error, setError] = useState("");
  const [selectedSeatId, setSelectedSeatId] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/seats/flight/${1}`);
        if (!response.ok) {
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
    setSelectedSeatId(selectedSeat.seat_number);
    updateSeat(selectedSeat);
    setDisplaySeatTable(false); // Hide the seat selection table after seat selection
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;

    // Validate for the 'Name' field to contain only alphabetic characters
    if (name === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
      setNameError('Name must contain only alphabetic characters.');
    } else {
      setNameError(''); // Clear the error message if the input is valid
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    // Add your seat selection logic here
    setDisplaySeatTable(true); // Show the seat selection table

    console.log(flightId);
    //scroll to the table
    const tableSection = document.getElementById("seatTable");
    if(tableSection){
      tableSection.scrollIntoView({behavior: "smooth"});
    }
  };

  //edit passenger form submission
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

    //Handle submit for both the edit and the addition
    //const passengerIndex = passengers.findIndex((p) => index === formData.index);

    if (index !== null) {
      // Update the existing passenger in the array
      updatePassenger(index, formData);
    } else {
      addPassenger(formData);
    }
  
    // Navigate to bookflight with the formdata
    navigate("-1", { state: { seat } });

    
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
              <b>Add Passenger|</b>
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
                    name="passport"
                    value={formData.passport}
                    onChange={handleChange}
                    maxLength={8}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>ID Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    maxLength={8}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Birth Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <hr/>
                <Button type="button" variant="primary" onClick={handleButtonClick}>
                  Select Seat
                </Button>

                <hr />

                <OverlayTrigger
                  placement='top'
                  overlay={renderTooltip("Select a Seat before adding a passenger")}
                >
                  <span>
                    <Button type="submit" variant="primary" disabled={Object.keys(seat).length === 0}>
                      Add
                    </Button>
                  </span>
                
                </OverlayTrigger>

                
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
                {availableSeats.map((availableSeat: seat, index: number) => (
                  <tr key={index}>
                    <td>{availableSeat.seat_number}</td>
                    <td>{availableSeat.location}</td>
                    <td>{availableSeat.is_available}</td>
                    <td>{availableSeat.price}</td>
                    <td>{availableSeat.flight_class}</td>
                    <td>
                      <Button
                        onClick={() => handleSeatSelection(index)}
                        variant="primary"
                        type="button"
                        disabled={availableSeat.is_available === false}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="d-flex align-items-center">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="text-primary ml-2">Loading seats...</span>
            </div>
          )}
        </Container>
      )}

      {/* Show the success alert when a seat is selected */}
      {selectedSeatId && (
        <Alert variant="success" className="mt-3">
          Seat {selectedSeatId} has been selected successfully!
        </Alert>
      )}
    </div>
  );
}