import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function Seat({showSeatModal, handleCloseSeatModal, seatObject}) {

  //formating seat price to dollars
  const formatPriceToDollars = (price: string) => {
    if (price === undefined || price === null) {
      return ""; // Or any default value you want to display for an empty price
    }

    // Assuming the price is stored as a string with comma as thousand separator
    // and using the Intl.NumberFormat API to format it as dollars
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price.replace(/,/g, "")));

    return formattedPrice;
  };

  return (
    <Modal show={showSeatModal} onHide={handleCloseSeatModal}>
      <Modal.Header>
        <Modal.Title>Seat Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {seatObject ? (
            <div>
                <p><b>Seat Number:</b> {seatObject?.number}</p>
                <p><b>Seat Class</b>: {seatObject?.class}</p>
                <p><b>Seat Location:</b> {seatObject?.location}</p>
                <p><b>Availability:</b> {seatObject?.availability}</p>
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