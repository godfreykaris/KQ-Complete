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
  seat_number: '';
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: string;
}


export default function AddPassenger() {
  const [formData, setFormData] = useState<{
    bookingReference: string;
    ticketNumber: string;
    seatNumber: string;
    
  }>({
    bookingReference: '',
    ticketNumber: '',
    seatNumber: ''
  });
  

  const [isLoading, setIsLoading] = useState(false);

  const [bookingData, setBookingData] = useState<any>(null);
  const [refError, setRefError] = useState<string>('');


  
  const [nameError, setNameError] = useState<string>('');

  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);


  
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
      alert('Retrieve your booking to be able to delete a passenger');

      return;
    }
    

    try {

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) 
        {
          console.error('CSRF token not found.');
          setIsLoading(false);

          navigate('/');
          return;
        }
      const response = await fetch(`${apiBaseUrl}/passengers/delete/${formData.bookingReference}/${formData.ticketNumber}/${formData.seatNumber}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,

        },
      });

      
      const data = await response.json();

        if (response.ok) 
        {
          if (data.status) 
          {
            setResponseStatus(1); // Success
            setResponseMessage(`Success: ${data.success}.`);
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
            setResponseMessage(`Success: ${data.success} You can now delete the passenger.`);
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
      <h2 className="text-primary text-center"><b>Delete Passenger|</b></h2>
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

          <Col md={6} className='mx-auto'>
              <Form onSubmit={handleSubmitPassenger}>

                <Form.Group>
                  <Form.Label>Seat Number:</Form.Label>
                  <Form.Control
                    type="text"
                    id="seatNumber"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleChange}
                    maxLength={8}
                    required
                  />
                </Form.Group>

                

                <hr />
                
                <div className="text-center">
                  <Button type="submit" variant="primary">
                    Delete Passenger
                  </Button>
                </div>

                <br/>

              </Form>
            </Col>

      </Container>
    </Container>

    
    
  </div>
  );
}