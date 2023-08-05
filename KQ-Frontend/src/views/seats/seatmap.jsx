import React, { useEffect, useState } from "react";
import { Container, Button, Alert, Spinner, Table } from 'react-bootstrap';

export default function SeatMap({planeId, onSeatSelected}) {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [error, setError] = useState(null);

  //to store message of whether seat was successfully selected or not
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/components/testdata/seatdata.json'); //addplane id like this /${planeId}`
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setAvailableSeats(data.seats);
      } catch (error) {
        setError("Error fetching data: " + error.message);
      }
    };

    fetchData();
  }, [planeId]);

  const handleSubmit = (index) => {
    const selectedSeat = availableSeats[index];    
    onSeatSelected(selectedSeat);
    setMessage("Seat selected successfully!");
  };

  return (
    <Container className="mt-4">
      {message && <Alert variant="success">{message}</Alert>}
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : availableSeats.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Seat Number</th>
              <th>Seat Location</th>
              <th>Availability</th>
              <th>Seat Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableSeats.map((availableSeat, index) => (
              <tr key={index}>
                <td>{availableSeat.number}</td>
                <td>{availableSeat.location}</td>
                <td>{availableSeat.availability}</td>
                <td>{availableSeat.price}</td>
                <td>
                  <Button
                    onClick={() => handleSubmit(index)}
                    variant="primary"
                    type="button"
                    disabled={availableSeat.availability === "BOOKED"}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="d-flex align-items-center">
          <Spinner animation="border" variant="primary" size="sm" />
          <span className="text-primary ml-2">Loading seats...</span>
        </div>
      )}
    </Container>
  );
}
