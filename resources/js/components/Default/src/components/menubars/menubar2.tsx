import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './menubar2.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const menuItems = [
  {
    label: 'Booking',
    link: '/booking',
    dropdown: true,
    items: [
      { label: 'Book Flight', link: '/bookflight' },
      { label: 'Change Booking', link: '/changebooking' },
      { label: 'Delete Booking', link: '/deletebooking' },
    ],
  },
  {
    label: 'Passengers',
    link: '/passengers',
    dropdown: true,
    items: [
      { label: 'Add Passenger', link: '/addpassenger' },
      { label: 'Change Passenger', link: '/changepassenger' },
      { label: 'Delete Passenger', link: '/deletepassenger' },
    ],
  },
  { label: 'Inquiry', link: '/inquiries' },
  { label: 'Print Ticket', link: '/printticket' },
];

export default function MenuBar2() {
  const [collapsed, setCollapsed] = useState(true);
  const [dropdownState, setDropdownState] = useState<{ [key: string]: boolean }>({});

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDropdown = (dropdownName: string) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  return (
    <Navbar id="myNavBar" collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>
          <h3 className='text-glow'>The Pride of Africa|</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleNavbar} />
        <Navbar.Collapse id="responsive-navbar-nav" className={collapsed ? 'collapse' : ''}>
          <Nav className="mr-auto">
            {menuItems.map((item) => (
              <React.Fragment key={item.link}>
                {item.dropdown ? (
                  <NavDropdown
                    title={item.label}
                    id={`navbarDropdown-${item.link}`}
                    show={!!dropdownState[item.link]}
                    onMouseEnter={() => toggleDropdown(item.link)}
                    onMouseLeave={() => toggleDropdown(item.link)}
                  >
                    <div className='dropdown-menu-custom'>
                      {item.items.map((subItem) => (
                        <NavDropdown.Item key={subItem.link} as={Link} to={subItem.link}>
                          {subItem.label}
                        </NavDropdown.Item>
                      ))}
                    </div>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to={item.link}>
                    {item.label}
                  </Nav.Link>
                )}
              </React.Fragment>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
