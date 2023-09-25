import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Table,
  Spinner,
  Col,
  Row,
  Alert,
} from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import EditBooking from "./editbooking";
import apiBaseUrl from "../../../../../config";
import { useEditBookingContext } from "../../context/booking/editbookingcontext";
import LoadingComponent from "../../../../Common/LoadingComponent";

interface FlightClass {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface Seat {
  id: number | 0;
  seat_number: string;
  flight_class: FlightClass;
  location: Location;
  is_available: boolean;
  price: number;
}

interface Passenger {
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat: Seat;
}

interface Status {
  id: number;
  name: string;
}

interface Airline {
  id: number;
  name: string;
}

interface City {
  name: string;
  country: string;
  id: number;
}

interface Flight {
  id: number;
  flight_status: Status;
  flight_number: number;
  departure_city: City;
  arrival_city: City;
  airline: Airline;
  duration: string;
  departure_time: string;
}

interface Booking {
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

  const {
    bookingReference,
    ticketNumber,
    setBookingReference,
    setTicketNumber,
  } = useEditBookingContext();

  const [isBookingValid, setIsBookingValid] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking>({
    bookingReference: "",
    email: "",
    flight_id: 0,
    departure_date: "",
    from: { name: "", id: 0 },
    to: { name: "", id: 0 },
  });



  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Use the useNavigate hook
  const navigate = useNavigate();

  // Handle changes in form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers

    let prefix = ""; // Initialize prefix based on context

    if (name === "bookingReference") {
      prefix = "KQ-BR-"; // Booking reference prefix
    } else if (name === "ticketNumber") {
      prefix = "KQ-TK-"; // Ticket number prefix
    }

    if (sanitizedValue.length <= 10) {
      const newValue = `${prefix}${sanitizedValue.slice(4, 11)}`; // Use the first 7 characters
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
      setRefError(""); // Clear any previous errors
    } else {
      setRefError(
        "The input must be the appropriate prefix followed by 6 characters or less"
      );
    }
  };

