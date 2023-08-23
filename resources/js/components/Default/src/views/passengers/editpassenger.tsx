
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Modal, Button, Alert, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../../../Common/LoadingComponent";
import apiBaseUrl from "../../../../../config";

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
  price: 0;
}

interface Passenger {
  id: number;
  passenger_id: string;
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat: Seat;
}

interface EditPassengerProps {
  showEditModal: boolean; // Specify the type explicitly as boolean
  handleResubmission: (editedPassenger: Passenger) => void;
  passengerDataObject: Passenger | undefined;
  flightId: string;
  handleClose: () => void;
}

export default function EditPassenger({ showEditModal, handleResubmission, passengerDataObject, handleClose, flightId }: EditPassengerProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('');
  const [displaySeatTable, setDisplaySeatTable] = useState<boolean>(false);

  const [refError, setRefError] = useState<string>('');
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  
  const [editedPassenger, setEditedPassenger] = useState<Passenger>(passengerDataObject ?? {
    id: 0, // You may need to provide default values for other properties
    passenger_id: '',
    name: '',
    passport_number: '',
    identification_number: '',
    date_of_birth: '',
    seat: {
      id: 0,
      seat_number: '',
      flight_class: {
        id: 0,
        name: '',
      },
      location: {
        id: 0,
        name: '',
      },
      is_available: false,
      price: 0,
    },
  });


  //for the seat map
  const [isSeatMapVisible, setIsSeatMapVisible] = useState(false);

  //state variable to store seat map data retrieved from the SeatMap
  const [selectedSeat, setSelectedSeat] = useState<Seat>();
  const [seats, setSeats] = useState<Seat[]>([]);



  const showSeatsTable = () => {
    setDisplaySeatTable(true);
    tableContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  //seat selection from the table
  const handleSeatSelection = (index: number) => {
    const selectedSeat = seats[index];

    const selectedSeatObject: Seat = {
      id: selectedSeat.id,
      seat_number: selectedSeat.seat_number,
      flight_class: selectedSeat.flight_class,
      location: selectedSeat.location,
      is_available: selectedSeat.is_available,
      price: selectedSeat.price,
    };

    setSelectedSeat(selectedSeatObject);

    setSelectedSeatNumber(seats[index].seat_number.toString());
  
    setDisplaySeatTable(false); // Hide the seat selection table after seat selection
  };

  
  const parseDate = (dateString: string) => {
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
          seat_number:selectedSeat.seat_number || "",
          flight_class: selectedSeat.flight_class || "",
          location: selectedSeat.location || "",
          is_available: selectedSeat.is_available || false,
          price: selectedSeat.price || 0,
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
          id: seat.id || 0,
          seat_number: seat.seat_number || "",
          flight_class: seat.flight_class || "",          
          location: seat.location || "",
          is_available: seat.is_available || false,
          price: seat.price || 0,
        },
      });
    }
  }, [passengerDataObject]);

  useEffect(() => {
    if(flightId)
        fetchSeats(flightId);
}, [flightId]);

const fetchSeats = async (flightId: string) => {
  setIsLoading(true);

  try 
  {
    const response = await fetch(`${apiBaseUrl}/seats/flight/${flightId}`);
    const data = await response.json();
    setSeats(data.seats);
    setIsLoading(false);

  }
  catch (error) 
  {
    console.error('Error fetching data:', error);
    setIsLoading(false);
  }
};

const getResponseClass = () => {
  if (responseStatus === 1) 
  {
    return 'text-success'; // Green color for success
  } 
  else if (responseStatus === 0) 
  {
    return 'text-danger'; // Red color for error
  } 
  else 
  {
    return ''; // No specific styles (default)
  }
};

  //handling changes in form data
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'birthDate') {
      const dateObject = value ?  parseDate(value) : '';
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        date_of_birth: dateObject,
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
    } else {
      setEditedPassenger((prevPassenger) => ({
        ...prevPassenger,
        [name]: value,
      }));
    }
  };

  //submit form after edit
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleResubmission(editedPassenger);
  };

  //formating seat price to dollars
  const formatPriceToDollars = (price: number) => {
    // Assuming the price is stored as a number, format it as dollars
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

    return formattedPrice;
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
                <label htmlFor="passport_number">Passport: </label>
                <input
                  type="text"
                  id="passport_number"
                  className="form-control"
                  name="passport_number"
                  value={editedPassenger.passport_number}
                  onChange={handleChange}
                  max = {10}
                  min ={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="identification_number">ID Number: </label>
                <input
                  type="text"
                  id="identification_number"
                  className="form-control"
                  name="identification_number"
                  value={editedPassenger.identification_number || ''}
                  onChange={handleChange}
                  max = {10}
                  min = {4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">Birth Date:</label>
                <input
                  type="date"
                  id="birthDate"
                  className="form-control"
                  name="birthDate"
                  value={editedPassenger.date_of_birth}
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
                  value={editedPassenger.seat.seat_number}
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
                  value={editedPassenger.seat.flight_class.name}
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
                  value={editedPassenger.seat.location.name}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="is_available">Availability: </label>
                <input
                  type="text"
                  id="is_available"
                  className="form-control"
                  name="seat.is_available"
                  value={editedPassenger.seat.is_available ? "Booked" : "Available"}
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

            <div className="text-center">
              <button
                  onClick={() => {showSeatsTable() ;
                }}
                  type="button"
                  className="btn btn-primary mt-3"
                >
                  Change Seat
                </button>              


                <hr></hr>           

                <Button type="submit">Submit</Button>
              </div>
              
            </form>
          </div>
        </div>
      </Modal.Body>
      {/*       Show the success alert when a seat is selected */}

      {selectedSeatNumber && (
        <Alert variant="success" className="text-center" style={{ marginTop: '30px', marginBottom: '10px'}}>
          Seat {selectedSeatNumber} has been selected successfully!
        </Alert>
      )}
  
      {/* Display seat selection table when Select Seat button is clicked */}
      {(displaySeatTable && isLoading) ?
      (
        /**Show loading */
        <LoadingComponent />
      ): (((seats.length == 0  && selectedSeatNumber == '') || (seats.length > 0  && selectedSeatNumber == '')) && !displaySeatTable) ? (
        <Alert variant="error" className="text-center" style={{ marginTop: '90px', marginBottom: '10px'}}>
          Select a seat for the passenger!
        </Alert>
      ): displaySeatTable && (
        <Container ref={tableContainerRef} className="d-flex justify-content-center align-items-center" style={{ marginTop: '10px', position: 'relative' }}>
          {refError ? (
            <Alert variant="danger">{refError}</Alert>
          ) : (
            <Table  striped bordered hover>
              <thead>
                <tr>
                  <th>Seat Number</th>
                  <th>Seat Location</th>
                  <th>Availability</th>
                  <th>Seat Price</th>
                  <th>Flight Class</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((availableSeat: Seat, index: number) => (
                    <tr key={index}>
                      <td>{availableSeat.seat_number}</td>
                      <td>{availableSeat.location.name}</td>
                      <td>{!availableSeat.is_available ? 'Booked' : 'Available'}</td>
                      <td>{availableSeat.price}</td>
                      <td>{availableSeat.flight_class.name}</td>
                      <td>
                      <Button
                        onClick={() => handleSeatSelection(index)}
                        variant="primary"
                        type="button"
                        disabled={!availableSeat.is_available}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>        
          )}
        </Container>
      )}
    </Modal>
  );
}
