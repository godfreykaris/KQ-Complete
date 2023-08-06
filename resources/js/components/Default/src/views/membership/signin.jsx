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
  
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) 
      {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.user.token);
  
        setIsLoading(false);
        // Determine the role (admin or HRM) based on your backend's response
        const userRole = data.user.role; // Replace 'role' with the actual key that holds the role
        if (userRole === 'admin') 
        {
          navigate('/admin'); // Redirect to admin frontend
        } 
        else if (userRole === 'hrm') 
        {
          navigate('/hrm'); // Redirect to HRM frontend
        }
        else
        {
          navigate('/signin'); // Redirect to admin frontend
        }
      }
      else 
      {
        setIsLoading(false);
        setResponseStatus(0); // Error
        setResponseMessage(`Error: Incorrect Login Details.`);
        console.log('Authentication failed.');
        // const responseData = await response.json();
        // console.log('Validation Errors:', responseData);
      }
    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error signing. Contact Support.`);
      console.log('Error signing in:', error);
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
        <form onSubmit={handleSignIn}>
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