  const getResponseClass = () => {
    if (responseStatus === 1) {
      return "text-success"; // Green color for success
    } else if (responseStatus === 0) {
      return "text-danger"; // Red color for error
    } else {
      return ""; // No specific styles (default)
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
      const response = await fetch(
        `${apiBaseUrl}/bookings/get/${refNumber}/${ticketNumber}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      setIsBookingValid(true);
      const data = await response.json();

      setBookings(data);

      const bookingData = data.booking;

      // Extract the relevant data from the data object and set it to the state
      setSelectedBooking({
        bookingReference: bookingData.booking_reference,
        email: bookingData.email,
        flight_id: bookingData.flight_id,
        departure_date: bookingData.flight.departure_time, // Assuming you want the departure time as departure_date
        from: { name: bookingData.flight.departure_city.name }, // Assuming departure_city has a "name" property
        to: { name: bookingData.flight.arrival_city.name }, // Assuming arrival_city has a "name" property
      });

      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
      setLoading(false);
    }
  };

  // Reusable function to fetch flights
  const fetchFlights = (url: string) => {
    setIsLoading(true);
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        setIsLoading(false);
        return response.json();
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
        throw error;
      });
  };

  // Departure locations and destinations
  useEffect(() => {
    let url = `${apiBaseUrl}/flights`;

    if (formData.departureDate !== "") {
      url = `${apiBaseUrl}/flights/byDepartureDate/${formData.departureDate}`;
    }

    if (formData.selectedFrom !== "") {
      url = `${apiBaseUrl}/flights/byDepartureCityId/${formData.selectedFrom}`;
    }

    if (formData.departureDate !== "" && formData.selectedFrom !== "") {
      url = `${apiBaseUrl}/flights/byDepartureDateCity/${formData.departureDate}/${formData.selectedFrom}`;
    }

    fetchFlights(url)
      .then((data: { flights: Flight[] }) => {
        setFlightTableData(data.flights);
        setFormData((prevFormData) => ({
          ...prevFormData,
          flightId: 0,
        }));
      })
      .catch((error) => {
        // Handle errors here
      });
  }, [formData.departureDate, formData.selectedFrom]);

  // Cities
  useEffect(() => {
    fetch(`${apiBaseUrl}/cities`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json(); // This will automatically parse the JSON response
      })
      .then((data) => {
        setCities(data.cities);
      })
      .catch((error) => {
        throw new Error("Error fetching data: ");
      });
  }, []);

  
  // Resubmission
  const handleResubmission = (editedBooking: Booking) => {
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
      <MenuBar1 isAuthenticated={false} />
      <br />
      <br />
      <br />
      <MenuBar2 />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Container fluid>
          <h2 className="text-primary text-center">Edit Booking|</h2>
          <hr />
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

              <p className={`response-message ${getResponseClass()} text-center`}>
                {responseMessage}
              </p>

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary">
                  Retrieve Booking
                </Button>
              </div>
            </Form>
          </Col>

          <br />

          {loading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="ml-2">Loading...</span>
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

          {/* Display error message if there's an error */}
          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}

          <hr />

          {passengers.length > 0 ? (
            <div
              style={{ maxHeight: "300px", overflowY: "auto", scrollbarWidth: "none" }}
            >
              <style>
                {`
                /* Hide the scrollbar for Webkit browsers (Chrome, Safari) */
                  ::-webkit-scrollbar {
                    width: 0.5em;
                    height: 0.5em;
                  }

                  ::-webkit-scrollbar-thumb {
                    background-color: transparent;
                  }
                `}
              </style>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Passport</th>
                    <th>ID</th>
                    <th>Birth Date</th>
                    <th>Seat</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((passenger: Passenger, index: number) => (
                    <tr key={index}>
                      <td>{passenger.name}</td>
                      <td>{passenger.passport_number}</td>
                      <td>{passenger.identification_number}</td>
                      <td>{formatDate(passenger.date_of_birth)}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleViewSeat(passenger);
                          }}
                        >
                          Seat
                        </Button>
                      </td>

                      <td>
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleEditPassenger(passenger, index);
                          }}
                        >
                          Edit
                        </Button>
                      </td>

                      <td>
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleDeletePassenger(index);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-danger text-center mt-2">
              <b>You haven't added any passengers yet</b>
            </p>
          )}

          {/* Render the Seat component */}
          <PassengerSeat
            showSeatModal={showSeatModal}
            handleCloseSeatModal={handleCloseSeatModal}
            seatObject={
              selectedPassenger
                ? selectedPassenger.seat
                : {
                    seat_number: "",
                    flight_class: { id: 0, name: "" },
                    location: { id: 0, name: "" },
                    is_available: false,
                    price: 0,
                    id: 0,
                  }
            }
          />

          <hr />

          {flightTableData.length > 0 && !isLoading  && isBookingValid ? (
            <div>
              <p className="text-primary text-center">
                <b>These are The Available Flights</b>
              </p>
              <hr />
              <Row className="mt-4">
                <Col>
                  <div
                    className="table-responsive table-container"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Flight Number</th>
                          <th>Departure</th>
                          <th>Destination</th>
                          <th>AirLine</th>
                          <th>Duration</th>
                          <th>Departure Date</th>
                          <th>Return Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightTableData.map((item, index) => (
                          <tr
                            className={selectedFlight === item ? "selected-row" : ""}
                            style={{ cursor: "pointer" }}
                            key={index}
                            onClick={() => handleFlightSelection(item)}
                          >
                            <td>{item.flight_status.name}</td>
                            <td>{item.flight_number}</td>
                            <td>{item.departure_city.name}</td>
                            <td>{item.arrival_city.name}</td>
                            <td>{item.airline.name}</td>
                            <td>{item.duration}</td>
                            <td>{item.departure_time}</td>
                            <td>{item.return_time}</td>
                            <td>
                              <Button
                                variant="primary"
                                type="button"
                                disabled={item.id !== flightData.flightId} // Disable if not selected
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center">
              {isLoading && <LoadingComponent />}
              <Alert variant="warning" className="mt-2">
                No Flights Available
              </Alert>
            </div>
          )}
        </Container>
      </Container>
    </div>
  );
}
