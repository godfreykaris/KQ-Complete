
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
import { BookingProvider, BookingContextType } from './src/context/booking/bookflightcontext';


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
                    <BookFlight />
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
                  <AddPassenger1/>
              </PassengerProvider>
          </SeatProvider>
      )
  },
  {
      path: 'changepassenger',
      element: (
          <SeatProvider>
              <ChangePassenger/>
          </SeatProvider>
      )
  },
  {
      path: 'viewseat',
      element: <Seat
      showSeatModal={false}
      handleCloseSeatModal={() => {}}
      seatObject={{
        seat_number: 0,
        flight_class: { id: 0, name: '' },
        location: { id: 0, name: '' },
        is_available: false,
        price: '',
        _id: 0,
      }}
      />
  },
  {
      path: 'editpassenger',
      element: (
          <SeatProvider>
              <EditPassenger showEditModal={undefined} handleResubmission={undefined} passengerDataObject={undefined} handleClose={undefined}/>
          </SeatProvider>
      )
  },
  {
      path: 'deletepassenger',
      element: <DeletePassenger/>
  },
  {
      path: 'changebooking',
      element: <ChangeBooking/>
  },
  {
      path: 'editbooking',
      element: <EditBooking showEditModal={undefined} handleResubmission={undefined} bookingDataObject={undefined} handleClose={undefined}/>
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
          <FlightProvider>
              <SearchFlight/>
          </FlightProvider>
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