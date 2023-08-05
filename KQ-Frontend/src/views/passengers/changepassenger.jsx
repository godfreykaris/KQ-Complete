import React, { useState } from "react";
import { Container, Form, Button, Table, Modal, Spinner } from "react-bootstrap";
import EditPassenger from "./editpassenger";
import Seat from "../seats/viewseat";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import {Col} from "react-bootstrap";

export default function ChangePassenger() {
  const [formData, setFormData] = useState({
    refNumber: "",
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
        (passenger) => passenger.refNumber === refNumber
      );

      setPassengers(filteredData);
      setLoading(false);
    } catch (error) {
      setRefError("Error fetching data");
      setLoading(false);
    }
  };

  //handling the edit button click
  const [isButtonClicked, setIsButtonClicked] = useState(true); // Set to true to show modals

  //handle the seat button click
  //states to set visibility of the modal
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [passengerSeat, setPassengerSeat] = useState(null);

  const handleSeat = (passengerSeatData) => {
    setIsButtonClicked(true);
    setPassengerSeat(passengerSeatData);
    setShowSeatModal(true);
  };


  const handleCloseSeatModal = () => {
    setShowSeatModal(false);
  };

  //the edit passenger button
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEdit = () => {
    setIsButtonClicked(true);
    setShowEditModal(true);
  };

  const handleResubmission = (editedPassenger) => {
    // Find the index of the edited passenger in the passengers array
    const editedPassengerIndex = passengers.findIndex(
      (passenger) => passenger.refNumber === formData.refNumber
    );

    if (editedPassengerIndex !== -1) {
      // Update the seat data for the edited passenger only
      const updatedPassengers = passengers.map((passenger, index) =>
        index === editedPassengerIndex
          ? {
              ...passenger,
              seat: {
                ...passenger.seat,
                seatNumber: editedPassenger.seat.number,
                class: editedPassenger.seat.class,
                location: editedPassenger.seat.location,
                availability: editedPassenger.seat.availability,
                price: editedPassenger.seat.price,
              },
            }
          : passenger
      );

      setPassengers(updatedPassengers);
    }

    // Close the modal
    setIsButtonClicked(false);
  };

  return (
    <div>
      <MenuBar1/>
      <br/>
      <br/>
      <br/>
      <MenuBar2/>
      <Container className="d-flex justify-content-center align-items-center container-md" style={{ minHeight: '100vh' }}>        
      <Container fluid>
      <h2 className="text-primary text-center">Edit Passenger Details|</h2>
        <hr/>
        <Col md={6} className="mx-auto">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Booking Reference:</Form.Label>
            <Form.Control
              type="text"
              id="refNumber"
              name="refNumber"
              maxLength="8"
              value={formData.refNumber}
              onChange={handleChange}
              required
            />
            {refError && <p className="text-danger">{refError}</p>}
          </Form.Group>
          <hr/>
          <Button type="submit" variant="primary" className="d-flex justify-content-center align-items-center">
            Retrieve Passenger
          </Button>
        </Form>
        </Col>

        <br/>
        {}

        {loading && 
          <div className="d-flex align-items-center">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ml-2">Loading...</span>
          </div>
        }

        {/* display passenger data */}
        <div style={{overflow: "auto"}}>
        {passengers.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pass. Id</th>
                <th>Passport</th>
                <th>ID No.</th>
                <th>Name</th>
                <th>Birth Date</th>
                <th>Seat</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={index}>
                  <td>{passenger.passId}</td>
                  <td>{passenger.passport}</td>
                  <td>{passenger.idNumber}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.dob}</td>
                  <td>
                    <Button onClick={() => handleSeat(passenger.seat)} variant="primary" type="button">
                      Seat
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => handleEdit(passenger)} variant="primary" type="button">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </div>
      </Container>

      {/* EditPassenger Modal */}
      
        <EditPassenger
          showEditModal={showEditModal} // Pass the correct prop
          handleResubmission={handleResubmission}
          passengerDataObject={isButtonClicked && passengers.length > 0 ? passengers[0] : null}
          handleClose={handleCloseEditModal}
        />

      {/* Seat Modal */}
      <Modal show={showSeatModal} onHide={handleCloseSeatModal}>
        <Seat
          showSeatModal={showSeatModal} // Pass the correct prop
          handleCloseSeatModal={handleCloseSeatModal}
          seatObject={passengerSeat}
        />
      </Modal>
    </Container>
    </div>
  );
}
