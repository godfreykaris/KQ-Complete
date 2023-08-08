import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Table, Spinner, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1.jsx";
import MenuBar2 from "../../components/menubars/menubar2.jsx";
import EditBooking from "./editbooking.jsx";

export default function ChangeBooking() {
  const [formData, setFormData] = useState({
    refNumber: "",
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Use the useNavigate hook
  const navigate = useNavigate();

  //handle changes in form values
  const handleChange = () => {
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

      const filteredData = data.bookings.filter((booking) => {
        return booking.refNumber === refNumber;
      });

      setBookings(filteredData);
      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
      setLoading(false);
    }
  };

  // Open modal for editing booking
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  //resubmission
  const handleResubmission = (editedBooking) => {

    // Find the index of the edited booking in the bookings array
    const editedBookingIndex = bookings.findIndex(
      (booking) => booking.refNumber === editedBooking.refNumber
    );

    if (editedBookingIndex !== -1) {
      // Update the booking data for the edited booking only
      const updatedBookings = [...bookings];
      updatedBookings[editedBookingIndex] = editedBooking;
      setBookings(updatedBookings);
    }

    // Close the modal
    setShowEditModal(false);
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <h2 className="text-primary text-center">Editd a Booking|</h2>
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
            {refError && <Form.Text className="text-danger">{refError}</Form.Text>}
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary">
            Retrieve booking
          </Button>
        </Form>
        </Col>
        

        <br/>

        {loading && (
          <div className="d-flex align-items-center">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ml-2" >Loading...</span>
          </div>
        )}

        {/* Display booking data */}
        <div style={{ overflowY: "auto" }}>
          {bookings.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Trip</th>
                  <th>Dep. Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Change Pass.</th>
                  <th>Edit</th>
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
                      <Button
                        onClick={() => navigate("/changepassenger")}
                        variant="primary"
                      >
                        Change
                      </Button>
                    </td>
                    <td>
                      <Button
                        onClick={() => handleEditBooking(booking)}
                        variant="primary"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>

      <EditBooking
        showEditModal={showEditModal}
        handleResubmission={handleResubmission}
        bookingDataObject={selectedBooking}
        handleClose={() => setShowEditModal(false)}
      />
    </Container>
    </div>
  );
}
