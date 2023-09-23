import React, { createContext, useContext, useState } from "react";

interface Location {
    name: string;
  }
  
  interface Booking {
    bookingReference: string;
    email: string;
    flight_id: number;
    departure_date: string;
    from: Location;
    to: Location;
  }

  interface EditBookingContextType{
    editedBooking: Booking;
    setEditedBooking: React.Dispatch<React.SetStateAction<Booking>>;
    ticketNumber: string;
    setTicketNumber: React.Dispatch<React.SetStateAction<string>>;
    bookingReference: string;
    setBookingReference: React.Dispatch<React.SetStateAction<string>>;
  }

  const EditBookingContext = createContext<EditBookingContextType | undefined>(undefined);

  export function EditBookingProvider({children}: {children: React.ReactNode}){
    const [editedBooking, setEditedBooking] = useState<Booking>({
        bookingReference: "",
        email: "",
        flight_id: 0,
        departure_date: "",
        from: { name: "" },
        to: { name: "" },
      });

      const [ticketNumber, setTicketNumber] = useState<string>("");
      const [bookingReference, setBookingReference] = useState<string>("");  

      const contextValue = {
        editedBooking,
        setEditedBooking,
        ticketNumber,
        setTicketNumber,
        bookingReference,
        setBookingReference,
      };

      return(
        <EditBookingContext.Provider value={contextValue}>
            {children}
        </EditBookingContext.Provider>
      )
  }

  export function useEditBookingContext() {
    const context = useContext(EditBookingContext);
    if(!context){
        throw new Error("useBookingContext must be used within a EditBookingProvider");
    }

    return context;
  }

  export type {EditBookingContextType};