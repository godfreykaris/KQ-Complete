import React from "react";
import { Modal, Button } from "react-bootstrap";

interface flight_class{
  id: number;
  name: string;
}

interface location{
  id: number;
  name: string;
}

interface seat{
  _id: number;
  seat_number: number;
  flight_class: flight_class;
  location: location;
  is_available: boolean;
  price: string;
}

interface SeatProps{
  showSeatModal: boolean;
  handleCloseSeatModal: () => void;
  seatObject: seat | {seat_number: 0,
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    _id: 0 
  };
}

  const Seat: React.FC<SeatProps> = ({showSeatModal, handleCloseSeatModal, seatObject}) => {

  // //formating seat price to dollars
  // const formatPriceToDollars = (price: string) => {
  //   if (price === undefined || price === null) {
  //     return ""; // Or any default value you want to display for an empty price
  //   }

  //   // Assuming the price is stored as a string with comma as thousand separator
  //   // and using the Intl.NumberFormat API to format it as dollars
  //   const formattedPrice = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(Number(price.replace(/,/g, "")));

  //   return formattedPrice;
  // };

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
                <p><b>Availability:</b> {seatObject?.is_available}</p>
                <p><b>Price:</b> {(seatObject?.price)}</p>
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

export default Seat;