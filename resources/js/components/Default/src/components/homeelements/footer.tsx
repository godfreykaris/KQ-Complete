import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
//import "/resources/components/js/Default/src/views/others/dashboard-image.css";
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-5 d-flex justify-content-center">
      <Container>
        <Row>
          {/* Information */}
          <Col md={3} className="mb-2">
            <hr/>
            <h5>Information</h5>
            <hr/>
            <ul className="footer-links list-unstyled" style={{textDecoration: 'none'}}>
              <li><a href='/about' className="text-primary" style={{textDecoration: 'none'}}>About Us</a></li>
              <li><a href='#' className="text-primary" style={{textDecoration: 'none'}}>Refunds</a></li>
              <li><a href='#' className="text-primary" style={{textDecoration: 'none'}}>KQ-Cargo</a></li>
              <li><a href='#' className="text-primary" style={{textDecoration: 'none'}}>FAQs</a></li>
            </ul>
          </Col>
          
          {/* Contact Us */}
          <Col md={3}>
            <hr/>
            <h5>Contact Us</h5>
            <hr/>
            <ul className='list-unstyled '>
              <li>Email: <a href="mailto:info@example.com" className="text-primary" style={{textDecoration: 'none'}}>info@example.com</a></li>
              <li>Phone: <a href="tel:022341234" className="text-primary" style={{textDecoration: 'none'}}>022341234</a></li>
              <p className="text-white">Address: 123 Main Street, Nairobi, Kenya</p>
            </ul>
          </Col>
          {/* Quick Links */}
          <Col md={3}>
            <hr/>
            <h5>Quick Links</h5>
            <hr/>
            <ul className="footer-links list-unstyled">
              <li><a href="/" className="text-primary" style={{textDecoration: 'none'}}>Home</a></li>
              <li><a href="/searchflight" className="text-primary" style={{textDecoration: 'none'}}>Flights</a></li>
              <li><a href="/bookflight" className="text-primary" style={{textDecoration: 'none'}}>Booking</a></li>
              <li><a href="/viewopenings" className="text-primary" style={{textDecoration: 'none'}}>View Openings</a></li>
            </ul>
          </Col>
          {/* Follow Us group */}
          <Col md={12} className="text-center">
            <h5>Follow Us</h5>
            <ul className="footer-links d-flex list-unstyled justify-content-center">
              <li className="mr-3"><a href="https://www.facebook.com/officialkenyaairways/" className="text-primary"><FontAwesomeIcon icon={faFacebook} size="2x"/> </a></li>
              <li className="mr-3"><a href="https://www.instagram.com/officialkenyaairways/" className="text-primary"><FontAwesomeIcon icon={faInstagram} size="2x"/></a></li>
              <li className="mr-3"><a href="https://www.tweeter.com/officialkenyaairways/" className="text-primary"><FontAwesomeIcon icon={faTwitter} size="2x"/> </a></li>
              <li><a href="/contact" className="text-primary"><FontAwesomeIcon icon={faSnapchat} size="2x"/></a></li>
            </ul>
          </Col>
        </Row>

        {/* Copyright area */}
        <Row>
          <Col md={12} className="text-center">
            <p className="text-light">&copy; 2023 KQ. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
