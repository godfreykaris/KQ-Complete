import './bookflight.css';
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Spinner, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";

import { usePassengerContext, PassengerContextType } from "../../context/passengers/passengercontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import { useSeatContext, SeatContextType } from "../../context/seats/sendseatdata";
import { BookingContextType, useBookingContext } from '../../context/booking/bookflightcontext';
import Seat from "../seats/viewseat.js";

import apiBaseUrl from '../../../../../config';

interface flight_class{
  id: number;
  name: string;
}

interface location{
  id: number;
  name: string;
}

interface seat{
  seat_id: number;
  seat_number: string;
  flight_class: flight_class | {id: 0, name: ''}; 
  location: location | {id: 0, name: ''};
  is_available: boolean;
  price: string;
}

interface passenger{
  name: string;
  passport_number: number;
  identification_number: number;
  date_of_birth: string;
  seat: seat | {
    seat_number: string,
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    seat_id: 0
  };
  seat_id: number
}

interface status{
  name: string;
}

interface airline{
  name: string;
}

interface flight{
  id: number;
  flight_status: status;
  flight_number: number;
  departure_city: locations;
  arrival_city: locations;
  airline: airline;
  duration: string;
  departure_time:  string;
  return_time: string;
}

interface locations{
  name: string;
  country: string;
  id: number;
}

export default function BookFlight() { 
  
  const [locations, setLocations] = useState<locations[]>([]); 
  const [filteredLocations, setFilteredLocations] = useState<locations[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // State to manage the seat modal
  const [showSeatModal, setShowSeatModal] = useState(false);

  //data from the search flight component
  const location = useLocation();

  // Access the "passengers" array from the context using the usePassengerContext hook
  const {flight_id, passengers, removePassenger, updatePassenger, newFlightId} = usePassengerContext() as PassengerContextType;
  const [selectedPassenger, setSelectedPassenger] = useState<passenger | undefined>(undefined);

  //to store values
  const {formData, setFormData, flightTableData, setFlightTableData, selectedFlight, setSelectedFlight} = useBookingContext() as BookingContextType;

  //access seats from seat context
  const {updateSeat} = useSeatContext() as SeatContextType;

  const navigate2 = useNavigate();

  // Handle plane row select
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const navigate = useNavigate();


  //check if there is formData in the location state
  useEffect(() => {
    if (location.state && location.state.formData) {
      const formDataBack = location.state?.formData;
      const selectedFlightBack = location.state?.selectedFlight;

      setSelectedFlight(selectedFlightBack);
      setFormData(formDataBack);
    }
  }, [location.state]);


  //to remove passenger when delete button is clicked
  const handleDeletePassenger = (index: number) => {
    removePassenger(index);
  };

  //to edit passenger when the edit button is clicked
  const handleEditPassenger = (passenger: passenger, index: number) => {   
    const backTo = "bookflight";
    navigate2('/addpassenger1', {state: {passenger, index, formData, selectedFlight, backTo}});
  };  

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

  const handleTripType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tripType: value
    }))
    //setTripType(e.target.value);
  };

  // Handle Add passenger click
  const handleAddPassengerClick = () => {
    setIsButtonClicked(false);
  };

  //addpassenger message befor selecting flight
  const renderTooltip = (message: string) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

  // Departure locations and destinations
  useEffect(() => {
    if (formData.departureDate !== "" && formData.selectedFrom.name !== "") {
      fetchFlightsByDepartureDateAndCity();      
    }else if(formData.departureDate !== ""){
      fetchFlightsByDepartureDate();
    }else if(formData.selectedFrom.name !== ""){
      fetchFlightsByCity();
    }
    else{
      fectchAllFlights();
    }
  }, [formData.departureDate, formData.selectedFrom]);


  //flight filters
  const fetchFlightsByCity = () => {
    fetch(`${apiBaseUrl}/flights/byDepartureCityId/${formData.selectedFrom.id}`)
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      });
  };

  const fetchFlightsByDepartureDate = () => {
    fetch(`${apiBaseUrl}/flights/byDepartureDate/${formData.departureDate}`)    
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      });
  };

  const fetchFlightsByDepartureDateAndCity = () => {
    fetch(`${apiBaseUrl}/flights/byDepartureDateCity/${formData.departureDate}/${formData.selectedFrom.id}`)
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
      .catch((_error) => {        
        throw new Error("Error fetching data: ");
      });
  } 

  //end of flight filters
  
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
      .catch((_error) => {        
        throw new Error("Error fetching data: ");
      });
  }, []); 

  const handleFromChange = (selectedOption: string) => {
    const selectedLocation = locations.find((location) => location.name === selectedOption);
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedFrom: {
        ...prevFormData.selectedFrom,
        name: selectedLocation?.name || '',
        country: selectedLocation?.country || '',
        id: selectedLocation?.id || 0
      },
    }));

    const filteredLocations = locations.filter(
      (location: locations) => location.name !== selectedOption
    );

  // Update the selectedTo.name property using the same approach
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTo: {
        ...prevFormData.selectedTo,
        name: '',
        country: '',
        id: 0,
      },
    }));

    setFilteredLocations(filteredLocations);
  };

  const handleToChange = (selectedOption: string) => {    
    const selectedLocation = filteredLocations.find((location) => location.name === selectedOption)

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTo: {
        ...prevFormData.selectedTo,
        name: selectedLocation?.name || '',
        country: selectedLocation?.country || '',
        id: selectedLocation?.id || 0
      }
    }));

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
        flight_id: flight_id,
        email: formData.email,        
        passengers: passengers,
      }
  
      setLoading(true);
  
      //perform POST reuest
      const response = await fetch(`${apiBaseUrl}/bookings`, {
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
      }else{
        setSuccessMessage("Success!");
      }
  
      setLoading(false);
    }catch (error){
      setErrorMessage("An error occured while booking the flight");

      setLoading(false);
    }
       
  };

  //the seat modal  

   // Function to open the seat modal
   const handleViewSeat = (passenger: passenger) => {
     setShowSeatModal(true);
     setSelectedPassenger(passenger);
   };
 
   // Function to close the seat modal
   const handleCloseSeatModal = () => {
     setShowSeatModal(false);
   };

