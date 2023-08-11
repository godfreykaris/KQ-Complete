import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePassengerContext } from '../../context/passengers/passengercontext';
import { useSeatContext } from '../../context/seats/sendseatdata';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1';
import MenuBar2 from '../../components/menubars/menubar2';

export default function AddPassenger1() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seat, updateSeat } = useSeatContext();

  // Passenger Form State
  const [formData, setFormData] = useState({
    name: '',
    passport: '',
    idNumber: '',
    birthDate: '',
  });

  const formDataRef = useRef({
    name: '',
    passport: '',
    idNumber: '',
    birthDate: '',
  });

  const [nameError, setNameError] = useState('');
  const [displaySeatTable, setDisplaySeatTable] = useState(false); // State to show/hide seat selection table

  useEffect(() => {
    // Check if there is state data i.e. passenger data from the bookflight component
    if (location.state?.passenger) {
      // Update form fields with the data
      const { name, passport, idNumber, birthDate } = location.state.passenger;
      const index = location.state?.index;
      setFormData({
        name,
        passport,
        idNumber,
        birthDate,
        index,
      });
      formDataRef.current = {
        name,
        passport,
        idNumber,
        birthDate,
        index,
      };
    }
  }, [location.state?.passenger]);

  // Passengers Context
  const { passengers, addPassenger, updatePassenger } = usePassengerContext();

  // Seat Selection State
  const [availableSeats, setAvailableSeats] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/components/testdata/seatdata.json');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setAvailableSeats(data.seats);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchData();
  }, []);


  //seat selection from the table
  const handleSubmit = (index) => {
    const selectedSeat = availableSeats[index];
    setSelectedSeatNumber(selectedSeat.number);
    updateSeat(selectedSeat);
    setDisplaySeatTable(false); // Hide the seat selection table after seat selection
  };

  const handleChange = (event) => {
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
  };

  //edit passenger form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Validate form data before submitting
    if (nameError !== '') {
      return; // Don't submit if there are validation errors
    }

    if (passengers.length >= 10) {
      alert('Maximum number of passengers (10) reached. Cannot add more passengers.');
      return;
    }

    // Handle submit for both the edit and the addition
    const passengerIndex = passengers.findIndex((p) => p.index === formData.index);

    if (passengerIndex !== -1) {
      // Update the existing passenger in the array
      updatePassenger(passengerIndex, formData);
    } else {
      addPassenger(formData);
    }
  
    // Navigate to bookflight with the formdata
    navigate(-1, { state: { seat } });

    // Reset form data
    setFormData({
      name: '',
      passport: '',
      idNumber: '',
      birthDate: '',
    });
    formDataRef.current = {
      name: '',
      passport: '',
      idNumber: '',
      birthDate: '',
    };
  };


  const renderTooltip = (message) => (
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
                    maxLength="8"
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
                    maxLength="8"
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
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Seat Number</th>
                  <th>Seat Location</th>
                  <th>Availability</th>
                  <th>Seat Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableSeats.map((availableSeat, index) => (
                  <tr key={index}>
                    <td>{availableSeat.number}</td>
                    <td>{availableSeat.location}</td>
                    <td>{availableSeat.availability}</td>
                    <td>{availableSeat.price}</td>
                    <td>
                      <Button
                        onClick={() => handleSubmit(index)}
                        variant="primary"
                        type="button"
                        disabled={availableSeat.availability === 'BOOKED'}
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
      {selectedSeatNumber && (
        <Alert variant="success" className="mt-3">
          Seat {selectedSeatNumber} has been selected successfully!
        </Alert>
      )}
    </div>
  );
}
