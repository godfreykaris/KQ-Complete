import React from "react";
import { useState } from "react";
import { Container, Form, Button, Alert, Col } from "react-bootstrap";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './signup.css'

// Import the react-bootstrap-icons
import { PersonFill } from 'react-bootstrap-icons';
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //to track password visibility
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  }

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
    } else if (name === "password") {
      // Password validation
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    } 
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();

    // Form submission logic
    console.log(formData);

    // Reset form after submission
    setFormData({
      email: '',
      password: '',
    });
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <div className="d-flex justify-content-center align-items-center container-md" style={{ height: '100vh' }}>
      
      <Container>
        <div className="text-center mb-4">
          <h1><PersonFill size={48} className="text-primary" /></h1>
          <h2>Login</h2>
        </div>
        <Col md={6} className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <Alert variant="danger">{emailError}</Alert>}
          </div>

          <div className="form-group password-input-container">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type={passwordVisibility ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
            />
            
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
              style={{cursor: "pointer"}}>
              <i className={passwordVisibility ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </span>            

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </div>
          <hr/>
          <Button type="submit" variant="primary">
            Login
          </Button>

          <p className="text-center"><a href="/signup" style={{ textDecoration: "none" }}>Not a Member?</a></p>
        </form>
        </Col>
      </Container>
    </div>
    </div>
  );
}
