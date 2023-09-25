import React, { createContext, useContext, useState } from "react";

// Define the interfaces for your data
interface Status {
  name: string;
}

interface Airline {
  name: string;
}

interface Locations {
  name: string;
  country: string;
  id: number;
}

interface Flight {
  id: number;
  flight_status: Status;
  flight_number: number;
  departure_city: Locations;
  arrival_city: Locations;
  airline: Airline;
  duration: string;
  departure_time: string;
  return_time: string;
}

// Define the form data structure
interface FormData {
  email: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  selectedFrom: Locations;
  selectedTo: Locations;
}

// Define the context type
interface BookingContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  flightTableData: Flight[];
  setFlightTableData: React.Dispatch<React.SetStateAction<Flight[]>>;
  selectedFlight: Flight | null;
  setSelectedFlight: React.Dispatch<React.SetStateAction<Flight | null>>;
  isPlaneSelected: boolean;
  setIsPlaneSelected: React.Dispatch<React.SetStateAction<boolean>>
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Define the props for the provider component
interface BookingProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => { 

   // Define and initialize state variables
   const [formData, setFormData] = useState<FormData>({
    email: '',
    tripType: '',
    departureDate: '',
    returnDate: '',
    selectedFrom: {
      name: '',
      country: '',
      id: 0
    },
    selectedTo: {
      name: '',
      country: '',
      id: 0
    },
  });

  // Define and initialize flightTableData and selectedFlight
  const [flightTableData, setFlightTableData] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isPlaneSelected, setIsPlaneSelected] = useState<boolean>(false);

  // Provide the state variables in the context value
  return (
    <BookingContext.Provider
      value={{
        formData,
        setFormData,
        flightTableData,
        setFlightTableData,
        selectedFlight,
        setSelectedFlight,
        isPlaneSelected,
        setIsPlaneSelected
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Create a hook to access the context
export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};

// Export the context type
export type { BookingContextType };
