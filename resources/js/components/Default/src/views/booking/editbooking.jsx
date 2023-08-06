import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

export default function EditBooking({ showEditModal, handleResubmission, bookingDataObject, handleClose }) {
  const [editedBooking, setEditedBooking] = useState({}); // Use the correct state variable name
  const [emailError, setEmailError] = useState("");

  //date formatting
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };


   // Update the state when bookingDataObject prop changes
   useEffect(() => {
    setEditedBooking(bookingDataObject || {});
  }, [bookingDataObject]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'departure') {
      const dateObject = value ? parseDate(value) : null;
      setEditedBooking((prevBooking) => ({
        ...prevBooking,
        departure: dateObject,
      }));
    } else if(name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEditedBooking((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      if (emailRegex.test(value)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email format");
      }
    }else{
      setEditedBooking((prevBooking) => ({
        ...prevBooking,
        [name]: value,
      }));
    }
        
  };

  //from and to locations
  const [locations, setLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  useEffect(() => {
    fetch("/src/components/destinations.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(data.locations);
        if (bookingDataObject) {
          setSelectedFrom(bookingDataObject.from || data.locations[0].name);
        } else if (data.locations.length > 0) {
          setSelectedFrom(data.locations[0].name);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [bookingDataObject]);

  const handleFromChange = (selectedOption) => {
    setSelectedFrom(selectedOption.value);
    const filteredLocations = locations.filter(
      (location) => location.name !== selectedOption.value
    );
    setSelectedTo("");
    setFilteredLocations(filteredLocations);
  };

  

  const handleToChange = (selectedOption) => {
    setSelectedTo(selectedOption.value);
  };

  const [filteredLocations, setFilteredLocations] = useState([]); 

  //handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    handleResubmission(editedBooking);
  };

  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Booking Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center container-md" style={{ minHeight: "100vh" }}>
          <div className="container-fluid">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  id="email"
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                  name="email"
                  value={editedBooking.email || ""}
                  onChange={handleChange}
                  required
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="tripType">Trip Type: </label>
                <select
                  id="tripType"
                  className="form-control"
                  defaultValue={editedBooking.email || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="OneWay">One Way</option>
                  <option value="Round">Round Trip</option>
                  <option value="MultiCity">Multi-city</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="departure">Departure Date: </label>
                <input
                  type="date"
                  id="departure"
                  className="form-control"
                  name="departure"
                  value={editedBooking.departure ? formatDate(editedBooking.departure) : ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="from">From:</label>
                {locations.length > 0 ? (
                  <select
                    id="from"
                    className="form-control"
                    value={selectedFrom}
                    onChange={handleFromChange}
                    required
                  >
                    {locations.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ml-2">Loading Departures...</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="to">To:</label>
                {filteredLocations.length > 0 ? (
                  <select
                    id="to"
                    className="form-control"
                    value={selectedTo}
                    defaultValue={editedBooking.to || ''}                    
                    onChange={handleToChange}
                    required
                  >
                    {filteredLocations.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ml-2">Loading Destinations...</span>
                  </div>
                )}
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
