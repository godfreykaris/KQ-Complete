
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '././src/views/others/dashboard';
import NotFound from "./src/views/others/notfound";
import BookFlight from "./src/views/booking/bookflight";
import AddPassenger from "./src/views/passengers/addpassenger";
import AddPassenger1 from "./src/views/passengers/addpassenger1";
import Seat from "./src/views/seats/viewseat";
import DeletePassenger from "./src/views/passengers/deletepassenger";
import ChangePassenger from "./src/views/passengers/changepassenger";
import Deletebooking from "./src/views/booking/deletebooking";
import ChangeBooking from "./src/views/booking/changebooking";
import SendInquiry from "./src/views/inquiries/inquiries";
import PassengerProvider from "./src/context/passengers/passengercontext";
import SeatProvider from "./src/context/seats/sendseatdata";
import Footer from "./src/components/homeelements/footer";
import Cards from "./src/components/homeelements/cards";
import SearchFlight from "./src/views/booking/searchflight";
import About from "./src/views/others/about";
import ContactUs from "./src/views/others/contact";
import ViewOpenings from "./src/views/others/viewopenings";
import Skills from "./src/views/others/viewskills";
import PrintTicket from "./src/views/booking/printticket";

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
           <EditBookingProvider>
              <PassengerProvider>
                <BookingProvider>
                  <BookingContextProvider>
                    <BookFlight />
                  </BookingContextProvider>
                </BookingProvider>                                  
              </PassengerProvider>  
              </EditBookingProvider>           
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
           <EditBookingProvider>
              <PassengerProvider>
                <BookingProvider>
                  <BookingContextProvider>
                    <AddPassenger1/>
                  </BookingContextProvider>
                </BookingProvider>
              </PassengerProvider>
            </EditBookingProvider>
          </SeatProvider>
      )
  },
  {
      path: 'changepassenger',
      element: (
        <SeatProvider>
        <EditBookingProvider>
          <PassengerProvider>
            <BookingProvider>
              <ChangePassenger/>
              </BookingProvider>
            </PassengerProvider>
          </EditBookingProvider>
        </SeatProvider>
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
      path: 'deletepassenger',
      element: <DeletePassenger/>
  },
  {
      path: 'changebooking',
      element: (
        <SeatProvider>
           <EditBookingProvider>
              <PassengerProvider>
                  <BookingProvider>
                      <ChangeBooking/>
                  </BookingProvider>
              </PassengerProvider>  
            </EditBookingProvider>
           
         </SeatProvider>
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
      <EditBookingProvider>
        <PassengerProvider>  
          <BookingProvider>
            <BookingContextProvider>
              <SearchFlight />
            </BookingContextProvider>
          </BookingProvider>
        </PassengerProvider>  
      </EditBookingProvider>

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
      element: <Skills showSkillsModal={false} handleCloseModal={() => {}} skillsArray={[]}/>
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