import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Table, Col } from 'react-bootstrap';
import MenuBar1 from '../../components/menubars/menubar1';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../../Common/LoadingComponent';
import apiBaseUrl from '../../../../../config';
import MenuBar2 from '../../components/menubars/menubar2';

interface Passenger {
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat_id: number;
}

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
  seat_number: number;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}


export default function AddPassenger() {
  const [formData, setFormData] = useState<{
    bookingReference: string;
    ticketNumber: string;
    passport: string;
    idNumber: string;
    name: string;
    birthDate: Date | null;
  }>({
    bookingReference: '',
    ticketNumber: '',
    passport: '',
    idNumber: '',
    name: '',
    birthDate: null,
  });
  

  const [isLoading, setIsLoading] = useState(false);

  const [bookingData, setBookingData] = useState<any>(null);
  const [refError, setRefError] = useState<string>('');
  const [passengers, setPassengers] = useState<Passenger[]>([]);


  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat>();
  
  const [flightId, setFlightId] = useState<string>('0');

  const [nameError, setNameError] = useState<string>('');
  const [displaySeatTable, setDisplaySeatTable] = useState<boolean>(false);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('');
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);


  useEffect(() => {
       fetchSeats(flightId);
  }, [flightId]);

  const fetchSeats = async (flightId: string) => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/seats/flight/${flightId}`);
      const data = await response.json();
      setSeats(data.seats);
      setIsLoading(false);

    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsLoading(false);
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
  
  const showSeatsTable = () => {
    setDisplaySeatTable(true);
    tableContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  
  //seat selection from the table
  const handleSeatSelection = (index: number) => {
    const selectedSeat = seats[index];

    const selectedSeatObject: Seat = {
      id: selectedSeat.id,
      seat_number: selectedSeat.seat_number,
      flight_class: selectedSeat.flight_class,
      location: selectedSeat.location,
      is_available: selectedSeat.is_available,
      price: selectedSeat.price,
    };

    setSelectedSeat(selectedSeatObject);

    setSelectedSeatNumber(seats[index].seat_number.toString());
  
    setDisplaySeatTable(false); // Hide the seat selection table after seat selection
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers

    if (name === "name") 
    {
        if (!/^[A-Za-z\s]+$/.test(value)) {
            setNameError('Name must contain only alphabetic characters.');
        } 
        else 
        {
            
            setNameError('');
        }
    }

    let prefix = ""; // Initialize prefix based on context

    if (name === "bookingReference") 
    {
        prefix = "KQ-BR-"; // Booking reference prefix
    } 
    else if (name === "ticketNumber") 
    {
        prefix = "KQ-TK-"; // Ticket number prefix
    }
    else if (name === "birthDate") 
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
    
    if (prefix != "" && sanitizedValue.length <= 10) 
    {
        const newValue = `${prefix}${sanitizedValue.slice(4, 11)}`; // Use the first 7 characters
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
        setRefError(""); // Clear any previous errors
    } 
    else if (prefix != "" && sanitizedValue.length > 10)
    {
        setRefError("The input must be the appropriate prefix followed by 6 characters");
    }
};
  

  const handleSubmitPassenger = async (event: FormEvent) => {
    event.preventDefault();

    if(!formData.bookingReference || !formData.ticketNumber)
    {
      alert('Retrieve your booking to be able to add passenger');

      return;
    }

    const newPassenger: Passenger = {
      name: formData.name,
      passport_number: formData.passport,
      identification_number: formData.idNumber,
      date_of_birth: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : '',
      seat_id: selectedSeat ? selectedSeat.id : 0 ,
    };
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

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
      const response = await fetch(`${apiBaseUrl}/passengers/add/${formData.bookingReference}/${formData.ticketNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,

        },
        body: JSON.stringify({ passengers: [newPassenger] }),
      });

      
      const data = await response.json();

        if (response.ok) 
        {
          if (data.status) 
          {
            setResponseStatus(1); // Success
            setResponseMessage(`Success: ${data.success}.`);
            
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

  const handleRetrieveBooking = async (event: FormEvent) => {
    event.preventDefault();
    setRefError("");
    setBookingData(null);

    setIsLoading(true);

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

        const response = await fetch(`${apiBaseUrl}/bookings/get/${formData.bookingReference}/${formData.ticketNumber}`, {
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
            setResponseMessage(`Success: ${data.success} You can now add a passenger.`);

            setFlightId(data.booking.flight_id);

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
    

  return (
    <div>
      <MenuBar1 isAuthenticated={false}/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      
      <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: '20vh', marginBottom: '20px', height: '100vh', position: 'relative' }}>
      <Container fluid>
      <h2 className="text-primary text-center"><b>Add Passenger|</b></h2>
        <hr />
        <Col md={6} className="mx-auto">
        {isLoading ? (
                /**Show loading */
                <LoadingComponent />
              ) : (

        <Form onSubmit={handleRetrieveBooking}>
            <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

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

          <br/>

          <div className="text-center">
            <button type="submit" className="btn btn-primary" >
              Retrieve Booking</button>
          </div>


          </Form>
              )}
        </Col>

          <hr/>


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


                <div className="text-center">

                  <Button
                    onClick={() => {
                      showSeatsTable();
                    }}
                    type="button"
                    variant="primary"
                  >
                    Select Seat
                  </Button>
                
                </div>

                <hr />
                
                <div className="text-center">
                  <Button type="submit" variant="primary" disabled={selectedSeat === null}>
                    Add Passenger
                  </Button>
                </div>

                <br/>

              </Form>
            </Col>
          ) : (
            <p className='text-danger'>This Booking is Full</p>
          )}
      </Container>
    </Container>

    {/* Show the success alert when a seat is selected */}
    {selectedSeatNumber && (
      <Alert variant="success" className="text-center" style={{ marginTop: '90px', marginBottom: '10px'}}>
        Seat {selectedSeatNumber} has been selected successfully!
      </Alert>
    )}

    {/* Display seat selection table when Select Seat button is clicked */}
    {(displaySeatTable && isLoading) ?
    (
      /**Show loading */
      <LoadingComponent />
    ): (((seats.length == 0  && selectedSeatNumber == '') || (seats.length > 0  && selectedSeatNumber == '')) && !displaySeatTable) ? (
      <Alert variant="error" className="text-center" style={{ marginTop: '90px', marginBottom: '10px'}}>
        Select a seat for the passenger!
      </Alert>
    ): displaySeatTable && (
      <Container ref={tableContainerRef} className="d-flex justify-content-center align-items-center" style={{ marginTop: '10px', position: 'relative' }}>
        {refError ? (
          <Alert variant="danger">{refError}</Alert>
        ) : (
          <Table  striped bordered hover>
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Seat Location</th>
                <th>Availability</th>
                <th>Seat Price</th>
                <th>Flight Class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((availableSeat: Seat, index: number) => (
                  <tr key={index}>
                    <td>{availableSeat.seat_number}</td>
                    <td>{availableSeat.location.name}</td>
                    <td>{!availableSeat.is_available ? 'Booked' : 'Available'}</td>
                    <td>{availableSeat.price}</td>
                    <td>{availableSeat.flight_class.name}</td>
                    <td>
                    <Button
                      onClick={() => handleSeatSelection(index)}
                      variant="primary"
                      type="button"
                      disabled={!availableSeat.is_available}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>        
        )}
      </Container>
    )}
    
  </div>
  );
}