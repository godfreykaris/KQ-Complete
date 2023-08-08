import React, { createContext, useState, useContext } from 'react';

const PassengerContext = createContext();

export default function PassengerProvider ({ children }) {
  const [passengers, setPassengers] = useState([]);

  const addPassenger = (passengerData) => {
    const newPassenger = {
        ...passengerData,
        index: passengers.length,
    };    
    setPassengers([...passengers, newPassenger]);    
  };

  const updatePassenger = (index, passengerData) => {
    setPassengers((prevPassengers) => 
        prevPassengers.map((passenger, i) => (i === index ? {...passenger, ...passengerData} : passenger))
    )
  }

  const removePassenger = (index) => {
    setPassengers((prevPassengers) => prevPassengers.filter((_, i) => i !== index))
  };

  return (
    <PassengerContext.Provider value={{ passengers, addPassenger, removePassenger, updatePassenger }}>
      {children}
    </PassengerContext.Provider>
  );
};

export function usePassengerContext() {

    return  useContext(PassengerContext);
}
