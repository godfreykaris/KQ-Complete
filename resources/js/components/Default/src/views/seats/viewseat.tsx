import React from "react";
import { Modal, Button } from "react-bootstrap";

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
  price: number | 0;
}

interface SeatProps{
  showSeatModal: boolean;
  handleCloseSeatModal: () => void;
  seatObject: Seat ;
}

  const PassengerSeat: React.FC<SeatProps> = ({showSeatModal, handleCloseSeatModal, seatObject}) => {

  return (
    
    <Modal show={showSeatModal} onHide={handleCloseSeatModal}>
      
      <Modal.Header>
        <Modal.Title>Seat Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {seatObject ? (
            <div>   
                       
                <p><b>Seat Number:</b> {seatObject?.seat_number}</p>
                <p><b>Seat Class</b>: {seatObject?.flight_class.name}</p>
                <p><b>Seat Location:</b> {seatObject?.location.name}</p>
                <p><b>Availability:</b> {seatObject?.is_available ? 'Available' : 'Booked'}</p>
                <p><b>Price:</b> ${(seatObject?.price)}</p>
            </div>
        ) : (
            <p>No seat Information available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseSeatModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PassengerSeat;