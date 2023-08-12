import React, {createContext, useState, useContext} from "react";

interface seat{
  _id: number;
  number: number;
  class: string;
  location: string;
  availability: boolean;
  price: string;
}

interface SeatContextType{
  seat: seat | {};
  updateSeat: (newSeatData: seat) => void;
}

interface seatProviderProps{
  children: React.ReactNode;
}

const SeatContext = createContext<SeatContextType | undefined>(undefined);

export default function SeatProvider({children} : seatProviderProps) {
    const [seat, setSeat] = useState<seat | {}>({});

    const updateSeat = (newSeatData: seat) => {
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

export type {SeatContextType};