function formatDateToYYYYMMDD(dateTimeString: string) {
    const originalDate = new Date(dateTimeString);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(originalDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

   //function to handle flight selection
   const handleFlightSelection = (flight: flight) => {
    if(selectedFlight === null || selectedFlight.id === flight.id){
      setSelectedFlight(flight);
      newFlightId(flight.id);  
    }
    else 
    {
      if(passengers.length > 0){
        const confirmUpdate = window.confirm("Changing the flight will clear seats for all passengers. Do you want to continue");
        if(confirmUpdate){
          setSelectedFlight(flight);
          newFlightId(flight.id);

          // Clear seat data for every passenger
          const updatedPassengers = passengers.map((passenger) => ({
            ...passenger,
            seat: {
              seat_number: '',
              flight_class: { id: 0, name: '' },
              location: { id: 0, name: '' },
              is_available: false,
              price: '',
              seat_id: 0
            }
          }));

          //update passenger data using context function
          updatedPassengers.forEach((updatedPassenger, index: number) => {
            updatePassenger(index, updatedPassenger);
            updateSeat(index, {
              seat_number: '',
              flight_class: { id: 0, name: '' },
              location: { id: 0, name: '' },
              is_available: false,
              price: '',
              seat_id: 0
            });
          });
        }
      }else{
        setSelectedFlight(flight);
        newFlightId(flight.id);
      }
      
    }

    if(selectedFlight)
    {
      setFormData({...formData, departureDate: formatDateToYYYYMMDD(selectedFlight.departure_time), selectedFrom: {id: selectedFlight.departure_city.id, name: selectedFlight.departure_city.name,  country: selectedFlight.departure_city.country}, selectedTo: {id: selectedFlight.arrival_city.id, name: selectedFlight.arrival_city.name, country: selectedFlight.arrival_city.country} });
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
      {successMessage ? <Alert variant='success text-center'>{successMessage}</Alert> : ""}
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
                  value={formData.tripType}
                  onChange={(event) => handleTripType(event)}
                  required
                >
                  <option value="">Select Trip Type</option>
                  <option value="OneWay">One Way</option>
                  <option value="Round">Round Trip</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Departure Date:</Form.Label>
                <Form.Control
                  type="date"
                  id="departure-date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                  required
                />
              </Form.Group>

              {formData.tripType === "Round" && (
                <Form.Group>
                  <Form.Label>Return Date:</Form.Label>
                  <Form.Control
                    type="date"
                    id="return-date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
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
                    value={formData.selectedFrom.name}
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
                
                {(filteredLocations.length > 0 || formData.selectedFrom.name !== "")  && (
                  <>
                  <Form.Label>To:</Form.Label>
                    <Form.Control
                      as="select"
                      id="to"
                      value={formData.selectedTo.name}
                      onChange={(e) => handleToChange(e.target.value)}
                      required
                    >
                      <option value={formData.selectedFrom.name !== "" && filteredLocations.length === 0
                          ? formData.selectedTo.name
                          : ""}
                          >{formData.selectedTo.name === "" ? "Select Destination": formData.selectedTo.name}
                      </option>
                      {filteredLocations.map((option: location, index: number) => (
                        <option key={index} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </Form.Control>
                  </>
                )}
              </Form.Group>

              <br/>

              <div className="d-flex justify-content-center align-items-center">
               
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
                            navigate('/addpassenger1', {state: {formData, selectedFlight}});
                          }
                        }}
                        disabled={selectedFlight === null}
                        type="button"
                      >
                        Add Passenger
                      </Button>
                    </span>
                </OverlayTrigger>
                
              </div>

              <hr/>

              <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <Spinner animation='border' size='sm'/>
                  ) : (
                    "Book Now!"
                  )}                    
                </Button>
              </div>
              
              </Form>
            </Col>
            

                {/* Display error message if there's an error */}
              {errorMessage && <Alert variant="danger text-center mt-4">{errorMessage}</Alert>}

              <hr/>
          
              {passengers.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto', scrollbarWidth: 'none'}}>
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
                    {passengers.map((passenger: passenger, index: number) => (
                      <tr key={index}>
                        <td>{passenger.name}</td>
                        <td>{passenger.passport_number}</td>
                        <td>{passenger.identification_number}</td>
                        <td>{formatDate(passenger.date_of_birth)}</td>
                        <td>
                          <Button variant="primary" 
                          onClick={() => {
                          handleViewSeat(passenger);
                      }}>
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
                seatObject={selectedPassenger ? selectedPassenger.seat : {
                                                                          seat_number: '',
                                                                          flight_class: { id: 0, name: '' },
                                                                          location: { id: 0, name: '' },
                                                                          is_available: false,
                                                                          price: '',
                                                                          seat_id: 0}
                }
              />

              <hr/>

              {selectedFlight !== null ? <Alert variant='success text-center'>Flight {selectedFlight.flight_number}, {selectedFlight.airline.name} selected</Alert> : <Alert variant='warning text-center'>You haven't selected any flight</Alert>}

              {flightTableData.length > 0 ? (
                <div>
                  <p className="text-primary text-center"><b>These are The Available Flights</b></p>
                  <hr/>
                  <Row className="mt-4">
                    <Col>
                      <div className="table-responsive table-container" style={{scrollbarWidth: 'none'}}>
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
                                  className={flight_id == item.id ? "selected-row" : ""}
                                  style={{cursor: "pointer"}}
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
                                      disabled={flight_id != item.id} // Disable if not selected
                                      active={flight_id == item.id}
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
                  <Alert variant='warning'>No Flights Available</Alert>
                )}
        
        </Row>
      </Container>
    </Container>
    </div>    
  ); 
}