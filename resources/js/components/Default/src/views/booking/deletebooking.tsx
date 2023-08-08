import React, { useState } from "react";
import { Container, Form, Button, Table, Spinner, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1.jsx";
import MenuBar2 from "../../components/menubars/menubar2.jsx";

export default function Deletebooking() {
  const [formData, setFormData] = useState({
    refNumber: "",
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refError, setRefError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value.replace(/\D/g, "");

    // Add the "KQ-" prefix and set the error message
    if (newValue.length <= 9) {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    fetchData(formData.refNumber);
  };

  const fetchData = async (refNumber) => {
    setLoading(true);
    setRefError("");

    try {
      const response = await fetch("/src/components/testdata/bookings.json");
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      const filteredData = data.bookings.filter((booking) => booking.refNumber === refNumber);

      setBookings(filteredData);
      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // delete booking
  const handleDelete = (booking) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this booking?");
    if (shouldDelete) {
      console.log("Deleting booking with id: ", booking.refNumber);
      // Perform the deletion here
    }
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center container-md" style={{ minHeight: "100vh" }}>
      <Container fluid>
        <h2 className="text-primary text-center">Delete a Booking|</h2>
        <hr/>
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Booking Reference:</Form.Label>
            <Form.Control
              type="text"
              id="refNumber"
              name="refNumber"
              maxLength="9"
              value={formData.refNumber}
              onChange={handleChange}
              required
            />
            {refError && <p className="text-danger">{refError}</p>}
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary">
            Retrieve bookings
          </Button>
        </Form>
        </Col>
        
        <hr/>
        {loading && (
          <div className="d-flex align-items-center">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {/* display booking data */}
        <div style={{overflow: "auto"}}>
        {bookings.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Trip</th>
                <th>Dep. Date</th>
                <th>From</th>
                <th>To</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.email}</td>
                  <td>{booking.tripType}</td>
                  <td>{booking.departure}</td>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                  <td>
                    <Button onClick={() => handleDelete(booking)} variant="primary" type="button">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </div>
      </Container>
    </Container>
    </div>
  );
}
