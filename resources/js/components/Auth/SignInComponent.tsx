import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom"
import { Col, Container, Alert, Form, Button } from 'react-bootstrap';

import '@fortawesome/fontawesome-free/css/all.min.css';
import { PersonFill } from 'react-bootstrap-icons';

import apiBaseUrl from '../../config';
import LoadingComponent from '../Common/LoadingComponent';

import '../../../css/signup.css'

const SignInComponent = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

    //to track password visibility
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisibility((prevState) => !prevState);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
    
      if (name === "email") {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFormData((prevFormData) => ({
          ...prevFormData,
          email: value,
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
          password: value,
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

    setResponseMessage("");


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
        setIsLoading(false);

        const data = await response.json();

        if (data.user) 
         {
            sessionStorage.setItem('access_token', data.user.token);
          
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
              navigate('/'); // Redirect to admin frontend
            }
         } 
         else 
         {
           setResponseStatus(0); // Error
           setResponseMessage(`Error: ${data.error}`);
         }

        
      }
      else 
      {
        setIsLoading(false);
        setResponseStatus(0); // Error
        setResponseMessage(`Error: ${response.statusText}.`);
        console.log('Authentication failed.');
        // const responseData = await response.json();
        // console.log('Validation Errors:', responseData);
      }
    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error signing in. Contact Support.`);
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
    <div className="d-flex justify-content-center align-items-center container-md" style={{ height: '100vh' }}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Container>
          <div className="text-center mb-4">
            <h1>
              <PersonFill size={48} className="text-primary" />
            </h1>
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
                  minLength={8}
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
          
              <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary">
                  Login
                </Button>
              </div>

            </form>

            <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

            <div className="text-center mt-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>Don't have an account? Sign Up</Link>
              <Button variant="primary mt-4">
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
              </Button>
            </div>

          </Col>
        </Container>
      )}
    </div>
  );
}

export default SignInComponent;
