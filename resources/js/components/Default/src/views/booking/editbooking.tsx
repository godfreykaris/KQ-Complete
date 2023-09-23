import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import apiBaseUrl from "../../../../../config";

import { useEditBookingContext } from "../../context/booking/editbookingcontext";

interface Location {
  name: string;
}

interface Booking {
  bookingReference: string;
  email: string;
  flight_id: number;
  departure_date: string;
  from: Location;
  to: Location;
}

interface EditBookingProps {
  showEditModal: boolean;
  handleResubmission?: (editedBooking: Booking) => void;
  bookingDataObject?: Booking;
  handleClose?: () => void;
}

export default function EditBooking({
  showEditModal,
  handleResubmission,
  bookingDataObject,
  handleClose,
}: EditBookingProps) {
  // const [editedBooking, setEditedBooking] = useState<Booking>({
  //   bookingReference: "",
  //   email: "",
  //   flight_id: 0,
  //   departure_date: "",
  //   from: { name: "" },
  //   to: { name: "" },
  // });

  const {editedBooking, setEditedBooking} = useEditBookingContext();

  // from and to locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<string>(editedBooking.from.name);
  const [selectedTo, setSelectedTo] = useState<string>(editedBooking.to.name);

  const [emailError, setEmailError] = useState<string>("");

  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  // Update the state when bookingDataObject prop changes
  useEffect(() => {
    if(bookingDataObject)
      setEditedBooking(bookingDataObject);
  }, [bookingDataObject]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "email") {
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
    } else {
      setEditedBooking((prevBooking) => ({
        ...prevBooking,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/cities`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(data.cities);
        setSelectedFrom(data.cities[0]?.name || "");
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleFromChange = (selectedOption: string) => {
    setSelectedFrom(selectedOption);
    const filteredLocations = locations.filter(
      (location) => location.name !== selectedOption
    );
    setSelectedTo("");
    setFilteredLocations(filteredLocations);
  };

  const handleToChange = (selectedOption: string) => {
    setSelectedTo(selectedOption);
  };

  // handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(handleResubmission)
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
                  value={editedBooking.email}
                  onChange={handleChange}
                  required
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="departure-date">Departure Date: </label>
                <input
                  type="date"
                  id="departure-date"
                  className="form-control"
                  name="departure_date"
                  value={editedBooking.departure_date}
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
                    onChange={(e) => handleFromChange(e.target.value)}
                    required
                  >
                    <option value="">Select Departure Location</option>
                    {locations.map((option: Location, index: number) => (
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
                <select
                  id="to"
                  className="form-control"
                  value={selectedTo}
                  onChange={(e) => handleToChange(e.target.value)}
                  required
                >
                  <option value="">Select Destinations</option>
                  {filteredLocations.map((option: Location, index: number) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <br />

              <div className="d-flex justify-content-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
