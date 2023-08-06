
import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import DeleteFormComponent from '../Common/DeleteFormComponent';

import AddEmployeeForm from '../../components/HR/Employees/AddEmployeeForm';
import ViewEmployees from '../../components/HR/Employees/ViewEmployees';
import EditEmployeeForm from '../../components/HR/Employees/EditEmployeeForm';

import AddOpeningForm from '../../components/HR/JobOpenings/AddOpeningForm';
import ViewOpenings from '../../components/HR/JobOpenings/ViewOpenings';
import EditOpeningForm from '../../components/HR/JobOpenings/EditOpeningForm';
import MatchEmployeesToOpenings from '../../components/HR/JobOpenings/MatchEmployeesToOpening';

import useLogout from '../Auth/useLogOut';

const HRMComponent = () => {

  const handleLogout = useLogout();
  
  return (
      <div>
        <div className="container-fluid sticky-top" style={{ backgroundColor: '#007BFF' }}>
            <Navbar bg="#007BFF" expand="md" variant="light" className="mx-auto" style={{ maxWidth: '800px' }}>
              <Navbar.Brand href="#home" style={{ color: '#FFFFFF' }}>
                KQ Human Resource Manager
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: '#FFFFFF' }} />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto justify-content-center">                  
                   <NavDropdown title="Employees" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="manage_employees/add" className="menu-item-text">
                      Add Employee
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="manage_employees/view" className="menu-item-text">
                      View|Edit|Delete Employees
                    </NavDropdown.Item>                
                    
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                  <NavDropdown title="Job Openings" id="basic-nav-dropdown" className="menu-item-text">                    
                    <NavDropdown.Item as={Link} to="manage_openings/add" className="menu-item-text">
                      Add Opening
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="manage_openings/view" className="menu-item-text">
                      View|Edit|Delete Opening
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="manage_openings/employee-opening_matchings" className="menu-item-text">
                      Match Employees To Openings
                    </NavDropdown.Item>
                    
                    {/* Add other menu items as needed */}
                  </NavDropdown>
                
                  <Nav.Link onClick={handleLogout} className="menu-item-text">SignOut</Nav.Link>

                </Nav>
              </Navbar.Collapse>
            </Navbar>
        </div>

        <div className="container mt-4">
          <div className="row justify-content-center">
              <Routes>
                <Route path="manage_employees/add" element={<AddEmployeeForm />} />
                <Route path="manage_employees/edit/:employee_id" element={<EditEmployeeForm />} />
                <Route path="manage_employees/delete/:selectedEntity/:employee_id" element={<DeleteFormComponent />} />
                <Route path="manage_employees/view" element={<ViewEmployees />} />
             
                <Route path="manage_openings/add" element={<AddOpeningForm />} />
                <Route path="manage_openings/edit/:opening_id" element={<EditOpeningForm />} />
                <Route path="manage_openings/delete/:selectedEntity/:opening_id" element={<DeleteFormComponent />} />
                <Route path="manage_openings/view" element={<ViewOpenings />} />
                <Route path="manage_openings/employee-opening_matchings" element={<MatchEmployeesToOpenings />} />


                {/* Add other routes for other menu items as needed */}
              </Routes>
          </div>
        </div>
      </div>
  );
};

export default HRMComponent;
