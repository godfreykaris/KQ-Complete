import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./views/others/notfound.jsx";
import Dashboard from "./views/others/dashboard.jsx";
import BookFlight from "./views/booking/bookflight.jsx";
import SeatMap from "./views/seats/seatmap.jsx";
import AddPassenger from "./views/passengers/addpassenger.jsx";
import AddPassenger1 from "./views/passengers/addpassenger1.jsx";
import EditPassenger from "./views/passengers/editpassenger.jsx";
import Seat from "./views/seats/viewseat.jsx";
import DeletePassenger from "./views/passengers/deletepassenger.jsx";
import ChangePassenger from "./views/passengers/changepassenger.jsx";
import EditBooking from "./views/booking/editbooking.jsx";
import Deletebooking from "./views/booking/deletebooking.jsx";
import ChangeBooking from "./views/booking/changebooking.jsx";
import AddBookingInquiry from "./views/inquiries/addbookinginquiry.jsx";
import ChangeBookingInquiry from "./views/inquiries/changebookinginquiry.jsx";
import DeleteBookingInquiry from "./views/inquiries/deletebookinginquiry.jsx";
import PassengerProvider from "./context/passengers/passengercontext.jsx";
import SeatProvider from "./context/seats/sendseatdata.jsx";
import Footer from "./components/homeelements/footer.jsx";
import Cards from "./components/homeelements/cards.jsx";
import SearchFlight from "./views/booking/searchflight.jsx";
import FlightProvider from "./context/flights/flightcontext.jsx";
import About from "./views/others/about.jsx";
import ContactUs from "./views/others/contact.jsx";
import ViewOpenings from "./views/others/viewopenings.jsx";
import DashboardLayout from "./components/layouts/dashboardlayout.jsx";
import Skills from "./views/others/viewskills.jsx";
import PrintTicket from "./views/booking/printticket.jsx";
import { ContextProvider } from "./components/miscallenious/contextprovider.jsx";
import SignInComponent from "../../Auth/SignInComponent.tsx"
import SignUpComponent from "../../Auth/SignUpComponent.tsx"



const router = [
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
        element: <SignInComponent/>
    },
    {
        path: '/signup',
        element: (
            <ContextProvider>
                <SignUpComponent/>
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
]

export default router;