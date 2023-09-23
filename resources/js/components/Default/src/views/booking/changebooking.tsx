import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Table, Spinner, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import EditBooking from "./editbooking";
import apiBaseUrl from "../../../../../config";

import { useEditBookingContext } from "../../context/booking/editbookingcontext";

interface Location {
  name: string;  
}

interface booking{
  bookingReference: string;
  email: string;
  flight_id: number;
  departure_date: string;
  from: Location;
  to: Location;
}


export default function ChangeBooking() {
  const [formData, setFormData] = useState({
    bookingReference: "",
    ticketNumber: "",
  });

  const {bookingReference, ticketNumber, setBookingReference, setTicketNumber} = useEditBookingContext();

  const [bookings, setBookings] = useState<booking | {}>({});
  const [loading, setLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<booking>({ bookingReference: "", email: "", flight_id: 0, departure_date: "", from: {name: ""}, to: {name: ""} });

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Use the useNavigate hook
  const navigate = useNavigate();

  //handle changes in form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers

    let prefix = ""; // Initialize prefix based on context

    if (name === "bookingReference") 
    {
        prefix = "KQ-BR-"; // Booking reference prefix
    } 
    else if (name === "ticketNumber") 
    {
        prefix = "KQ-TK-"; // Ticket number prefix
    }

    if (sanitizedValue.length <= 10) 
    {
        const newValue = `${prefix}${sanitizedValue.slice(4, 11)}`; // Use the first 7 characters
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
        setRefError(""); // Clear any previous errors
    } 
    else 
    {
        setRefError("The input must be the appropriate prefix followed by 6 characters or less");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData(formData.bookingReference, formData.ticketNumber);
  };


  const fetchData = async (refNumber: string, ticketNumber: string) => {
    setLoading(true);
    setRefError("");

    try {
      const response = await fetch(`${apiBaseUrl}/bookings/get/${refNumber}/${ticketNumber}`);
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();      

      alert(JSON.stringify(data));

      setBookings(data);
      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
      setLoading(false);
    }
  };

  

  // Open modal for editing booking
  const handleEditBooking = (booking: booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
    setBookingReference(formData.bookingReference);
    setTicketNumber(formData.ticketNumber);

    alert(bookingReference);
    alert(ticketNumber);
  };

  //resubmission
  const handleResubmission = (editedBooking: booking) => {

    // Find the index of the edited booking in the bookings array
    const editedBookingIndex = bookings.findIndex(
      (booking) => booking.bookingReference === editedBooking.bookingReference
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
      <MenuBar1 isAuthenticated={false}/>
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
                  id="bookingReference"
                  name="bookingReference"
                  maxLength={12}
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
                  maxLength={12}
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <hr />

              <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

              <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary">
                  Retrieve Booking
                </Button>
              </div>
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
        {Object.keys(bookings).length !== 0 && (
          <div style={{ overflowY: "auto" }}>
          {selectedBooking && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Departure Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Passengers</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedBooking.email}</td>
                  <td>{selectedBooking.departure_date}</td>
                  <td>{selectedBooking.from.name}</td>
                  <td>{selectedBooking.to.name}</td>
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
                      onClick={() => handleEditBooking(selectedBooking)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
        )}
        
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
