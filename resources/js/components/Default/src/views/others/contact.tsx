import React, { useState } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1.jsx";
import MenuBar2 from "../../components/menubars/menubar2.jsx";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
    console.log(formData); // You can add your logic for handling the form submission here

    // Clear form fields after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <hr/>
      <Container>
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
        <h1 className="text-center text-primary mt-5">Contact Us</h1>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <p className="text-danger">{emailError}</p>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>

        <div className="mt-4">
          <p className="mb-1"><b>For inquiries via email:</b></p>
          <a href="mailto:info@kqairline.com" className="btn btn-info mr-3">
            Send Email
          </a>
          <hr/>
          <p className="mb-1"><b>For phone inquiries:</b></p>
          <a href="tel:+1234567890" className="btn btn-primary">
            Call Now
          </a>
        </div>
        </Col>        
      
      </Container>
    </div>
  );
};

export default ContactUs;
