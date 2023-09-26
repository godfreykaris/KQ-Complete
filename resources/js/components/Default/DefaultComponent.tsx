
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '././src/views/others/dashboard';
import NotFound from "./src/views/others/notfound";
import BookFlight from "./src/views/booking/bookflight";
import SeatMap from "./src/views/seats/seatmap";
import AddPassenger from "./src/views/passengers/addpassenger";
import AddPassenger1 from "./src/views/passengers/addpassenger1";
import EditPassenger from "./src/views/passengers/editpassenger";
import Seat from "./src/views/seats/viewseat";
import DeletePassenger from "./src/views/passengers/deletepassenger";
import ChangePassenger from "./src/views/passengers/changepassenger";
import EditBooking from "./src/views/booking/editbooking";
import Deletebooking from "./src/views/booking/deletebooking";
import ChangeBooking from "./src/views/booking/changebooking";
import SendInquiry from "./src/views/inquiries/inquiries";
import PassengerProvider from "./src/context/passengers/passengercontext";
import SeatProvider from "./src/context/seats/sendseatdata";
import Footer from "./src/components/homeelements/footer";
import Cards from "./src/components/homeelements/cards";
import SearchFlight from "./src/views/booking/searchflight";
import FlightProvider from "./src/context/flights/flightcontext";
import About from "./src/views/others/about";
import ContactUs from "./src/views/others/contact";
import ViewOpenings from "./src/views/others/viewopenings";
import DashboardLayout from "./src/components/layouts/dashboardlayout";
import Skills from "./src/views/others/viewskills";
import PrintTicket from "./src/views/booking/printticket";
import { ContextProvider } from "./src/components/miscallenious/contextprovider";

import { Navigate, createBrowserRouter } from "react-router-dom";
import SignInComponent from '../Auth/SignInComponent';
import SignUpComponent from '../Auth/SignUpComponent';
import { BookingContextProvider} from './src/context/BookingContext';

import { BookingProvider } from './src/context/booking/bookflightcontext';
import { EditBookingProvider } from './src/context/booking/editbookingcontext';

const router = [
      
    {
      path: "/",
      element: <Dashboard/>,
    },
    {
      path: "bookflight",
      element: (
          <SeatProvider>
              <PassengerProvider>
                <BookingProvider>
                  <BookingContextProvider>
                    <BookFlight />
                  </BookingContextProvider>
                </BookingProvider>                                  
              </PassengerProvider>             
         </SeatProvider>
      )        
    },
    {
      path: 'seatmap',
      element: (
          <SeatProvider>
              <SeatMap planeId={undefined} onSeatSelected={undefined}/>
          </SeatProvider>
      )
  },
  {
      path: '/signin',
      element: <SignInComponent/>
  },
  {
      path: '/signup',
      element: <SignUpComponent/>
  },
  {
      path: 'addpassenger',
      element: <AddPassenger/>
  },
  {
      path: 'addpassenger1',
      element: (
          <SeatProvider>
              <PassengerProvider>
                <BookingContextProvider>
                  <BookingProvider>
                    <AddPassenger1/>
                  </BookingProvider>
                </BookingContextProvider>
              </PassengerProvider>
          </SeatProvider>
      )
  },
  {
      path: 'changepassenger',
      element: (
          <EditBookingProvider>
            <SeatProvider>
              <ChangePassenger/>
            </SeatProvider>
          </EditBookingProvider>
      )
  },
  {
      path: 'viewseat',
      element: <Seat
      showSeatModal={false}
      handleCloseSeatModal={() => {}}
      seatObject={{
        seat_number: '',
        flight_class: { id: 0, name: '' },
        location: { id: 0, name: '' },
        is_available: false,
        price: '',
        seat_id: 0,
      }}
      />
  },
  {
      path: 'editpassenger',
      element: (
          <EditBookingProvider>
            <SeatProvider>
              <EditPassenger showEditModal={false} handleResubmission={undefined} passengerDataObject={undefined} handleClose={undefined} flightId={''}/>
            </SeatProvider>
          </EditBookingProvider>
      )
  },
  {
      path: 'deletepassenger',
      element: <DeletePassenger/>
  },
  {
      path: 'changebooking',
      element: (
        <SeatProvider>
              <PassengerProvider>
                <BookingProvider>
                  <BookingContextProvider>
                    <ChangeBooking/>
                  </BookingContextProvider>
                </BookingProvider>                                  
              </PassengerProvider>             
         </SeatProvider>
      )
  },
  {
      path: 'editbooking',
      element: (
        <EditBookingProvider>
            <EditBooking showEditModal={false} handleResubmission={undefined} bookingDataObject={undefined} handleClose={undefined}/>
        </EditBookingProvider>
      )
  },
  {
      path: 'deletebooking',
      element: <Deletebooking/>
  },
  {
      path: 'inquiries',
      element: <SendInquiry/>
  },
  {
      path: 'footer',
      element: <Footer/>
  },
  {
      path: 'cards',
      element: <Cards/>
  },
  {
      path: 'searchflight',
      element: (
          <BookingProvider>
              <SearchFlight/>
          </BookingProvider>
      )
  },
  {
    path:'about',
    element:<About/>
  },
  {
    path: 'contact',
    element: <ContactUs/>
  },
  {
    path: 'viewopenings',
    element: <ViewOpenings/>
  },
  {
      path: 'viewskills',
      element: <Skills showSkillsModal={undefined} handleCloseModal={undefined} skillsArray={undefined}/>
  },
  {
      path: 'printticket',
      element: <PrintTicket/>
  },

{
  path: "*",
  element: <NotFound/>
}
]

const DefaultComponent = () => {
   
    return (
          <Routes>         
            
                {router.map((route: any, index:number) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}

                    />
                  ))}  
          </Routes>
    );
  };
  
  export default DefaultComponent;