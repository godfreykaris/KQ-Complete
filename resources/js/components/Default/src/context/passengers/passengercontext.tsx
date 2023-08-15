import React, { createContext, useState, useContext } from 'react';

interface seat{
  _id: number;
  number: number;
  class: string;
  location: string;
  availability: boolean;
  price: string;
}

interface passenger{  
  name: string;
  passport: number;
  idNumber: number;
  birthDate: string;
  seat: seat | {};
}

interface PassengerContextType{
  passengers: passenger[];
  addPassenger: (passengerData: passenger) => void;
  updatePassenger: (index: number, passengerData: passenger) => void;
  removePassenger: (index: number) => void;
}

interface passengerProviderProps{
  children: React.ReactNode;
}

const PassengerContext = createContext<PassengerContextType | undefined>(undefined);

export default function PassengerProvider ({ children }: passengerProviderProps) {
  const [passengers, setPassengers] = useState<passenger[]>([]);

  const addPassenger = (passengerData: passenger) => {
    const newPassenger = {
        ...passengerData,
        index: passengers.length,
    };    
    setPassengers([...passengers, newPassenger]);    
  };

  const updatePassenger = (index: number, passengerData: passenger) => {
    setPassengers((prevPassengers) => 
        prevPassengers.map((passenger, i) => (i === index ? {...passenger, ...passengerData} : passenger))
    )
  }

  const removePassenger = (index: number) => {
    setPassengers((prevPassengers) => prevPassengers.filter((_, i) => i !== index))
  };

  return (
    <PassengerContext.Provider value={{ passengers, addPassenger, removePassenger, updatePassenger }}>
      {children}
    </PassengerContext.Provider>
  );
};

export function usePassengerContext(): PassengerContextType {

    const context = useContext(PassengerContext);

    if (!context) 
    {
        throw new Error("usePassengerContext must be used within a PassengerProvider");
    }

    return  context;
}

export type {PassengerContextType};
