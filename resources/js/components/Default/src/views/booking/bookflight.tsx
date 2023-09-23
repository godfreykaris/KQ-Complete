import './bookflight.css';
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Spinner, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";

import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";

import PassengerSeat from "../seats/viewseat.js";
import { useSeatContext, SeatContextType } from "../../context/seats/sendseatdata";
import { BookingContextType, useBookingContext } from '../../context/booking/bookflightcontext';
import Seat from "../seats/viewseat.js";

import apiBaseUrl from '../../../../../config';

import LoadingComponent from '../../../../Common/LoadingComponent';


interface FlightClass{
  id: number;
  name: string;
}

interface Location{
  id: number;
  name: string;
}

interface Seat{
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

interface Status{
  id: number;
  name: string;
}

interface Airline{
  id: number;
  name: string;
}

interface City
{
  name: string;
  country: string;
  id: number;
}

interface Flight{
  id: number;
  flight_status: Status;
  flight_number: number;
  departure_city: City;
  arrival_city: City;
  airline: Airline;
  duration: string;
  departure_time:  string;
}

const FlightState = {
  sfFlightId: 0,
  sfEmail: '',
  sfDepartureDate: '',
  sfSelectedFrom: '',
  sfSelectedTo: '',
};

interface FlightData {
  flightId: number;
  email: string;
  departureDate: string;
  selectedFrom: string;
  selectedTo: string;
}

export default function BookFlight() {

  const [isLoading, setIsLoading] = useState(false);

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const {updateSeat} = useSeatContext() as SeatContextType;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // State to manage the seat modal
  const [showSeatModal, setShowSeatModal] = useState(false);
  
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const [isAddPassengerClicked, setIsAddPassengerClicked] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | undefined>(undefined);

  const navigate = useNavigate();


  //to remove passenger when delete button is clicked
  const handleDeletePassenger = (index: number) => {
    removePassenger(index);
  };

  //to edit passenger when the edit button is clicked
  const handleEditPassenger = (passenger: Passenger, index: number) => {   
    navigate('/addpassenger1', {state: {passenger, index}});
  };  

  // Format date imported from AddPassenger1
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };  

  const handleUpdateFlightData = () => {
    updateFlightData(formData);
  };

// Handle change
 const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  const { name, value } = event.target;

