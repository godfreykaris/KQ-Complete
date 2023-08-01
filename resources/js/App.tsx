
import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import EditFormComponent from './components/Common/EditFormComponent';
import DeleteFormComponent from './components/Common/DeleteFormComponent';

import BaseFormAddOtherComponent from './components/OtherData/BaseFormAddOtherComponent';
import BaseFormEditComponent from './components/OtherData/BaseFormEditComponent';
import BaseFormDeleteComponent from './components/OtherData/BaseFormDeleteComponent';
import ViewFormComponent from './components/OtherData/ViewFormComponent';

import AddFlightForm from './components/Flight/AddFlightForm';
import ViewFlights from './components/Flight/ViewFlights';
import EditFlightForm from './components/Flight/EditFlightForm';

import AddPlaneForm from './components/Plane/AddPlaneForm';
import BaseEditPlaneForm from './components/Plane/BaseEditPlaneForm';
import EditPlaneForm from './components/Plane/EditPlaneForm';
import BaseDeletePlaneForm from './components/Plane/BaseDeletePlaneForm';
import DeletePlaneForm from './components/Plane/DeletePlaneForm';
import ViewPlanes from './components/Plane/ViewPlanes';

import AddSeatForm from './components/Seat/AddSeatForm';
import ViewSeats from './components/Seat/ViewSeats';
import EditSeatForm from './components/Seat/EditSeatForm';

import AirlineFormAddComponent from './components/Cities&Airlines/AirlineFormAddComponent';
import CityFormAddComponent from './components/Cities&Airlines/CityFormAddComponent';
import CAFormEditComponent from './components/Cities&Airlines/CAFormEditComponent';
import CAFormViewComponent from './components/Cities&Airlines/CAFormViewComponent';
import CAFormDeleteComponent from './components/Cities&Airlines/CAFormDeleteComponent';

import AddEmployeeForm from './components/Employees/AddEmployeeForm';
import ViewEmployees from './components/Employees/ViewEmployees';
import EditEmployeeForm from './components/Employees/EditEmployeeForm';

import AddOpeningForm from './components/JobOpenings/AddOpeningForm';
import ViewOpenings from './components/JobOpenings/ViewOpenings';
import EditOpeningForm from './components/JobOpenings/EditOpeningForm';

