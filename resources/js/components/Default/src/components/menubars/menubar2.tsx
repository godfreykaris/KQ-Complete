import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './menubar2.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const menuItems = [
  { label: 'Booking', link: '/booking', dropdown: true, items: [
    { label: 'Book Flight', link: '/bookflight' },
    { label: 'Change Booking', link: '/changebooking' },
    { label: 'Delete Booking', link: '/deletebooking' },
  ]},
  { label: 'Inquiry', link: '/inquiry', dropdown: true, items: [
    { label: 'Add Booking', link: '/addbookinginquiry' },
    { label: 'Change Booking', link: '/changebookinginquiry' },
    { label: 'Delete Booking', link: '/deletebookinginquiry' },
  ]},
  { label: 'Travellers', link: '/travellers', dropdown: true, items: [
    { label: 'Add Passenger', link: '/addpassenger' },
    { label: 'Change Passenger', link: '/changepassenger' },
    { label: 'Delete Passenger', link: '/deletepassenger' },
  ]},
  {label: 'Print Ticket', link:'/printticket'},
];

function useDropdownState() {
  
  const [dropdownState, setDropdownState] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (dropdownName: any) => {

    //setDropdownState((prevState) => ({
    setDropdownState((prevState: any) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  return { dropdownState, toggleDropdown };
}

export default function MenuBar2() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const { dropdownState, toggleDropdown } = useDropdownState();

  //listen for any clicks out of the dropdown
  useEffect(() => {
    const closeDropdownsOnOutsideClick = (event: Event) => {
      const clickedElement = event.target as HTMLElement;
      const dropdowns = document.querySelectorAll('dropdown-menu-custom');

      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(clickedElement)) 
        {
          // Close the dropdown if it's open
          toggleDropdown(dropdown.getAttribute('data-link'));
        }
      });
    };

    // Attach the click listener to the Navbar component
    const navbar = document.querySelector('.navbar');

    if(navbar)
        navbar.addEventListener('click', closeDropdownsOnOutsideClick);

    // Clean up the event listener on component unmount
    return () => {
      if(navbar)
          navbar.removeEventListener('click', closeDropdownsOnOutsideClick);
    };
  }, [toggleDropdown]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>
            <h3 className='text-glow'>The Pride of Africa|</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleNavbar} />
        <Navbar.Collapse id="responsive-navbar-nav" className={collapsed ? 'collapse' : ''}>
          <Nav className="mr-auto">
            {menuItems.map((item , index) => (
              <React.Fragment key={index}>
                {item.dropdown ? (
                  <NavDropdown
                    title={item.label}
                    id={`navbarDropdown-${index}`}
                    show={dropdownState[item.link]}
                    onClick={() => toggleDropdown(item.link)}
                    data-link={item.link}
                  >
                    <div className='dropdown-menu-custom'>
                    {item.items.map((subItem, subIndex) => (
                      <NavDropdown.Item key={subIndex} as={Link} to={subItem.link} >
                        {subItem.label}
                      </NavDropdown.Item>
                    ))}
                    </div>
                  </NavDropdown>
                ) : (

                  <Nav.Link key={index} as={Link} to={item.link}>
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
