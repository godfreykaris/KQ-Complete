import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from "react";

interface SearchFlightContextType {
  selectedFrom: string;
  setSelectedFrom: Dispatch<SetStateAction<string>>;
  selectedTo: string;
  setSelectedTo: Dispatch<SetStateAction<string>>;
  departureDate: string;
  setDepartureDate: Dispatch<SetStateAction<string>>;
  returnDate: string;
  setReturnDate: Dispatch<SetStateAction<string>>;
  flightId: number;
  setFlightId: Dispatch<SetStateAction<number>>;
}

const SearchFlightContext = createContext<SearchFlightContextType | undefined>(undefined);

interface FlightProviderProps {
  children: ReactNode;
}

export default function FlightProvider({ children }: FlightProviderProps) {
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightId, setFlightId] = useState<number>(0);

  const contextValue: SearchFlightContextType = {
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
  };

  return (
    <SearchFlightContext.Provider value={contextValue}>
      {children}
    </SearchFlightContext.Provider>
  );
}

export function useSearchFlightContext() {
  const context = useContext(SearchFlightContext);
  if (!context) {
    throw new Error("useSearchFlightContext must be used within a FlightProvider");
  }
  return context;
}

export type {SearchFlightContextType};
