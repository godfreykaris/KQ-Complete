import React, {createContext, useState, useContext} from "react";

const SeatContext = createContext();

export default function SeatProvider({children}) {
    const [seat, setSeat] = useState({});

    const updateSeat = (newSeatData) => {
      console.log("Updating seats...");
        setSeat((prevSeat) => ({
            ...prevSeat,
            ...newSeatData,
        }))
    };

  return (
    <SeatContext.Provider value={{seat, updateSeat}}>
      {children}
    </SeatContext.Provider>
  )
}

export function useSeatContext(){
    return useContext(SeatContext);
}