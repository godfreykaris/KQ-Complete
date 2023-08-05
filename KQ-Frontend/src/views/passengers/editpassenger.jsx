
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import SeatMap from "../seats/seatmap";

export default function EditPassenger({ showEditModal, handleResubmission, passengerDataObject, handleClose }) {
  

  const [editedPassenger, setEditedPassenger] = useState({
    seat: {
      number: "",
      class: "",      
      location: "",
      availability: "",
      price: "",
    },
  });

  //for the seat map
  const [isSeatMapVisible, setIsSeatMapVisible] = useState(false);

  //toggle seatMap visibility
  const handleSeatSelection = () => {
    setIsSeatMapVisible(!isSeatMapVisible);
  };

  //state variable to store seat map data retrieved from the SeatMap
  const [selectedSeat, setSelectedSeat] = useState(null);

  // a function to handle the selected seat
  const handleSelectedSeat = (selectedSeatData) => {
    setSelectedSeat(selectedSeatData);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  //listening for any changes in seat data
  useEffect(() => {
    if(selectedSeat){
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        seat: {
          ...prevPassenger.seat,
          number:selectedSeat.number || "",
          class: selectedSeat.class || "",
          location: selectedSeat.location || "",
          availability: selectedSeat.availability || "",
          price: selectedSeat.price || "",
        },
      }));
    }
  }, [selectedSeat])

  useEffect(() => {
    if (passengerDataObject) {
      const { seat, ...restData } = passengerDataObject;
      setEditedPassenger({
        ...restData,
        seat: {
          number: seat.number || "",
          class: seat.class || "",          
          location: seat.location || "",
          availability: seat.availability || "",
          price: seat.price || "",
        },
      });
    }
  }, [passengerDataObject]);

  //handling changes in form data
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'birthDate') {
      const dateObject = value ? parseDate(value) : null;
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        dob: dateObject,
      }));
    } else if (name.startsWith("seat")) {
      //handle seat fields separately
      const seatField = name.split(".")[1]//extracting seat field e.g class, seatNumber etc
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        seat: {
          ...prevPassenger.seat,
          [seatField]: value,
        },
      }));
    } else if (name === "seat.price") {
      // remove dollar sign and non-numeric characters
      const numericPrice = parseFloat(value.replace(/[^\d.]/g, ""));
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        seat: {
          ...prevPassenger.seat,
          price: numericPrice,
        },
      }));
    }else {
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        [name]: value,
      }));
    }
  };

  //submit form after edit
  const handleSubmit = (event) => {
    event.preventDefault();
    
    handleResubmission(editedPassenger);
  };

  //formating seat price to dollars
  const formatPriceToDollars = (price) => {
    if (typeof price === 'number') {
      // Assuming the price is stored as a number, format it as dollars
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return formattedPrice;
    } else if (typeof price === 'string') {
      // Assuming the price is stored as a string with comma as thousand separator
      // and using the Intl.NumberFormat API to format it as dollars
      const numericPrice = Number(price.replace(/[^0-9.-]+/g,"")); // Remove non-numeric characters like dollar sign
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numericPrice);

      return formattedPrice;
    } else {
      return "";
    }
  };

  //change seat button
  const [isButtonClicked1, setIsButtonClicked1] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked1(true);
    handleSeatSelection();

    // Scroll to the SeatMap component
    const seatMapComponent = document.getElementById("seatMapComponent");
    if (seatMapComponent) {
      seatMapComponent.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Passenger Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center container-md" style={{ minHeight: "100vh" }}>
          <div className="container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  name="name"
                  value={editedPassenger.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passport">Passport: </label>
                <input
                  type="text"
                  id="passport"
                  className="form-control"
                  name="passport"
                  value={editedPassenger.passport || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="idNumber">ID Number: </label>
                <input
                  type="text"
                  id="idNumber"
                  className="form-control"
                  name="idNumber"
                  value={editedPassenger.idNumber || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthdate">Birth Date:</label>
                <input
                  type="date"
                  id="birthdate"
                  className="form-control"
                  name="birthDate"
                  value={editedPassenger.dob ? formatDate(editedPassenger.dob) : ''}
                  onChange={handleChange}
                  required
                />
              </div>

              
              <p><b>Seat</b></p>

              <div className="form-group">
                <label htmlFor="seatNumber">Seat Number: </label>
                <input
                  type="text"
                  id="seatNumber"
                  className="form-control"
                  name="seat.seatNumber"
                  value={editedPassenger.seat.number}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seatClass">Seat Class: </label>
                <input
                  type="text"
                  id="seatClass"
                  className="form-control"
                  name="seat.class"
                  value={editedPassenger.seat.class}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>
              

              <div className="form-group">
                <label htmlFor="seatLocation">Seat Location: </label>
                <input
                  type="text"
                  id="seatLocation"
                  className="form-control"
                  name="seat.location"
                  value={editedPassenger.seat.location}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="availability">Availability: </label>
                <input
                  type="text"
                  id="availability"
                  className="form-control"
                  name="seat.availability"
                  value={editedPassenger.seat.availability}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seatPrice">Seat Price: </label>
                <input
                  type="text"
                  id="seatPrice"
                  className="form-control"
                  name="seat.price"
                  value={formatPriceToDollars(editedPassenger.seat.price)}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div> 

              <button
                onClick={() => {handleButtonClick();
              }}
                type="button"
                className="btn btn-primary"
              >
                Change Seat
              </button>              

              <hr></hr>           

              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </Modal.Body>
      {isSeatMapVisible && (
        <div id="seatMapComponent"> {/* Add an id to the container for scrolling */}
          <SeatMap
            planeId={editedPassenger.seat.planeId} // Pass the planeId from passenger data
            handleSeatSelection={handleSeatSelection}
            handleClose={() => setIsSeatMapVisible(false)}
            onSeatSelected={handleSelectedSeat}
          />
        </div>
      )}
    </Modal>
  );
}
