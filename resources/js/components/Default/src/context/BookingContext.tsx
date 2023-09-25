import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define TypeScript types
interface FlightClass {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface Seat {
  seat_id: number;
  seat_number: string;
  flight_class: FlightClass | { id: 0; name: '' };
  location: Location;
  is_available: boolean;
  price: string;
}

interface Passenger {
  name: string;
  passport_number: string;
  identification_number: string;
  date_of_birth: string;
  seat: Seat | {
    seat_number: string;
    flight_class: { id: 0; name: '' };
    location: { id: 0; name: '' };
    is_available: false;
    price: "";
    seat_id: 0;
  };
  index: number | null;
}

interface PassengerData {
  passengers: Passenger[];
}

interface FlightData {
  flightId: number;
  email: string;
  departureDate: string;
  selectedFrom: string;
  selectedTo: string;
}

interface BookingContextType {
  flightData: FlightData;
  updateFlightData: (newData: FlightData) => void;
  passengerData: PassengerData;
  updatePassengerData: (newData: PassengerData) => void;
  passengers: Passenger[]; 
  addPassenger: (passengerData: Passenger) => void;
  removePassenger: (index: number) => void;
  updatePassenger: (index: number, passengerData: Passenger) => void;
  flightTableData: Flight[];
  setFlightTableData: React.Dispatch<React.SetStateAction<Flight[]>>;
}

// Create BookingContext
const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBookingContext(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingContextProvider');
  }
  return context;
}

type BookingContextProviderProps = {
  children: ReactNode;
};

export function BookingContextProvider({ children }: BookingContextProviderProps) {
  const [flightData, setFlightData] = useState<FlightData>({
    flightId: 0,
    email: '',
    departureDate: '',
    selectedFrom: '',
    selectedTo: '',
  });

  const [flightTableData, setFlightTableData] = useState<Flight[]>([]);

  const [passengerData, setPassengerData] = useState<PassengerData>({
    passengers: [],
  });

  const updateFlightData = (newData: FlightData) => {
    setFlightData(newData);
  };

  const updatePassengerData = (newData: PassengerData) => {
    setPassengerData(newData);
  };

  const [passengers, setPassengers] = useState<Passenger[]>([]); // Initialize passengers state

  const addPassenger = (passengerData: Passenger) => {
    setPassengers([...passengers, passengerData]);
  };

  const removePassenger = (index: number) => {
    setPassengers((prevPassengers) => prevPassengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, passengerData: Passenger) => {
    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger, i) => (i === index ? { ...passenger, ...passengerData } : passenger))
    );
  };

  return (
    <BookingContext.Provider
      value={{
        flightData,
        updateFlightData,
        flightTableData,
        setFlightTableData,
        passengerData,
        updatePassengerData,
        passengers,
        addPassenger,
        removePassenger,
        updatePassenger,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
