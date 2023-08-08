import './bookflight.css';
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";

import { usePassengerContext } from "../../context/passengers/passengercontext";
import { useSearchFlightContext } from "../../context/flights/flightcontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import { useSeatContext } from "../../context/seats/sendseatdata";
import Seat from "../seats/viewseat.js";
import SeatMap from "../seats/seatmap.js";


export default function BookFlight() {

  const [tripType, setTripType] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tableData, setTableData] = useState([]);

  const [locations, setLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  // State to manage the seat modal
  const [showSeatModal, setShowSeatModal] = useState(false);

  //data from the search flight component
  const location = useLocation();
  const {state} = location;

  const {
    sfDepartureDate,
    sfReturnDate,
    sfSelectedFrom,
    sfSelectedTo,
  } = state || {}; 

  const [formData, setFormData] = useState({
    email: '',
    departureDate: sfDepartureDate || "",
    returnDate: sfReturnDate || "",
    selectedFrom: sfSelectedFrom || "",
    selectedTo: sfSelectedTo || "",
  }); 

  
  useEffect(() => {
    if (sfDepartureDate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        departureDate: sfDepartureDate,
        returnDate: sfReturnDate,
        selectedFrom: sfSelectedFrom,
        selectedTo: sfSelectedTo,
      }));
      console.log("sfDep", departureDate);
    }
  }, [sfDepartureDate, sfReturnDate, sfSelectedFrom, sfSelectedTo]);

  


  // Access the "passengers" array from the context using the usePassengerContext hook
  const { passengers, removePassenger } = usePassengerContext();

  //access seats from seat context
  const {seat, updateSeat} = useSeatContext();


  const navigate2 = useNavigate();

  //to remove passenger when delete button is clicked
  const handleDeletePassenger = (index) => {
    removePassenger(index);
  };

  //to edit passenger when the edit button is clicked
  const handleEditPassenger = (passenger, index) => {   
    navigate2('/addpassenger1', {state: {passenger, index}});
  };

  const [emailError, setEmailError] = useState("");

  // Format date imported from AddPassenger1
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };  

  // Handle change
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
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  

  // Handle plane row select
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = () => {
    setIsButtonClicked(true);
  };

  const handleNavigateToViewPlane = () => {
    setIsButtonClicked(false);
    navigate('/seatmap');
  };

  const handleTripType = (e) => {
    setTripType(e.target.value);
  };

  // Handle Add passenger click
  const handleAddPassengerClick = () => {
    updateSeat({});
    console.log('Seat:', seat);
    setIsButtonClicked(false);
  };

  //addpassenger message befor selecting flight
  const renderTooltip = (message) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

  // Departure locations and destinations
  useEffect(() => {
    if (departureDate !== "") {
      fetchData();
    }
  }, [departureDate]);

  const fetchData = () => {
    fetch("/src/components/testdata/planes.json")
      .then((response) => response.json())
      .then((data) => {
        const filterData = data.flights.filter((item) => {
          const itemDate = item.depdate.date;
          const selectedDate = departureDate.split("-").reverse().join("/");
          return itemDate === selectedDate;
        });
        setTableData(filterData);
      })
      .catch((error) => {
        setErrorMessage("An error occured");
        console.log("Error fetching data: ", error);
      });
  };

  
  //locations
  useEffect(() => {
    fetch("/src/components/testdata/destinations.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(data.locations);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleFromChange = (selectedOption) => {
    setSelectedFrom(selectedOption);
    const filteredLocations = locations.filter(
      (location) => location.name !== selectedOption
    );
    setSelectedTo("");
    setFilteredLocations(filteredLocations);
  };

  const handleToChange = (selectedOption) => {
    setSelectedTo(selectedOption);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try{
      fetchData();
    }
    catch{
      setErrorMessage("An error occured!");
      console.log("Error fetching data", error);
    }
  };

  //the seat modal  

   // Function to open the seat modal
   const handleViewSeat = () => {
     setShowSeatModal(true);
   };
 
   // Function to close the seat modal
   const handleCloseSeatModal = () => {
     setShowSeatModal(false);
   };
  

   //to handle flight selection
   const [selectedFlight, setSelectedFlight] = useState(null);

   //function to handle flight selection
   const handleFlightSelection = (flight) => {
    if(selectedFlight === null){
      setSelectedFlight(flight);
    }else {
      const confirmUpdate = window.confirm("Changing the flight will clear seats for all passengers. Do you want to continue");
      if(confirmUpdate){
        setSelectedFlight(flight);

        //clear seat data for every passenger
        const updatedPassengers = passengers.map(passenger => ({
          ...passenger,
          seat: {},
        }));

        //update seat data using the context function
        updateSeat({});

        //update passenger adata using context function
        updatedPassengers(updatedPassengers);
      }
    }
    
   };

   return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <h2 className="text-primary text-center"><b>Book Flight|</b></h2>
      <Container className="d-flex justify-content-center align-items-center mt-3" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Row>
          <Col md={6} className="mx-auto">
            <Form onSubmit={handleSubmit}>

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

              <Form.Group>
                <Form.Label>Trip Type:</Form.Label>
                <Form.Control
                  as="select"
                  id="trip-type"
                  value={tripType}
                  onChange={handleTripType}
                  required
                >
                  <option value="">Select Trip Type</option>
                  <option value="OneWay">One Way</option>
                  <option value="Round">Round Trip</option>
                  <option value="MultiCity">Multi-city</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Departure Date:</Form.Label>
                <Form.Control
                  type="date"
                  id="departure-date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </Form.Group>

              {tripType === "Round" && (
                <Form.Group>
                  <Form.Label>Return Date:</Form.Label>
                  <Form.Control
                    type="date"
                    id="return-date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group>
                <Form.Label>From:</Form.Label>
                {locations.length > 0 ? (
                  <Form.Control
                    as="select"
                    id="from"
                    value={selectedFrom}
                    onChange={(e) => handleFromChange(e.target.value)}
                    required
                  >
                    <option value="">Select Departure Location</option>
                    {locations.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ml-2">Loading Departures...</span>
                  </div>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>To:</Form.Label>
                {filteredLocations.length > 0 ? (
                  <Form.Control
                    as="select"
                    id="to"
                    value={selectedTo}
                    onChange={(e) => handleToChange(e.target.value)}
                    required
                  >
                    <option value="">Select Destination</option>
                    {filteredLocations.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ml-2">Loading Destinations...</span>
                  </div>
                )}
              </Form.Group>
              </Form>
            </Col> 

                {/* Display error message if there's an error */}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              <hr/>
          
              {passengers.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'hidden' }}>
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
                    {passengers.map((passenger, index) => (
                      <tr key={index}>
                        <td>{passenger.name}</td>
                        <td>{passenger.passport}</td>
                        <td>{passenger.idNumber}</td>
                        <td>{formatDate(passenger.birthDate)}</td>
                        <td>
                          <Button variant="primary" onClick={handleViewSeat}>
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
                <p className="text-danger text-center mt-5"><b>You haven't added any passengers yet</b></p>
              )}


              {/* Render the Seat component */}
              <Seat
                showSeatModal={showSeatModal}
                handleCloseSeatModal={handleCloseSeatModal}
                seatObject={seat}
              />

              <br/>

              {isButtonClicked && <SeatMap/>}
              <br/>
              <div className="d-flex justify-content-between align-items-center">
                
                <OverlayTrigger
                  placement='top'
                  overlay={renderTooltip("Select a flight inorder to add a passenger")}
                  >
                    <span>
                      <Button
                        variant="primary"
                        onClick={(event) => {
                          if (selectedFlight === null) {
                            event.preventDefault(); // Prevent the default link behavior
                          } else {
                            handleAddPassengerClick();
                            navigate("/addpassenger1");
                          }
                        }}
                        disabled={selectedFlight === null}
                        type="button"
                      >
                        Add Passenger
                      </Button>
                    </span>
                </OverlayTrigger>                  
                

                <hr/>

                <Button type="submit" variant="primary">
                  Book Now!
                </Button>
              </div>

              <br/>
              <br/>
              <br/>

              <p className="text-primary text-center"><b>These are The Available Flights</b></p>

              <Row className="mt-4">
                <Col>
                  <div className="table-responsive table-container">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Flight Number</th>
                          <th>Destination</th>
                          <th>AirLine</th>
                          <th>Duration</th>
                          <th>Departure Date</th>
                          <th>Return Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((item, index) => (
                          <tr
                            key={index}
                            className={selectedFlight === item ? "selected-row" : ""}
                            onClick={() => handleFlightSelection(item)}
                          >
                            <td>{item.name}</td>
                            <td>{item.flightNumber}</td>
                            <td>{item.destination}</td>
                            <td>{item.airline}</td>
                            <td>{item.duration}</td>
                            <td>{item.depdate.date}</td>
                            <td>{item.retdate.date}</td>
                            <td>
                              <Button
                                onClick={() => {
                                  handleRowClick();
                                  handleNavigateToViewPlane();
                                }}
                                variant="primary"
                                type="button"
                                disabled={selectedFlight !== item} // Disable if not selected
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


        </Row>
      </Container>
    </Container>
    </div>    
  ); 
}