  if (name === "email") 
  {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (emailRegex.test(value))
    {
      setEmailError("");
      handleUpdateFlightData();
    } 
    else 
    {
      setEmailError("Invalid email format");
    }
  } 
  else if(name === "departureDate")
  {
    setFormData((prevFormData) => ({
      ...prevFormData,
      departureDate: value,
    }));

    handleUpdateFlightData();
  }
  else if(name === "selectedFrom")
  {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedFrom: value,
    }));

    handleUpdateFlightData();

    const filteredCities = cities.filter(
      (city: City) => city.id !== Number(selectedFrom)
    );
    setSelectedTo("");
    setFilteredCities(filteredCities);
  }
  else if(name === "selectedTo")
  {
    if(formData.selectedFrom === value)
    {
      alert("From and To cannot be the same");
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTo: value,
    }));

    handleUpdateFlightData();
  }
};



  // Handle Add passenger click
  const handleAddPassengerClick = () => {
    setIsAddPassengerClicked(false);
    handleUpdateFlightData();
  };

  //addpassenger message befor selecting flight
  const renderTooltip = (message: string) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

  // Reusable function to fetch flights
  const fetchFlights = (url: string) => {
    setIsLoading(true);
    return fetch(url)
      .then((response) => {
        if (!response.ok) 
        {
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

  //cities
  useEffect(() => {
    fetch(`${apiBaseUrl}/cities`)
      .then((response) => {
        if (!response.ok) 
        {          
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

  const handleFromChange = (selectedOption: string) => {
    setSelectedFrom(selectedOption);
    const filteredCities = cities.filter(
      (city: City) => city.name !== selectedOption
    );
    setSelectedTo("");
    setFilteredCities(filteredCities);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedFrom: selectedOption,
    }));

    handleUpdateFlightData();
  };

  const handleToChange = (selectedOption: string) => {
    setSelectedTo(selectedOption);

    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTo: selectedOption,
    }));

    handleUpdateFlightData();
  };

  // Function to open the seat modal
  const handleViewSeat = (passenger: Passenger) => {
    setShowSeatModal(true);
    setSelectedPassenger(passenger);
  };

  // Function to close the seat modal
  const handleCloseSeatModal = () => {
    setShowSeatModal(false);
  };

  //to handle flight selection
   const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

   //function to handle flight selection
   const handleFlightSelection = (flight: Flight) => {
    if(selectedFlight === null)
    {
      setSelectedFlight(flight);

      setFormData((prevFormData) => ({
        ...prevFormData,
          flightId: flight.id,
      }));

      handleUpdateFlightData();

    }
    else 
    {
      const confirmUpdate = window.confirm("Changing the flight will clear seats for all passengers. Do you want to continue");
      if(confirmUpdate){
        setSelectedFlight(flight);

        setFormData((prevFormData) => ({
          ...prevFormData,
            flightId: flight.id,
        }));
  
        handleUpdateFlightData();

        // Clear seat data for every passenger
        const updatedPassengers = passengers.map((passenger) => ({
          ...passenger,
          seat: {
            seat_number: '',
            flight_class: { id: 0, name: '' },
            location: { id: 0, name: '' },
            is_available: false,
            price: 0,
            id: 0
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
            price: 0,
            id: 0
          });
        });
      }
    }
    
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
      
      const selectedProperties = passengers.map((passenger) => ({
        name: passenger.name,
        passport_number: passenger.passport_number,
        identification_number: passenger.identification_number,
        date_of_birth: passenger.date_of_birth,
        seat_id: passenger.seat.id,
      }));

      //data to be sent
      const sendData = {
        flight_id: flightData.flightId,
        email: formData.email,        
<<<<<<< HEAD
        passengers: selectedProperties,
      }  
      
=======
        passengers: passengers,
      }
>>>>>>> origin/main
  
      setIsLoading(true);
  
      //perform POST reuest
      const response = await fetch(`${apiBaseUrl}/bookings/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sendData),
      }).then(response => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then(data => {
        // Check if the response contains a 'redirect' property
        if (data.redirect) 
        {
          window.location.href = data.redirect; // Redirect to the provided URL
        } 
        else 
        {
          if (data.status) 
            {
              setResponseStatus(1); // Success
              setResponseMessage(`Success: ${data.success}.`);
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            } 
            else 
            {
              setResponseStatus(0); // Error
              setResponseMessage(`Error: ${data.error}`);
            }
        }
      })
      .catch(error => console.error(error));
  
      
        setIsLoading(false);
    }catch (error){
      setErrorMessage("An error occured while booking the flight");

      setIsLoading(false);
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
                <Form.Label>Departure Date:</Form.Label>
                <Form.Control
                  type="date"
                  id="departure-date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              
              <Form.Group>
                <Form.Label>From:</Form.Label>
                {cities.length > 0 ? (
                  <Form.Control
                    as="select"
                    id="from"
                    name="selectedFrom"
                    value={formData.selectedFrom}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Departure Location</option>
                    {cities.map((option: City, index: number) => (
                      <option key={index} value={option.id}>
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
                {(cities.length > 0 && !isLoading) ? (
                  <Form.Control
                    as="select"
                    id="to"
                    name="selectedTo"
                    value={formData.selectedTo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Destination</option>
                    {cities.map((option: City, index: number) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <LoadingComponent />
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
                            navigate('/addpassenger1');
                          }
                        }}
                        disabled={formData.flightId === 0}
                        type="button"
                      >
                        Add Passenger
                      </Button>
                    </span>
                </OverlayTrigger>
                
              </div>

              <hr/>


              <div className='text-center'>
                <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

                <Button type="submit" variant="primary" className="mb-3">
                  Book Now                   
                </Button>
              </div>
              
              </Form>
            </Col> 

                {/* Display error message if there's an error */}
              {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

              <hr/>
          
              {(passengers.length > 0) ? (
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
                    {passengers.map((passenger: Passenger, index: number) => (
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
                <p className="text-danger text-center mt-2"><b>You haven't added any passengers yet</b></p>
              )}


              {/* Render the Seat component */}
              <PassengerSeat
                showSeatModal={showSeatModal}
                handleCloseSeatModal={handleCloseSeatModal}
                seatObject={selectedPassenger ? selectedPassenger.seat : {
                                                                          seat_number: '',
                                                                          flight_class: { id: 0, name: '' },
                                                                          location: { id: 0, name: '' },
                                                                          is_available: false,
                                                                          price: 0,
                                                                          id: 0}
                }
              />

              <hr/>

              {(flightTableData.length > 0 && !isLoading) ? (
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
                                className={selectedFlight === item ? "selected-row" : ""}
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
                      {isLoading && <LoadingComponent/>}
                      <Alert variant='warning' className="mt-2">No Flights Available</Alert>
                      
                  </div>
                )}
        
        </Row>
      </Container>
    </Container>
    </div>    
  ); 

};