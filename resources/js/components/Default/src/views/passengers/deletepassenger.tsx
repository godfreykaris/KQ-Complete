import React from "react";
import { useState } from "react";
import { Container, Form, Button, Table, Spinner, Alert, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";

export default function DeletePassenger() {
  const [formData, setFormData] = useState({
    refNumber: '',
  });

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refError, setRefError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value.replace(/\D/g, "");

    // Add the "KQ-" prefix and set the error message
    if (newValue.length <= 6) {
      newValue = `KQ-${newValue}`;
      setRefError("");
    } else {
      setRefError("The input must be 6 digits or less");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetchData(formData.refNumber);

    setFormData({
      refNumber: '',
    });
  };

  const fetchData = async (refNumber) => {
    setLoading(true);
    setRefError("");

    try {
      const response = await fetch("/src/components/testdata/passengers.json");
      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      const filteredData = data.passengers.filter(
        (passenger) => {
          return passenger.refNumber === refNumber;
        }
      );

      setPassengers(filteredData);
      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
      setLoading(false);
    }
  };

  const handleDelete = (passenger) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this passenger?");
    if (shouldDelete) {
      console.log("Deleting passenger with id: ", passenger.passId);
      // Perform the deletion here
    }
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Container fluid>
      <h2 className="text-primary text-center">
        <b>Delete a Passenger|</b>
      </h2>
            <hr />
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Booking Reference:</Form.Label>
            <Form.Control
              type="text"
              id="refNumber"
              name="refNumber"
              maxLength="9"
              value={formData.refNumber}
              onChange={handleChange}
              required
            />
            {refError && <Form.Text className="text-danger">{refError}</Form.Text>}
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary">
            Retrieve Passengers
          </Button>
        </Form>
        </Col>
        <br/>

        {loading && <Spinner animation="border" variant="primary" />}

        {/* Display passenger data */}
        {passengers.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pass. Id</th>
                <th>Name</th>
                <th>Passport</th>
                <th>ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={index}>
                  <td>{passenger.passId}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.passport}</td>
                  <td>{passenger.idNumber}</td>
                  <td>
                    <Button onClick={() => handleDelete(passenger)} variant="primary">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </Container>
    </div>
  );
}
