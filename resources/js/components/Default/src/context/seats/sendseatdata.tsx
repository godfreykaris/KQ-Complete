import React, {createContext, useState, useContext} from "react";

interface flight_class{
  id: number;
  name: string;
}

interface location{
  id: number;
  name: string;
}

interface seat{
  _id: number;
  seat_number: number;
  flight_class: flight_class | {id: 0, name: ''};
  location: location | {id: 0, name: ''};
  is_available: boolean;
  price: string;
}

interface SeatContextType{
  seat: seat | {
    seat_number: 0,
    flight_class: {id: 0, name: ''},
    location: {id: 0, name: ''},
    is_available: false,
    price: '',
    _id: 0 
  };
  updateSeat: (newSeatData: seat) => void;
}

interface seatProviderProps{
  children: React.ReactNode;
}

const SeatContext = createContext<SeatContextType | undefined>(undefined);

export default function SeatProvider({children} : seatProviderProps) {
    const [seat, setSeat] = useState<seat | {
      seat_number: 0,
      flight_class: {id: 0, name: ''},
      location: {id: 0, name: ''},
      is_available: false,
      price: '',
      _id: 0}
      >({
        seat_number: 0,
        flight_class: {id: 0, name: ''},
        location: {id: 0, name: ''},
        is_available: false,
        price: '',
        _id: 0
      });

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