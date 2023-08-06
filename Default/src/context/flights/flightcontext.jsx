import { createContext, useState, useContext } from "react";

const SearchFlightContext = createContext();

export default function FlightProvider({children}) {
    const [selectedFrom, setSelectedFrom] = useState("");
    const [selectedTo, setSelectedTo] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [flightId, setFlightId] = useState("");

  return (
    <SearchFlightContext.Provider
        value={{
            selectedFrom,
            setSelectedFrom,
            selectedTo,
            setSelectedTo,
            departureDate,
            setDepartureDate,
            returnDate,
            setReturnDate,
            flightId,
            setFlightId,
        }}
    >
      {children}
    </SearchFlightContext.Provider>
  );
}

export function useSearchFlightContext(){
    return useContext(SearchFlightContext);
}