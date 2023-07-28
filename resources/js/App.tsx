import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import BaseFormAddComponent from './components/OtherData/BaseFormAddComponent';
import BaseFormEditComponent from './components/OtherData/BaseFormEditComponent';
import EditFormComponent from './components/OtherData/EditFormComponent';
import BaseFormDeleteComponent from './components/OtherData/BaseFormDeleteComponent';
import DeleteFormComponent from './components/OtherData/DeleteFormComponent';
import ViewFormComponent from './components/OtherData/ViewFormComponent';

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
                  <NavDropdown title="Other Data" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="/" className="menu-item-text">
                      Add Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/edit" className="menu-item-text">
                      Edit Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/delete" className="menu-item-text">
                      Delete Data
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/view" className="menu-item-text">
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
                <Route path="/edit" element={<BaseFormEditComponent />} />
                <Route path="/edit/:selectedEntity/:id/:name" element={<EditFormComponent />} />
                <Route path="/delete" element={<BaseFormDeleteComponent />} />
                <Route path="/delete/:selectedEntity/:id/:name" element={<DeleteFormComponent />} />
                <Route path="/view" element={<ViewFormComponent />} />

                {/* Add other routes for other menu items as needed */}
              </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