const App = () => {
  
  return (
    <Router> {/* Wrap the entire component with Router */}
      <div>
        <div className="container-fluid sticky-top" style={{ backgroundColor: '#007BFF' }}>
            <Navbar bg="#007BFF" expand="md" variant="light" className="mx-auto" style={{ maxWidth: '800px' }}>
              <Navbar.Brand href="#home" style={{ color: '#FFFFFF' }}>
                KQ Admin
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: '#FFFFFF' }} />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto justify-content-center">
                  <Nav.Link href="#" className="menu-item-text" active>
                    Home
                  </Nav.Link>
                  <NavDropdown title="Flights" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/manage_flights/add" className="menu-item-text">
                      Add Flight
                    </NavDropdown.Item>                                       
                    <NavDropdown.Item as={Link} to="/manage_flights/view" className="menu-item-text">
                      View|Edit|Delete Flights
                    </NavDropdown.Item>
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Planes" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/planes/add" className="menu-item-text">
                      Add Plane
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/planes/edit" className="menu-item-text">
                      Edit Plane
                    </NavDropdown.Item>                    
                    <NavDropdown.Item as={Link} to="/planes/delete" className="menu-item-text">
                      Delete Plane
                    </NavDropdown.Item>                    
                    <NavDropdown.Item as={Link} to="/planes/view" className="menu-item-text">
                      View Planes
                    </NavDropdown.Item>
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Seats" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/plane_seats/add" className="menu-item-text">
                      Add Seat
                    </NavDropdown.Item>
                                      
                    <NavDropdown.Item as={Link} to="/plane_seats/view" className="menu-item-text">
                      View|Edit|Delete Seats
                    </NavDropdown.Item>
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Cities & Airlines" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/cities_airlines/add/city" className="menu-item-text">
                      Add City
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/add/airline" className="menu-item-text">
                      Add Airline
                    </NavDropdown.Item>                    
                    <NavDropdown.Item as={Link} to="/cities_airlines/edit" className="menu-item-text">
                      Edit City/Airline
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/delete" className="menu-item-text">
                      Delete City/Airline
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/view" className="menu-item-text">
                      View City/Airline
                    </NavDropdown.Item>
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Employees" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/manage_employees/add" className="menu-item-text">
                      Add Employee
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manage_employees/view" className="menu-item-text">
                      View|Edit|Delete Employees
                    </NavDropdown.Item>
                    
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Job Openings" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/manage_openings/add" className="menu-item-text">
                      Add Opening
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manage_openings/view" className="menu-item-text">
                      View|Edit|Delete Opening
                    </NavDropdown.Item>
                    
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Other Data" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/" className="menu-item-text">
                      Add Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/other/edit" className="menu-item-text">
                      Edit Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/other/delete" className="menu-item-text">
                      Delete Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/other/view" className="menu-item-text">
                      View Data
                    </NavDropdown.Item>
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
        </div>

        <div className="container mt-4">
          <div className="row justify-content-center">
              <Routes>
                <Route path="/" element={<BaseFormAddOtherComponent />} />
                <Route path="/other/edit" element={<BaseFormEditComponent />} />
                <Route path="/other/edit/:selectedEntity/:id/:name" element={<EditFormComponent />} />
                <Route path="/other/delete" element={<BaseFormDeleteComponent />} />
                <Route path="/other/delete/:selectedEntity/:id/:name" element={<DeleteFormComponent />} />
                <Route path="/other/view" element={<ViewFormComponent />} />

                <Route path="/manage_flights/add" element={<AddFlightForm />} />
                <Route path="/manage_flights/edit/:flight_id" element={<EditFlightForm />} />
                <Route path="/manage_flights/delete/:selectedEntity/:flight_id" element={<DeleteFormComponent />} />
                <Route path="/manage_flights/view" element={<ViewFlights />} />

                <Route path="/planes/add" element={<AddPlaneForm />} />
                <Route path="/planes/edit" element={<BaseEditPlaneForm />} />
                <Route path="/planes/edit/:id/:planeId/:model/:name" element={<EditPlaneForm />} />
                <Route path="/planes/delete" element={<BaseDeletePlaneForm />} />
                <Route path="/planes/delete/:id/:planeId/:model/:name" element={<DeletePlaneForm />} />
                <Route path="/planes/view" element={<ViewPlanes />} />

                <Route path="/plane_seats/add" element={<AddSeatForm />} />
                <Route path="/plane_seats/edit/:plane_id/:flight_class_id/:location_id/:price/:seat_number" element={<EditSeatForm />} />
                <Route path="/plane_seats/delete/:selectedEntity/:plane/:seat_number/:plane_id" element={<DeleteFormComponent />} />
                <Route path="/plane_seats/view" element={<ViewSeats />} />

                <Route path="/cities_airlines/add/city" element={<CityFormAddComponent />} />
                <Route path="/cities_airlines/add/airline" element={<AirlineFormAddComponent />} />
                <Route path="/cities_airlines/edit" element={<CAFormEditComponent />} />
                <Route path="/cities_airlines/city/edit/:selectedEntity/:id/:name/:country" element={<EditFormComponent />} />
                <Route path="/cities_airlines/airline/edit/:selectedEntity/:id/:name/:code" element={<EditFormComponent />} />
                <Route path="/cities_airlines/view" element={<CAFormViewComponent />} />
                <Route path="/cities_airlines/delete" element={<CAFormDeleteComponent />} />
                <Route path="/cities_airlines/city/delete/:selectedEntity/:id/:name/:country" element={<DeleteFormComponent />} />
                <Route path="/cities_airlines/airline/delete/:selectedEntity/:id/:name/:code" element={<DeleteFormComponent />} />

                <Route path="/manage_employees/add" element={<AddEmployeeForm />} />
                <Route path="/manage_employees/edit/:employee_id" element={<EditEmployeeForm />} />
                <Route path="/manage_employees/delete/:selectedEntity/:employee_id" element={<DeleteFormComponent />} />
                <Route path="/manage_employees/view" element={<ViewEmployees />} />

                <Route path="/manage_openings/add" element={<AddOpeningForm />} />
                <Route path="/manage_openings/edit/:opening_id" element={<EditOpeningForm />} />
                <Route path="/manage_openings/delete/:selectedEntity/:opening_id" element={<DeleteFormComponent />} />
                <Route path="/manage_openings/view" element={<ViewOpenings />} />

                {/* Add other routes for other menu items as needed */}
              </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
