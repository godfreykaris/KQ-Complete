import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import BaseFormAddComponent from './components/OtherData/BaseFormAddComponent';
import BaseFormEditComponent from './components/OtherData/BaseFormEditComponent';
import EditFormComponent from './components/Common/EditFormComponent';
import BaseFormDeleteComponent from './components/OtherData/BaseFormDeleteComponent';
import DeleteFormComponent from './components/Common/DeleteFormComponent';
import ViewFormComponent from './components/OtherData/ViewFormComponent';
import CAFormEditComponent from './components/Cities&Airlines/CAFormEditComponent';
import CAFormViewComponent from './components/Cities&Airlines/CAFormViewComponent';
import CAFormDeleteComponent from './components/Cities&Airlines/CAFormDeleteComponent';

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
                  {/* <NavDropdown title="Cities & Airlines" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item href="#action/3.4">
                      Edi
                    </NavDropdown.Item>

                  </NavDropdown> */}
                  <NavDropdown title="Cities & Airlines" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/cities_airlines/" className="menu-item-text">
                      Add Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/edit" className="menu-item-text">
                      Edit Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/delete" className="menu-item-text">
                      Delete Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cities_airlines/view" className="menu-item-text">
                      View Data
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
                <Route path="/" element={<BaseFormAddComponent />} />
                <Route path="/other/edit" element={<BaseFormEditComponent />} />
                <Route path="/other/edit/:selectedEntity/:id/:name" element={<EditFormComponent />} />
                <Route path="/other/delete" element={<BaseFormDeleteComponent />} />
                <Route path="/other/delete/:selectedEntity/:id/:name" element={<DeleteFormComponent />} />
                <Route path="/other/view" element={<ViewFormComponent />} />

                <Route path="/cities_airlines/edit" element={<CAFormEditComponent />} />
                <Route path="/cities_airlines/edit/:selectedEntity/:id/:name" element={<EditFormComponent />} />
                <Route path="/cities_airlines/view" element={<CAFormViewComponent />} />
                <Route path="/cities_airlines/delete" element={<CAFormDeleteComponent />} />
                <Route path="/cities_airlines/delete/:selectedEntity/:id/:name" element={<DeleteFormComponent />} />



                {/* Add other routes for other menu items as needed */}
              </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
