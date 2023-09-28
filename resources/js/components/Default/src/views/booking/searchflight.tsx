import React, { useEffect, useState } from "react";
import { Form, Button, Table, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useBookingContext, BookingContextType } from "../../context/booking/bookflightcontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";

import apiBaseUrl from "../../../../../config";

import "./searchflight.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

export default function SearchFlight() {
  const [filteredLocations, setFilteredLocations] = useState<locations[]>([]);
  const [locations, setLocations] = useState<locations[]>([]);  

  const [errorMessage, setErrorMessage] = useState("");
  const [flightSelectMessage, setFlightSelectMessage] = useState("");

  const {formData, setFormData, flightTableData, setFlightTableData, selectedFlight, setSelectedFlight} = useBookingContext() as BookingContextType;  

  const navigate = useNavigate();

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
    } else if (formData.departureDate !== "") {
      fetchFlightsByDepartureDate();
    } else if (formData.selectedFrom.name !== "") {
      fetchFlightsByCity();
    } else {
      fectchAllFlights();                       
    }
  }, [formData.departureDate, formData.selectedFrom.name]);


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
 

   //function to handle flight selection
   const handleFlightSelection = (flight: flight) => {    
    if(selectedFlight === null){
      setSelectedFlight(flight);
      setFlightSelectMessage("Flight selected, Click Book Now to book the flight")                 
    }else {
      const confirmUpdate = window.confirm("Are you sure you want to switch flights");
      if(confirmUpdate){
        setSelectedFlight(flight);
      }
    }
    
    if(selectedFlight)
    {
      setFormData({...formData, departureDate: formatDateToYYYYMMDD(selectedFlight.departure_time), selectedFrom: {id: selectedFlight.departure_city.id, name: selectedFlight.departure_city.name,  country: selectedFlight.departure_city.country}, selectedTo: {id: selectedFlight.arrival_city.id, name: selectedFlight.arrival_city.name, country: selectedFlight.arrival_city.country} });
    }
   };

   //----------- Handle submit --------------//
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate('/bookflight', {state: { formData, selectedFlight}});
  };

  return (
    <div>
      <MenuBar1 isAuthenticated={false} />
      <br/>
      <br/>
      <br/>
      <MenuBar2 />

      <Container className="mt-10">
        <br />
        <h2 className="text-center text-primary mt-5">Search Flight|</h2>
        {errorMessage ? <Alert variant='danger text-center mt-4'>{errorMessage}</Alert> : ""}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Departure Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Return Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>From:</Form.Label>
                {locations.length > 0 ? (
                  <Form.Control
                    as="select"
                    value={formData.selectedFrom.name}
                    onChange={(e) => handleFromChange(e.target.value)}
                    required
                  >
                    <option value="">Select Departure Location</option>
                    {locations.map((option: locations, index: number) => (
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
                {(filteredLocations.length > 0) && (
                  <><Form.Label>To:</Form.Label><Form.Control
                    as="select"
                    value={formData.selectedTo.name}
                    onChange={(e) => handleToChange(e.target.value)}
                    required
                  >
                    <option value="">Select Destination</option>
                    {filteredLocations.map((option: locations, index: number) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Control></>
                )}
              </Form.Group>

              {selectedFlight !== null ?
                <div className='d-flex justify-content-center mt-4'>
                  <Button type="submit" variant="primary">
                    Book Now                   
                  </Button>
                </div>
              : <></>
              }

            </Form>
          </Col>
        </Row>

        <hr />

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
          </div>
          ) : (
            <Alert variant='warning'>No Flights Available</Alert>
          )}

      </Container>
    </div>
  );
}
