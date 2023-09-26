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
  seat_id: number;
  seat_number: string;
  flight_class: flight_class | {id: 0, name: ''};
  location: location | {id: 0, name: ''};
  is_available: boolean;
  price: string;
}

interface SeatContextType{
  seats: seat[];
  updateSeat: (index: number, newSeatData: seat) => void;
}

interface seatProviderProps{
  children: React.ReactNode;
}

const SeatContext = createContext<SeatContextType | undefined>(undefined);

export default function SeatProvider({children} : seatProviderProps) {
    const [seats, setSeats] = useState<seat[]>([]);

    const updateSeat = (index: number, newSeatData: seat) => {
        setSeats((prevSeat) => 
            prevSeat.map((seat, i) => (i === index ? {...seat, ...newSeatData} : seat))
        );
    };

  return (
    <SeatContext.Provider value={{seats, updateSeat}}>
      {children}
    </SeatContext.Provider>
  )
}

export function useSeatContext(){
    return useContext(SeatContext);
}

export type {SeatContextType};