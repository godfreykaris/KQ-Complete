import './bookflight.css';
import "bootstrap/dist/css/bootstrap.min.css";

import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Spinner, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";

import { usePassengerContext, PassengerContextType } from "../../context/passengers/passengercontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import { useSeatContext, SeatContextType } from "../../context/seats/sendseatdata";
import { BookingContextType, useBookingContext } from '../../context/booking/bookflightcontext';
import Seat from "../seats/viewseat.js";

import apiBaseUrl from '../../../../../config';
import LoadingComponent from '../../../../Common/LoadingComponent';
import { useEditBookingContext } from '../../context/booking/editbookingcontext';



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
  departure_city: location;
  arrival_city: location;
  airline: airline;
  duration: string;
  departure_time:  string;
  return_time: string;
}

interface location{
  name: string;
  country: string;
  id: number;
}

export default function BookFlight() { 
  
  const [locations, setLocations] = useState<location[]>([]); 
  const [filteredLocations, setFilteredLocations] = useState<location[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
 
  // State to manage the seat modal
  const [showSeatModal, setShowSeatModal] = useState(false);

  //data from the search flight component
  const location = useLocation();
  const {state} = location;

  // Access the "passengers" array from the context using the usePassengerContext hook
  const {flight_id, setFlightId, passengers, setPassengers, removePassenger, updatePassenger, newFlightId} = usePassengerContext() as PassengerContextType;

  //to store values
  const {formData, setFormData, flightTableData, setFlightTableData, selectedFlight, setSelectedFlight} = useBookingContext() as BookingContextType;
  const {bookingReference, setBookingReference, ticketNumber, setTicketNumber,isBookingValid, setIsBookingValid} = useEditBookingContext();


  const navigate2 = useNavigate();

  // Handle plane row select
  const [isFetchingFlights, setIsFetchingFlights] = useState(false);
 
  // Handle change
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };  

  const handleTripType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tripType: value
    }))
    //setTripType(e.target.value);
  };

 
  //addpassenger message befor selecting flight
  const renderTooltip = (message: string) => (
    <Tooltip id='tooltip'>{message}</Tooltip>
  )

// Departure locations and destinations
useEffect(() => {
  if(selectedFlight)
  {
    setFormData({...formData, departureDate: formatDateToYYYYMMDD(selectedFlight.departure_time), returnDate: formatDateToYYYYMMDD(selectedFlight.return_time), selectedFrom: {id: selectedFlight.departure_city.id, name: selectedFlight.departure_city.name,  country: selectedFlight.departure_city.country}, selectedTo: {id: selectedFlight.arrival_city.id, name: selectedFlight.arrival_city.name, country: selectedFlight.arrival_city.country} });
  }
}, [selectedFlight]);

  function formatDateToYYYYMMDD(dateTimeString: string) {
    const originalDate = new Date(dateTimeString);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(originalDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
    setIsFetchingFlights(true);
    fetch(`${apiBaseUrl}/flights/byDepartureCityId/${formData.selectedFrom.id}`)
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      })
      .finally(() => {
        setIsFetchingFlights(false)
      })
      ;
  };

  const fetchFlightsByDepartureDate = () => {
    setIsFetchingFlights(true);
    fetch(`${apiBaseUrl}/flights/byDepartureDate/${formData.departureDate}`)    
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      })
      .finally(() => {
        setIsFetchingFlights(false)
      })
      ;
  };

  const fetchFlightsByDepartureDateAndCity = () => {
    setIsFetchingFlights(true);
    fetch(`${apiBaseUrl}/flights/byDepartureDateCity/${formData.departureDate}/${formData.selectedFrom.id}`)
      .then((response) => response.json())
      .then((data: { flights: flight[] }) => {
        setFlightTableData(data.flights);
        }) 
     
      .catch((error: any) => {
        setErrorMessage("An error occurred");
        console.log("Error fetching data: ", error);
      })
      .finally(() => {
        setIsFetchingFlights(false)
      })
      ;
  };

  const fectchAllFlights = () => {
    setIsFetchingFlights(true);
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
      })
      .finally(() => {
        setIsFetchingFlights(false)
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
      (location: location) => location.name !== selectedOption
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

    navigate2('/bookflight', {state: {selectedFlight, formData}});
    
  };


   //function to handle flight selection
   const handleFlightSelection = (flight: flight) => {
    
    setSelectedFlight(flight);
    newFlightId(flight.id);

    setFlightId(flight.id)
    if(selectedFlight)
      {
        setFormData({...formData, departureDate: formatDateToYYYYMMDD(selectedFlight.departure_time), returnDate: formatDateToYYYYMMDD(selectedFlight.return_time), selectedFrom: {id: selectedFlight.departure_city.id, name: selectedFlight.departure_city.name,  country: selectedFlight.departure_city.country}, selectedTo: {id: selectedFlight.arrival_city.id, name: selectedFlight.arrival_city.name, country: selectedFlight.arrival_city.country} });
      }

   };

   //maintaining form state during navigation


   return (
    <div>
      <MenuBar1 isAuthenticated={false}/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center mt-3" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Row>
        <h2 className="text-primary text-center"><b>Search Flight|</b></h2>
          <Col md={6} className="mx-auto">
            <Form onSubmit={handleSubmit}>

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

              <Form.Group>
                <Form.Label>From:</Form.Label>
                {locations.length > 0 || formData.selectedFrom.name !== ""? (
                  <Form.Control
                    as="select"
                    id="from"
                    value={formData.selectedFrom.name}
                    onChange={(e) => handleFromChange(e.target.value)}
                    required
                  >
                    <option value={formData.selectedFrom.name !== "" && filteredLocations.length === 0
                        ? formData.selectedFrom.name
                        : ""}
                        >{formData.selectedFrom.name === "" ? "Select Departure Location": formData.selectedFrom.name}
                    </option>
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
                {filteredLocations.length > 0 || formData.selectedFrom.name !== "" ? (
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
                ) : (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ml-2">Loading Destinations...</span>
                  </div>
                )}
                </>
                )}
              </Form.Group>

              <br/>

              
              <div className='d-flex justify-content-center mb-2'>                
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
              {errorMessage && <Alert variant="danger" className="text-center mt-2">{errorMessage}</Alert>}

              <hr/>
        
              {selectedFlight !== null ? <Alert variant='success text-center'>Flight {selectedFlight.flight_number}, {selectedFlight.airline.name} selected</Alert> : <Alert variant='warning text-center'>You haven't selected any flight</Alert>}

              {flightTableData && flightTableData.length > 0 ? (
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
                  <>
                    {isFetchingFlights ? (
                      <LoadingComponent/>
                    ): (
                        <Alert variant='warning'>No Flights Available</Alert>
                    )}
                  </>
                )}
                
        </Row>
      </Container>
    </Container>
    </div>    
  ); 
}