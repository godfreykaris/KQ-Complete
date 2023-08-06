import { useState } from "react";
import { Container, Form, Button, Alert, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import '@fortawesome/fontawesome-free/css/all.min.css';
import MenuBar2 from "../../components/menubars/menubar2";

export default function ChangeBookingInquiry() {
  const [formData, setFormData] = useState({
    email: '',
    inquiry: '',
  });

  const [emailError, setEmailError] = useState("");

  const handleChange = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    // Form submission logic
    console.log(formData);

    // Reset form after submission
    setFormData({
      email: '',
      inquiry: '',
    });
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="container-fluid">
        <h2 className="text-primary text-center">Inquire To Change Booking|</h2>
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <p className="text-danger">{emailError}</p>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Inquiry:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="inquiry"
              name="inquiry"
              value={formData.inquiry}
              onChange={handleChange}
              placeholder="Message should not be more than  120 letters"
              maxLength="120"
              required
            />
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary">
            Send
          </Button>
        </Form>
        </Col>        
      </div>
    </Container>
    </div>
  );
}
