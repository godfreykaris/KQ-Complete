import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./views/others/notfound";
import Dashboard from "./views/others/dashboard";
import BookFlight from "./views/booking/bookflight";
import SeatMap from "./views/seats/seatmap";
import SignUp from "./views/membership/signup";
import Signin from "./views/membership/signin";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout/>,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard"/>,
      },
      {
        path: "/dashboard",
        element: <Dashboard/>,
      },
      {
        path: "/bookflight",
        element: (
            <SeatProvider>
                <PassengerProvider>
                    <BookFlight />
                </PassengerProvider>             
           </SeatProvider>
        )        
      },
      {
        path: '/seatmap',
        element: (
            <SeatProvider>
                <SeatMap/>
            </SeatProvider>
        )
    },
    {
        path: '/signin',
        element: <Signin/>
    },
    {
        path: '/signup',
        element: (
            <ContextProvider>
                <SignUp/>
            </ContextProvider>
        )
    },
    {
        path: '/addpassenger',
        element: <AddPassenger/>
    },
    {
        path: '/addpassenger1',
        element: (
            <SeatProvider>
                <PassengerProvider>
                    <AddPassenger1/>
                </PassengerProvider>
            </SeatProvider>
        )
    },
    {
        path: '/changepassenger',
        element: (
            <SeatProvider>
                <ChangePassenger/>
            </SeatProvider>
        )
    },
    {
        path: '/viewseat',
        element: <Seat/>
    },
    {
        path: '/editpassenger',
        element: (
            <SeatProvider>
                <EditPassenger/>
            </SeatProvider>
        )
    },
    {
        path: '/deletepassenger',
        element: <DeletePassenger/>
    },
    {
        path: '/changebooking',
        element: <ChangeBooking/>
    },
    {
        path: '/editbooking',
        element: <EditBooking/>
    },
    {
        path: '/deletebooking',
        element: <Deletebooking/>
    },
    {
        path: '/addbookinginquiry',
        element: <AddBookingInquiry/>
    },
    {
        path: '/changebookinginquiry',
        element: <ChangeBookingInquiry/>
    },
    {
        path: '/deletebookinginquiry',
        element: <DeleteBookingInquiry/>
    },
    {
        path: '/footer',
        element: <Footer/>
    },
    {
        path: '/cards',
        element: <Cards/>
    },
    {
        path: '/searchflight',
        element: (
            <FlightProvider>
                <SearchFlight/>
            </FlightProvider>
        )
    },
    {
      path:'/about',
      element:<About/>
    },
    {
      path: '/contact',
      element: <ContactUs/>
    },
    {
      path: 'viewopenings',
      element: <ViewOpenings/>
    },
    {
        path: '/viewskills',
        element: <Skills/>
    },
    {
        path: '/printticket',
        element: <PrintTicket/>
    }

    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;