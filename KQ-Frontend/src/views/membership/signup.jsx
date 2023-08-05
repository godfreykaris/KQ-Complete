import { useEffect, useState } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./signup.css";

import { useStateContext } from "../../components/miscallenious/contextprovider";

export default function SignUp() {

  const context = useStateContext();

  const [formData, setFormData] = useState({
    Name: "",
    countryCode: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  //to track password visibility
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      // Phone number validation
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
      setPhoneError("The input must be numbers"); // Reset phoneError when a valid phone number is entered
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
    } else if (name === "confirmPassword") {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    // Form submission logic
    console.log(formData);

    context.setFormData(formData);

    // Display success message
  context.setNotification("Form submitted successfully");

    // Reset form after submission
    setFormData({
      Name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <div className="d-flex justify-content-center align-items-center container-md" style={{ height: "100vh" }}>
      
     
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
              id="first-name"
              name="firstName"
              value={formData.firstName}
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
                maxLength="13"
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
              minLength="8"
              required
            />

            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              <i className={passwordVisibility ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </span>

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form.Group>

          <Form.Group className="password-input-container">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              id="confirmpassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="8"
              required
            />

            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              <i className={passwordVisibility ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </span>

            {confirmError && <Alert variant="danger">{confirmError}</Alert>}
          </Form.Group>
          <br/>
          <Button type="submit" variant="primary">
            Submit
          </Button>

          <br />

          <p className="text-center">
            <a href="/signin" style={{ textDecoration: "none" }}>
              Already a Member?
            </a>
          </p>
        </Form>
        </Col>
      </div>
    </div>
    </div>
  );
}
