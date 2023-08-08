import React, { useState } from "react";
import { Container, Form, Col, Button, Alert } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1.jsx";
import MenuBar2 from "../../components/menubars/menubar2.jsx";

export default function PrintTicket() {
  const [refError, setRefError] = useState("");
  const [formData, setFormData] = useState({
    bookingReference: "",
    ticketNumber: "",
  });
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value.replace(/\D/g, "");
  
    // Add the "KQ-" prefix and set the error message
    if (newValue.length <= 8) {
      newValue = `KQ-${newValue}`;
      setRefError("");
    } else {
      setRefError("The input must be 6 digits or less");
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { pdfUrl } = await response.json();
        setPdfUrl(pdfUrl);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
        setPdfUrl("");
      }
    } catch (error) {
      setError("An error occurred");
      setPdfUrl("");
    }
  };

  return (
    <div>
      <MenuBar1 />
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
          <Col md={6} className="mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Booking Reference:</Form.Label>
                <Form.Control
                  type="text"
                  id="bookingReference"
                  name="bookingReference"
                  maxLength="9"
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
                  maxLength="9"
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <hr />
              <Button type="submit" variant="primary">
                Retrieve Ticket
              </Button>
            </Form>
            {pdfUrl && (
              <div>
                <hr />
                <h4>Your Ticket:</h4>
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              </div>
            )}
          </Col>
        </Container>
      </Container>
    </div>
  );
}
