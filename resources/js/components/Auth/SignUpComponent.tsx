import React, { useState } from 'react';
import { Form, Button, Alert, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import LoadingComponent from '../Common/LoadingComponent';
import apiBaseUrl from '../../config';
import { useNavigate } from 'react-router-dom';

type PasswordField = "password" | "password_confirmation";


const SignUpComponent = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    countryCode: "",
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  //to track password visibility
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);


  const togglePasswordVisibility = (field: PasswordField) => {
    if(field === "password"){
      setPasswordVisibility((prevState) => !prevState);
    }else if(field === "password_confirmation"){
      setConfirmPasswordVisibility((prevState) => !prevState);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "phone") {
      // Phone number validation
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if(/^\d+$/.test(numericValue) || numericValue === ""){
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: numericValue,
        }));
        setPhoneError("");
      }else{
        setPhoneError("The input must be numbers");
      }
      
    } else if (name === "email") {
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
    } else if (name === "password_confirmation") {
      // Confirm password validation
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      if (value !== formData.password) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
    } else {
      // Other form fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    setIsLoading(true);

    e.preventDefault();

    try 
    {
      if (formData.password !== formData.password_confirmation) 
      {
        setIsLoading(false);

        setResponseStatus(0); // Error
        setResponseMessage('Password and Confirm Password do not match.');
        // Handle password mismatch
        console.error('Password and Confirm Password do not match.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) 
      {
         setIsLoading(false);

         if (data.status) 
         {
            // Registration successful
            alert("User registered successfully");
            // Redirect to sign in
            navigate('/signin');
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
      }
    } 
    catch (error) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error: An error occurred Please try again later or contact support.`);
      console.log(`Error subminting data: ${error}`);
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

  <div className="d-flex justify-content-center align-items-center container-md" style={{ height: "100vh" }}>
      
    { isLoading ? (
      <LoadingComponent/>
      ):(     
      <div className="container-fluid">
      <div className="text-center text-primary mt-5">
          <FontAwesomeIcon icon={faUserPlus} size="4x" className="mb-3" />
          <h1>Sign Up</h1>
        </div>
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleSubmit}>
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
          </Form.Group>

          <Form.Group>
            <Form.Label>Phone:</Form.Label>
            <div className="input-group">
              <div className="input-group-prepend">
                <Form.Control
                  as="select"
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                >
                  <option value="+254">KE (+254)</option>
                  <option value="+255">TZ (+255)</option>
                  <option value="+1">USA (+1)</option>
                </Form.Control>
              </div>
              <Form.Control
                type="tel"
                id="phone"
                name="phone"
                maxLength={9}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            {phoneError && <p className="text-danger">{phoneError}</p>}
          </Form.Group>

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

          <Form.Group className="password-input-container">
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
              onClick={() => togglePasswordVisibility("password")}
              style={{ cursor: "pointer" }}
            >
              <i className={passwordVisibility ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </span>

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form.Group>

          <Form.Group className="password-input-container">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type={confirmPasswordVisibility ? "text" : "password"}
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              minLength={8}
              required
            />

            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility("password_confirmation")}
              style={{ cursor: "pointer" }}
            >
              <i className={confirmPasswordVisibility ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </span>

            {confirmError && <Alert variant="danger">{confirmError}</Alert>}
          </Form.Group>
          <br/>
          
          <div className='d-flex justify-content-center'>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>

          <br />

          <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

          <p className="text-center">
            <a href="/signin" style={{ textDecoration: "none" }}>
              Already a Member?
            </a>
          </p>
        </Form>
        </Col>
      </div>
      )}

    </div>
  );
};

export default SignUpComponent;
