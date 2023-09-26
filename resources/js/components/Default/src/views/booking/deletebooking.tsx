import React, { useEffect, useState } from "react";
import { Container, Form, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import LoadingComponent from "../../../../Common/LoadingComponent";

import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";

export default function PrintTicket() {

  const [isLoading, setIsLoading] = useState(false);

  const [refError, setRefError] = useState("");

  const [formData, setFormData] = useState({
    bookingReference: "",
    ticketNumber: "",
  });


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

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const cancelDeletion = window.confirm("Are you sure you want to delete this booking with booking reference " + formData.bookingReference + " and ticket number " + formData.ticketNumber);

    if(!cancelDeletion)
    {
      return;
    }

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

      const response = await fetch(`/bookings/delete/${formData.bookingReference}/${formData.ticketNumber}`, {
        method: "DELETE",
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
      <MenuBar1 isAuthenticated={false} />
      <br />
      <br />
      <br />
      <MenuBar2 />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Container fluid>
          <h2 className="text-primary text-center">Delete Booking|</h2>
          <hr />
          {isLoading ? (
                /**Show loading */
                <LoadingComponent />
              ) : (
            <>
            <Col md={6} className="mx-auto">
          
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
              <hr />

              <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

              <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary">
                  Delete Booking
                </Button>
              </div>
              
            </Form>
            
          </Col>
          
          
        </>
      )}
        </Container>
      </Container>
    </div>
  );
}
