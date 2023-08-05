import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

const menuItems = [
  { label: 'Home', link: '/' },
  { label: 'Contact', link: '/contact' },
  { label: 'About', link: '/about' },
];

export default function MenuBar1({ isAuthenticated }) {
  const AuthenticatedMenuBar = () => (
      <div>
        {/* Add any additional menu items for authenticated users */}
        <Nav className="ml-auto">
        <Nav.Link as={Link} to="/profile">
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/logout">
          Logout
        </Nav.Link>
      </Nav>
      </div>   
  
  );

  const GuestMenuBar = () => (
    <div>      
      <Nav className="ml-auto"> {/* Use className="ml-auto" to align right */}
        <Nav.Link as={Link} to="/signin">
          Sign In
        </Nav.Link>
        <Nav.Link as={Link} to="/signup">
          Sign Up
        </Nav.Link>      
      </Nav>
    </div>
  );

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href='/'>          
            <b>KQ|</b>                  
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {menuItems.map((item, index) => (
          <Nav.Link key={index} as={Link} to={item.link}>
            {item.label}
          </Nav.Link>
         ))}
        </Nav>
          {/* Conditionally render the appropriate menu bar */}
          {isAuthenticated ? <AuthenticatedMenuBar /> : <GuestMenuBar />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
