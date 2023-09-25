import React, { createContext, useState, useContext } from 'react';

interface flight_class{
  id: number;
  name: string;
}

interface location{
  id: number;
  name: string;
}

interface seat{
  seat_id: number;
  seat_number: number;
  flight_class: flight_class | {id: 0, name: ''};
  location: location;
  is_available: boolean;
  price: string;
}

interface passenger{  
  name: string;
  passport_number: number;
  identification_number: number;
  date_of_birth: string;
  seat: seat | {
    seat_number: 0,
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    seat_id: 0
  };
  seat_id: number
  index: number | null;
}

interface PassengerContextType {
  flight_id: number | 0;
  passengers: passenger[];
  addPassenger: (index: number, passengerData: passenger) => void;
  updatePassenger: (index: number, passengerData: passenger) => void;
  removePassenger: (index: number) => void;
  newFlightId: (flight_id: number) => void;
}

interface passengerProviderProps {
  children: React.ReactNode;
}

const PassengerContext = createContext<PassengerContextType | undefined>(undefined);

export default function PassengerProvider({ children }: passengerProviderProps) {
  const [passengers, setPassengers] = useState<passenger[]>([]);
  const [flight_id, setFlightId] = useState<number | 0>(0); // Fix the variable name here

  const addPassenger = (index: number, passengerData: passenger) => {
    const newPassenger = {
      ...passengerData,
      seat: passengerData.seat,
      seat_id: passengerData.seat_id,
      index: index,
    };
    setPassengers([...passengers, newPassenger]);
  };

  const updatePassenger = (index: number, passengerData: passenger) => {
    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger, i) => (i === index ? { ...passenger, ...passengerData } : passenger))
    );
  };

  const removePassenger = (index: number) => {
    setPassengers((prevPassengers) => prevPassengers.filter((_, i) => i !== index));
  };

  const newFlightId = (flight_id: number) => {
    setFlightId(flight_id);
  };

  return (
    <PassengerContext.Provider value={{ flight_id, passengers, addPassenger, removePassenger, updatePassenger, newFlightId }}>
      {children}
    </PassengerContext.Provider>
  );
}

export function usePassengerContext() {
  return useContext(PassengerContext);
}

export type { PassengerContextType };