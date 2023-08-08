import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert, Spinner, Table, Col } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1';

interface Passenger {
  name: string;
  passport: string;
  idNumber: string;
  birthDate: Date | null;
}

interface Seat {
  number: string;
  location: string;
  availability: string;
  price: number;
}

export default function AddPassenger() {
  const [formData, setFormData] = useState<{
    bookingReference: string;
    passport: string;
    idNumber: string;
    name: string;
    birthDate: Date | null;
  }>({
    bookingReference: '',
    passport: '',
    idNumber: '',
    name: '',
    birthDate: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [refError, setRefError] = useState<string>('');
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [nameError, setNameError] = useState<string>('');
  const [displaySeatTable, setDisplaySeatTable] = useState<boolean>(false);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('');
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick = () => {
    setDisplaySeatTable(!displaySeatTable);
    tableContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleSeatSelect = (index: number) => {
    setSelectedSeatNumber(seats[index].number);
    setSelectedSeat(seats[index]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    if (name === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
      setNameError('Name must contain only alphabetic characters.');
    } else {
      setNameError('');
    }
  
    if (name === 'bookingReference') {
      let newValue = value.replace(/\D/g, '');
  
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
    } 
    else if (name === 'birthDate') 
    {
      const dateObject = value ? new Date(value) : null;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: dateObject,
      }));
    }
    else 
    {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  

  const handleSubmitPassenger = async (event: FormEvent) => {
    event.preventDefault();

    const newPassenger: Passenger = {
      name: formData.name,
      passport: formData.passport,
      idNumber: formData.idNumber,
      birthDate: formData.birthDate || null, // Use null if formData.birthDate is null
    };
    

    try {
      const response = await fetch('/src/components/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassenger),
      });

      if (response.ok) {
        setPassengers((prevPassengers) => [...prevPassengers, newPassenger]);
      }
    } catch (error) {
      throw new Error("An error occurred during submission");
    }
  }

  const handleRetrieveBooking = async (event: FormEvent) => {
    event.preventDefault();
    setRefError("");
    setBookingData(null);

    const { bookingReference } = formData;

    if (!bookingReference) {
      setRefError("Booking Reference is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/src/components/testdata/bookings");
      const data = await response.json();

      if (response.ok && data && data.bookings && data.bookings.length > 0) {
        const booking = data.bookings[0];
        const { planeId, passengers: passengerData } = booking;

        setBookingData(booking);
        setPassengers(passengerData);

        const seatResponse = await fetch(`/src/components/${planeId}`);
        const seatData = await seatResponse.json();

        if (seatResponse.ok && seatData && seatData.seats) {
          setSeats(seatData.seats);
        } else {
          throw new Error("Seats not Found");
        }
      } else {
        setRefError("Booking not found, Check the booking reference and try again");
      }
    } catch (error) {
      setRefError("An error occurred while fetching the booking. Please try again later");
    } finally {
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
              maxLength={8}
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
                    maxLength={8}
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
                    maxLength={8}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Birth Date:</Form.Label>
                  <Form.Control
                    type="date"
                    id="birthdate"
                    name="birthDate"
                    value={formData.birthDate ? (formData.birthDate as Date).toISOString().split('T')[0] : ''}
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
