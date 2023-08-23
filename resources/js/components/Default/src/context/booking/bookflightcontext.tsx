import React, { createContext, useContext, useState } from "react";
  
  interface status{
    name: string;
  }
  
  interface airline{
    name: string;
  }

  interface locations{
    name: string;
    country: string;
    id: number;
  }

interface flight{
    id: number;
    flight_status: status;
    flight_number: number;
    departure_city: locations;
    arrival_city: locations;
    airline: airline;
    duration: string;
    departure_time:  string;
    return_time: string;
  }

  interface FormData {
    email: string;
    departureDate: string;
    returnDate: string;
    selectedFrom: string;
    selectedTo: string;
  }

interface BookingContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  flightTableData: flight[];
  setFlightTableData: React.Dispatch<React.SetStateAction<flight[]>>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
    children: React.ReactNode; // Define the type for children
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    departureDate: "",
    returnDate: "",
    selectedFrom: "",
    selectedTo: "",
  });
  const [flightTableData, setFlightTableData] = useState<flight[]>([]);

  return (
    <BookingContext.Provider value={{ formData, setFormData, flightTableData, setFlightTableData }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};

export type {BookingContextType};