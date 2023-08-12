import './bookflight.css';
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Spinner, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";

import { usePassengerContext, PassengerContextType } from "../../context/passengers/passengercontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import { useSeatContext, SeatContextType } from "../../context/seats/sendseatdata";
import Seat from "../seats/viewseat.js";
import SeatMap from "../seats/seatmap.js";

import apiBaseUrl from '../../../../../config';

interface seat{
  _id: number;
  number: number;
  class: string;
  location: string;
  availability: boolean;
  price: string;
}

interface passenger{
  name: string;
  passport: number;
  idNumber: number;
  birthDate: string;
  seat: seat | {};
}

interface flight{
  id: number;
  name: string;
  flight_number: number;
  destination: string;
  airline: string;
  duration: string;
  departure_time:  string;
  return_time: string;
}

interface location{
  name: string;
  country: string;
}


export default function BookFlight() {

  const [tripType, setTripType] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightTableData, setFlightTableData] = useState<flight[]>([]);

  const [locations, setLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const [flightId, setFlightId] = useState<number>(0);

  const [loading, setLoading] = useState(false);

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
    }
  }, [sfDepartureDate, sfReturnDate, sfSelectedFrom, sfSelectedTo]);

  


  // Access the "passengers" array from the context using the usePassengerContext hook
  const {passengers, removePassenger, updatePassenger} = usePassengerContext() as PassengerContextType;

  //access seats from seat context
  const {seat, updateSeat} = useSeatContext() as SeatContextType;


  const navigate2 = useNavigate();

  //to remove passenger when delete button is clicked
  const handleDeletePassenger = (index: number) => {
    removePassenger(index);
  };

  //to edit passenger when the edit button is clicked
  const handleEditPassenger = (passenger: passenger, index: number) => {   
    navigate2('/addpassenger1', {state: {passenger, index}});
  };

  const [emailError, setEmailError] = useState("");

  // Format date imported from AddPassenger1
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };  

  // Handle change
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
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

  const handleTripType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTripType(e.target.value);
  };

  // Handle Add passenger click
  const handleAddPassengerClick = () => {
    updateSeat({
      number: 0,
      class: '',
      location: '',
      availability: false,
      price: '',
      _id: 0
    });
    setIsButtonClicked(false);
  };

  //addpassenger message befor selecting flight
  const renderTooltip = (message: string) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

  // Departure locations and destinations
  useEffect(() => {
    if (departureDate !== "") {
      fetchFlightsByDeparture();
    }
    else{
      fectchAllFlights();
    }
  }, [departureDate]);


  const fetchFlightsByDeparture = () => {
    fetch(`${apiBaseUrl}/flights/byDepartureDate/${departureDate}`)
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      });
  };

  const fectchAllFlights = () => {
    fetch(`${apiBaseUrl}/flights`)
      .then((response) => {
        if (!response.ok) {          
          throw new Error("Error fetching data");
        }     
        return response.json(); // This will automatically parse the JSON response
      })
      .then((data) => {
        setFlightTableData(data.flights); 
      })
      .catch((error) => {        
        throw new Error("Error fetching data: ");
      });
  } 

  
  //locations
  useEffect(() => {
    fetch(`${apiBaseUrl}/cities`)
      .then((response) => {
        if (!response.ok) {          
          throw new Error("Error fetching data");
        }     
        return response.json(); // This will automatically parse the JSON response
      })
      .then((data) => {
        setLocations(data.cities); 
      })
      .catch((error) => {        
        throw new Error("Error fetching data: ");
      });
  }, []);
  
  

  const handleFromChange = (selectedOption: string) => {
    setSelectedFrom(selectedOption);
    const filteredLocations = locations.filter(
      (location: location) => location.name !== selectedOption
    );
    setSelectedTo("");
    setFilteredLocations(filteredLocations);
  };

  const handleToChange = (selectedOption: string) => {
    setSelectedTo(selectedOption);
  };

  //----------- Handle submit --------------//
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(""); //clear previous errors

    try{
      const passengersWithSeats = passengers.filter(
        (passenger) => Object.keys(passenger.seat).length > 0
      );

      if(passengersWithSeats.length === 0){
        setErrorMessage("Please select seats for passengers");
        return;
      }
      
      //data to be sent
      const sendData = {
        email: formData.email,
        flightId: flightId,
        passengers: passengers,
      }
  
      setLoading(true);
  
      //perform POST reuest
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sendData),
      });
  
      if(!response.ok){
        if(response.status === 400){
          const errorData = await response.json();
          throw new Error(`Bad Request: ${errorData.message}`);
        }else if(response.status === 500){
          throw new Error("Internal server error");
        }else{
          throw new Error("Error sending data");
        }        
      }
  
      setLoading(false);
    }catch (error){
      setErrorMessage("An error occured while booking the flight");

      setLoading(false);
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
   const [selectedFlight, setSelectedFlight] = useState<flight | null>(null);

   //function to handle flight selection
   const handleFlightSelection = (flight: flight) => {
    if(selectedFlight === null){
      setSelectedFlight(flight);
      setFlightId(flight.id);
    }else {
      const confirmUpdate = window.confirm("Changing the flight will clear seats for all passengers. Do you want to continue");
      if(confirmUpdate){
        setSelectedFlight(flight);

        //clear seat data for every passenger
        const updatedPassengers = passengers.map((passenger: passenger) => ({
          ...passenger,
          seat: {}
        }));

        //update seat data using the context function
        updateSeat({
          number: 0,
          class: '',
          location: '',
          availability: false,
          price: '',
          _id: 0         
        });

        //update passenger adata using context function
        updatedPassengers.forEach((updatedPassenger, index: number) => {
          updatePassenger(index, updatedPassenger)
        })
      }
    }
    
   };

   return (
    <div>
      <MenuBar1 isAuthenticated={false}/>
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
                  onChange={(event) => handleTripType(event)}
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
                    {locations.map((option: location, index: number) => (
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
                    {filteredLocations.map((option: location, index: number) => (
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
                    {passengers.map((passenger: passenger, index: number) => (
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

              {isButtonClicked && <SeatMap planeId={undefined} onSeatSelected={undefined}/>}
              <br/>
              <div className="d-flex justify-content-between align-items-center">
               
                <OverlayTrigger
                  placement="top"
                  overlay={
                    selectedFlight === null ? (
                      renderTooltip("Select a flight inorder to add a passenger")
                    ) : (
                      <></> // An empty fragment, effectively disabling the overlay
                    )
                  }
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
                        {flightTableData.map((item: flight, index: number) => (
                          <tr
                            key={index}
                            className={selectedFlight === item ? "selected-row" : ""}
                            onClick={() => handleFlightSelection(item)}
                          >
                            <td>{item.name}</td>
                            <td>{item.flight_number}</td>
                            <td>{item.destination}</td>
                            <td>{item.airline}</td>
                            <td>{item.duration}</td>
                            <td>{item.departure_time}</td>
                            <td>{item.return_time}</td>
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
