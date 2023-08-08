// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from '././components/Admin/AdminComponent';
import ProtectedRoute from '././components/ProtectedRoute';
import SignUpComponent from './components/Auth/SignUpComponent';
import SignInComponent from '././components/Auth/SignInComponent'; // Your login component
import { AuthProvider } from '././context/AuthContext';
import HRMComponent from './components/HR/HRMComponent';
import router from "./components/Default/src/router";

import NotFound from "./views/others/notfound";
import Dashboard from "./views/others/Dashboard";
import BookFlight from "./views/booking/bookflight";
import SeatMap from "./views/seats/seatmap";
import AddPassenger from "./views/passengers/addpassenger";
import AddPassenger1 from "./views/passengers/addpassenger1";
import EditPassenger from "./views/passengers/editpassenger";
import Seat from "./views/seats/viewseat";
import DeletePassenger from "./views/passengers/deletepassenger";
import ChangePassenger from "./views/passengers/changepassenger";
import EditBooking from "./views/booking/editbooking";
import Deletebooking from "./views/booking/deletebooking";
import ChangeBooking from "./views/booking/changebooking";
import AddBookingInquiry from "./views/inquiries/addbookinginquiry";
import ChangeBookingInquiry from "./views/inquiries/changebookinginquiry";
import DeleteBookingInquiry from "./views/inquiries/deletebookinginquiry";
import PassengerProvider from "./context/passengers/passengercontext";
import SeatProvider from "./context/seats/sendseatdata";
import Footer from "./components/homeelements/footer";
import Cards from "./components/homeelements/cards";
import SearchFlight from "./views/booking/searchflight";
import FlightProvider from "./context/flights/flightcontext";
import About from "./views/others/about";
import ContactUs from "./views/others/contact";
import ViewOpenings from "./views/others/viewopenings";
import DashboardLayout from "./components/layouts/dashboardlayout";
import Skills from "./views/others/viewskills";
import PrintTicket from "./views/booking/printticket";
import { ContextProvider } from "./components/miscallenious/contextprovider";
import SignInComponent from "../../Auth/SignInComponent.tsx"
import SignUpComponent from "../../Auth/SignUpComponent.tsx"

import Data from './Data';



const App = () => {
  //alert(JSON.stringify(router[0].children))

  
  return (
    <AuthProvider>
      <Router>        
        <Routes>          
          
          <Route path="/" element={<Dashboard />} />

          <Route path="/" element={<SignInComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/admin/*" element={<ProtectedRoute element={<AdminComponent />} />} />
          <Route path="/hrm/*" element={<ProtectedRoute element={<HRMComponent />} />} />

           {/* Use ProtectedRoute for authenticated routes */}
           
           {/* Add other unprotected routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
