import React, { useEffect, useState } from "react";
import { Form, Button, Table, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSearchFlightContext } from "../../context/flights/flightcontext";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import "./searchflight.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SearchFlight() {
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [errorAlert, setErrorAlert] = useState(false); // State to control the error alert

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
  } = useSearchFlightContext();

  const navigate = useNavigate();

  const fetchData = (departureDate, returnDate, fromLocation, toLocation) => {
    fetch("/src/components/testdata/planes.json")
      .then((response) => response.json())
      .then((data) => {
        const filterData = data.flights.filter((item) => {
          const itemDate = item.depdate.date;
          const selectedDate = departureDate.split("-").reverse().join("/");

          // Check if departureDate matches
          const depDateMatch = departureDate === "" || itemDate === selectedDate;

          // Check if returnDate matches
          const retDateMatch = returnDate === "" || item.retdate.date === returnDate;

          // Check if fromLocation matches
          const fromLocationMatch = fromLocation === "" || item.from === fromLocation;

          // Check if toLocation matches
          const toLocationMatch = toLocation === "" || item.destination === toLocation;

          return depDateMatch && retDateMatch && fromLocationMatch && toLocationMatch;
        });

        setTableData(filterData);
        setErrorAlert(filterData.length === 0); // Show the error alert if no flights are found
      })
      .catch((error) => {
        setErrorAlert(true); // Show the error alert if there's an error fetching data
      });
  };

  // Departure locations and destinations
  useEffect(() => {
    if (
      departureDate !== "" ||
      returnDate !== "" ||
      selectedFrom !== "" ||
      selectedTo !== ""
    ) {
      fetchData(departureDate, returnDate, selectedFrom, selectedTo);
    }
  }, [departureDate, returnDate, selectedFrom, selectedTo]);

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
        throw new Error("Error fetching data: " + error);
      });
  }, []);

  const handleFromChange = (selectedOption) => {
    setSelectedFrom(selectedOption);
    const filteredLocations = locations.filter((location) => location.name !== selectedOption.value);
    setSelectedTo("");
    setFilteredLocations(filteredLocations);
  };

  const handleToChange = (selectedOption) => {
    setSelectedTo(selectedOption);
  };

  // Handle submit
  const handleSubmit = () => {

    fetchData(departureDate, returnDate, selectedFrom, selectedTo);

    console.log("Dep", departureDate);

    //navigate to bookflight component with query parameters
    navigate("/bookflight", {state: {
      sfDepartureDate: departureDate,
      sfReturnDate: returnDate,
      sfSelectedFrom: selectedFrom,
      sfSelectedTo: selectedTo,
    }
  });

  };

  return (
    <div>
      <MenuBar1 />
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
        </Row>

        <hr />

        <Row className="mt-4">
          <Col>
            {errorAlert && (
              <Alert variant="danger" onClose={() => setErrorAlert(false)} dismissible>
                No flights found!
              </Alert>
            )}
            <h3 className="text-center">These are the available flights!</h3>
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
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.flightNumber}</td>
                    <td>{item.destination}</td>
                    <td>{item.airline}</td>
                    <td>{item.duration}</td>
                    <td>{item.depdate.date}</td>
                    <td>{item.retdate.date}</td>
                    <td>
                      <Button
                        onClick={() => { handleSubmit(); }}
                        variant="primary"
                        type="button"
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
      </Container>
    </div>
  );
}
