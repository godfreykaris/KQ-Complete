import React, { useState } from "react";
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


  const [pdfUrl, setPdfUrl] = useState("");

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers

      if (sanitizedValue.length <= 8) 
      {
          const newValue = `KQ-${sanitizedValue.slice(2, 9)}`; // Use the first 6 characters
          setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: newValue,
          }));
          setRefError(""); // Clear any previous errors
      } 
      else 
      {
          setRefError("The input must be 'KQ-' followed by 6 characters or less");
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

      const response = await fetch(`/tickets/report/${formData.bookingReference}/${formData.ticketNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
    
        if(contentType)
        {
          if (contentType.includes("application/json")) 
          {
              const jsonResponse = await response.json();
              
              setResponseStatus(0); // Error
              setResponseMessage(`Error: ${jsonResponse.error}`);
              setPdfUrl("");

          } 
          else if (contentType.includes("application/pdf")) 
          {
              const pdfBlob = await response.blob();
              const pdfUrl = URL.createObjectURL(pdfBlob);
              setPdfUrl(pdfUrl);
              setResponseMessage('');

          } 
          else 
          {
              setResponseStatus(0); // Error
              setResponseMessage("Unknown response format. Please contact support");
              setPdfUrl("");

          }
        }
        else 
          {
              setResponseStatus(0); // Error
              setResponseMessage("An error occurred. Please contact support");
              setPdfUrl("");

          }
        
    } 
    else 
    {
        setResponseStatus(0); // Error
        setResponseMessage(`Error getting the ticket, please contact support.`);
        setPdfUrl("");
    }

      setIsLoading(false);

    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data. Please try again or contact support.');
      console.error('Error submitting data:', error);
      setPdfUrl("");
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
          <h2 className="text-primary text-center">Print Ticket|</h2>
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
                  maxLength={9}
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
                  maxLength={9}
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <hr />

              <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

              <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary">
                  Retrieve Ticket
                </Button>
              </div>
              
            </Form>
            
          </Col>
          {pdfUrl && (
              <div>
                <hr />
                <h4 className="text-center">Your Ticket:</h4>
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              </div>
            )}
          
            </>
      )}
        </Container>
      </Container>
    </div>
  );
}
