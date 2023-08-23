import React, { useEffect, useState } from "react";
import { Form, Button, Table, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSearchFlightContext, SearchFlightContextType } from "../../context/flights/flightcontext";
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
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [locations, setLocations] = useState([]);  

  const [flightTableData, setFlightTableData] = useState<flight[] | []>([]);
  
  const [selectedFlight, setSelectedFlight] = useState<flight | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  //context variables
  const {
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
  } = useSearchFlightContext() as SearchFlightContextType;

  const navigate = useNavigate();

  // Departure locations and destinations
  useEffect(() => {
    if (departureDate !== "" && selectedFrom !== "") {
      fetchFlightsByDepartureDateAndCity();
    } else if (departureDate !== "") {
      fetchFlightsByDepartureDate();
    } else if (selectedFrom !== "") {
      fetchFlightsByCity();
    } else {
      fectchAllFlights();                       
    }
  }, [departureDate, selectedFrom]);


  //flight filters
  const fetchFlightsByCity = () => {    
    fetch(`${apiBaseUrl}/flights/byDepartureCityId/${selectedFrom}`)
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

  const fetchFlightsByDepartureDateAndCity = () => {
    fetch(`${apiBaseUrl}/flights/byDepartureDateCity/${departureDate}/${selectedFrom}`)
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
    setSelectedFrom(selectedOption);
    const filteredLocations = locations.filter(
      (location: locations) => location.name !== selectedOption
    );
    setSelectedTo("");
    setFilteredLocations(filteredLocations); // Make sure this is not mutating the original state
  };  

  const handleToChange = (selectedOption: string) => {
    setSelectedTo(selectedOption);
  };
 

   //function to handle flight selection
   const handleFlightSelection = (flight: flight) => {
    if(selectedFlight === null){
      setSelectedFlight(flight); 
      navigate('/bookflight');           
    }else {
      const confirmUpdate = window.confirm("Are you sure you want to switch flights");
      if(confirmUpdate){
        setSelectedFlight(flight);
      }
    }
    
   };

   //----------- Handle submit --------------//
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  return (
    <div>
      <MenuBar1 isAuthenticated={false} />
      <br />
      <br />
      <br />
      <MenuBar2 />

      <Container className="mt-10">
        <br />
        <h2 className="text-center text-primary mt-5">Search Flight|</h2>
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Departure Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Return Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>From:</Form.Label>
                {locations.length > 0 ? (
                  <Form.Control
                    as="select"
                    value={selectedFrom}
                    onChange={(e) => handleFromChange(e.target.value)}
                    required
                  >
                    <option value="">Select Departure Location</option>
                    {locations.map((option: locations, index: number) => (
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
                {filteredLocations.length > 0 ? (
                  <Form.Control
                    as="select"
                    value={selectedTo}
                    onChange={(e) => handleToChange(e.target.value)}
                    required
                  >
                    <option value="">Select Destination</option>
                    {filteredLocations.map((option: locations, index: number) => (
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
                              Book
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
