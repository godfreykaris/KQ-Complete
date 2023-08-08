import React, { useState, useRef } from 'react';
import { Container, Form, Button, Alert, Spinner, Table, Col } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1.jsx';

export default function AddPassenger() {

  const [formData, setFormData] = useState({
    bookingReference: '',
  });

  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [refError, setRefError] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [nameError, setNameError] = useState("");
  const [displaySeatTable, setDisplaySeatTable] = useState(false);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState('');
  // Create a ref for the container that wraps the table
  const tableContainerRef = useRef(null);

  //keeping track of the visibility of the seat table
  const handleButtonClick = () => {
    //toggle the seat table visibility
    setDisplaySeatTable(!displaySeatTable);
    tableContainerRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  //function to handle seat selection
  const handleSeatSelect = (index) => {
    setSelectedSeatNumber(seats[index].number);
    setSelectedSeat(seats[index]);
  };

  //handling change in form data
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Validate for the 'Name' field to contain only alphabetic characters
    if (name === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
      setNameError('Name must contain only alphabetic characters.');
    } else {
      setNameError(''); // Clear the error message if the input is valid
    }

    if (name === 'bookingReference') {
      // Remove any non-numeric characters from the input
      let newValue = value.replace(/\D/g, '');

      // Add the "KQ-" prefix and set the error message
      if (newValue.length === 6) {
        newValue = `KQ-${newValue}`;
        setRefError('');
      } else {
        setRefError('The input must be numbers');
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else if (name === 'birthDate') {
      // Parse the date string into a date object
      const dateObject = value ? new Date(value) : null; // Check for truthy value before converting to a Date object
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: dateObject,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  //handleSubmitPassenger  function to send new passenger data to the database
  const handleSubmitPassenger  = async (event) => {
    event.preventDefault();

    //extract passenger data from the form data
    const newPassenger = {
      name: formData.name,
      passport: formData.passport,
      idNumber: formData.idNumber,
      birthDate: formData.birthDate,
    };

    try{
      const response = await fetch('/src/components/bookings',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassenger),
      });

      if(response.ok){
        // If the API call is successful, add the new passenger to the passengers state
        setPassengers((prevPassengers) => [...prevPassengers, newPassenger]);
        //show success message and reset form here
      }
    }catch(error){
      throw new Error("An error occured during submission");
    }
  }

  //handleRetrieveBooking function

  const handleRetrieveBooking = async (event) => {
     event.preventDefault();
    
     //clear previous error and booking data
     setRefError("");
     setBookingData(null);

     const {bookingReference} = formData;

     //validate to make sure that the reference number was provided
     if(!bookingReference){
      setRefError("Booking Reference is required");
      return;
     }

     //show loading state while fetching data
     setLoading(true);

     try{
      //make api call to backed to fetch the booking data
      const response = await fetch("/src/components/testdata/bookings");
      const data = await response.json();

      //check if the response is successful and contains the booking data
      if(response.ok && data && data.bookings && data.bookings.length > 0){
        const booking = data.bookings[0];//only one booking

        //extract planeId and passengers array from the booking
        const {planeId, passengers: passengerData} = booking;

        setBookingData(booking);

        //update the passengers state with passengersData
        setPassengers(passengerData);

        //make another api call to fetch seat data using the extracted planeId
        const seatResponse = await fetch(`/src/components/${planeId}`);
        const seatData = await seatResponse.json();

        //check if the seat data response is successful
        if(seatResponse.ok && seatData && seatData.seats){
          setSeats(seatData.seats);
        }else{
          throw new Error("Seats not Found");
        }

      }else{
        //booking data not found
        setRefError("Booking not found, Check the booking reference and try again");
      }
     }catch(error){
      //handle errors that occured during API call
      setRefError("An error occurred while fetching the booking. Please try again later");
     }finally {
      //hide the loading state after the API call
      setLoading(false);
     }
  }
  

  return (
    <div>
      <MenuBar1/>
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ height: '100vh' }}>
      <Container fluid>
      <h2 className="text-primary text-center"><b>Add Passenger|</b></h2>
        <hr />
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleRetrieveBooking}>
          <Form.Group>
            <Form.Label>Booking Reference:</Form.Label>
            <Form.Control
              type="text"
              id="bookingReference"
              name="bookingReference"
              maxLength="8"
              value={formData.bookingReference}
              onChange={handleChange}
              required
            />
            {refError && <Form.Text className="text-danger">{refError}</Form.Text>}
          </Form.Group>

          <br/>

          <button type="submit" className="btn btn-primary d-flex justify-content-center align-items-center" >Retrieve Booking</button>

          </Form>
        </Col>

          <hr/>

          {loading && (<div className="d-flex align-items-center">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ml-2">Please Wait...</span>
          </div>) }

          {passengers.length < 10 ? (
            <Col md={6} className='mx-auto'>
              <Form onSubmit={handleSubmitPassenger}>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {nameError && <Form.Text className="text-danger">{nameError}</Form.Text>}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Passport Number:</Form.Label>
                  <Form.Control
                    type="text"
                    id="passport"
                    name="passport"
                    value={formData.passport}
                    onChange={handleChange}
                    maxLength="8"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Id Number:</Form.Label>
                  <Form.Control
                    type="text"
                    id="idNumber"
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
                    id="birthdate"
                    name="birthDate"
                    value={formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <br/>

                <Button
                  onClick={() => {
                    handleButtonClick();
                  }}
                  type="button"
                  variant="primary"
                >
                  Select Seat
                </Button>
                
                <hr />
                
                <Button type="submit" variant="primary" disabled={selectedSeat === null}>
                  Add
                </Button>
              </Form>
            </Col>
          ) : (
            <p className='text-danger'>This Booking is Full</p>
          )}
      </Container>
    </Container>

    {/* Display seat selection table when Select Seat button is clicked */}
    {displaySeatTable && (
      <Container className="mt-0">
        {refError ? (
          <Alert variant="danger">{refError}</Alert>
        ) : seats.length > 0 ? (
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
              {seats.map((seat, index) => (
                <tr key={index}>
                  <td>{seat.number}</td>
                  <td>{seat.location}</td>
                  <td>{seat.availability}</td>
                  <td>{seat.price}</td>
                  <td>
                    <Button
                      onClick={() => handleSeatSelect(index)}
                      variant="primary"
                      type="button"
                      disabled={seat.availability === 'BOOKED'}
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
