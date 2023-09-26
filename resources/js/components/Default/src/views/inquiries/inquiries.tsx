import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiBaseUrl from "../../../../../config";
import LoadingComponent from "../../../../Common/LoadingComponent";

interface inquiry{
  id: number;
  name: string;
}

export default function SendInquiry() {
  
  const [formData, setFormData] = useState({
    booking_inquiry_type_id: 0,
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<inquiry[] | []>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number>(0);
  const [selectedInquiry, setSelectedInquiry] = useState<inquiry | null>(null)

  //alerts
  const [successAlert, setSuccessAlert] = useState(false);
  const [erroAlert, setErrorAlert] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  //fetching all inquiry types as soon as the componenet mounts
  useEffect(() => {
    fetch(`${apiBaseUrl}/booking_inquiry/inquiry_types`)
      .then((response) => {
        if (!response.ok) {          
          throw new Error("Error fetching data");
        }     
        return response.json(); // This will automatically parse the JSON response
      })
      .then((data) => {
        setInquiries(data.inquiries); 
      })
      .catch((_error) => {        
        throw new Error("Error fetching data: ");
      });
  }, []); 

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
  
    if (name === "email") {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      if (emailRegex.test(value)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email format");
      }
    } else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
          }));
    }           
    
  };

  const handleInquiryTypeChange = (selectedOption: number) => {
    const selectedInquiryObject = inquiries.find((inquiry) => inquiry.id === selectedOption);
    setSelectedInquiryId(selectedOption); 
    setSelectedInquiry(selectedInquiryObject || null);   
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
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    //check if there is any error before submitting
    if(emailError){
      return;
    }

    //create data to be sent
    const sendData = {
      booking_inquiry_type_id: selectedInquiryId,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try{
      let response;
      //send the data to the backend
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {        
        response = await fetch(`${apiBaseUrl}/booking_inquiry/guest`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'Accept': 'application/json',
          },
          body: JSON.stringify(sendData),
        })        
      }else{
        response = await fetch(`${apiBaseUrl}/booking_inquiry/registered_user`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'Accept': 'application/json',
          },
          body: JSON.stringify(sendData),
        })
      }

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
        
    setLoading(false);
  };

  
  return (
    <div>
      <MenuBar1 isAuthenticated={false}/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center mt-0" style={{ height: '100vh' }}>
      <div className="container-fluid">
        <h2 className="text-primary text-center">Make an Inquiry</h2>
        <Col md={6} className="mx-auto">
        <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Inquiry Type:</Form.Label>
            {inquiries.length > 0 ? (
              <Form.Control
                as="select"
                id="inquiry"
                value={selectedInquiryId}
                onChange={(e) => handleInquiryTypeChange(Number(e.target.value))}
                required
              >
                <option value="">Select Inquiry Type</option>
                {inquiries.map((option: inquiry, index: number) => (
                  <option key={index} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Form.Control>
            ) : (
              <div className="text-center">
                <LoadingComponent/>
                <span className="ml-2">Loading Inquiry types...</span>
              </div>
            )}
            </Form.Group>

            <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  maxLength={120}
                  required
                />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {emailError && <p className="text-danger">{emailError}</p>}
            </Form.Group>         

            <Form.Group>
              <Form.Label>Subject:</Form.Label>
              <Form.Control
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                maxLength={120}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message should not be more than  120 letters"
                maxLength={120}
                required
              />
            </Form.Group>


          <hr/>

          <div className="d-flex justify-content-center">            
            <Button type="submit" variant="primary">
              {loading ? (
                <Spinner animation='border' size='sm'/>
              ) : (
                "Send"
              )}
            </Button>
          </div>          

        </Form>
        </Col>
      </div>
    </Container>
    </div>
  );
}
