import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Carousel, Button } from "react-bootstrap";
import Footer from "../../components/homeelements/footer";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import Cards from "../../components/homeelements/cards";
import "./dashboard-image.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";

export default function Dashboard() {
  return (
    <div className="dashboard-fade-in" style={{ backgroundColor: "-moz-initial" }}>
      <MenuBar1 />
      <hr />
      <hr />
      <hr />
      <MenuBar2 />
      <hr />
     <p className="text-center">
        <b className="text-glow">Enjoy The Greatest Experience With KQ!</b>
      </p>
     <Container className="dashboard-body" fluid>
        <Row>
          <Col md={7} className="mx-auto">
            <Carousel fade interval={3000}>
              <Carousel.Item>
                <img
                  className="d-block w-100 image-container carousel-image"
                  src="/hostess.jpg"
                  alt="Dashboard Image 1"
                />
                <Carousel.Caption>
                  <h3>Welcome to KQ Airlines</h3>
                  <p>Enjoy a seamless travel experience with us.</p>
                  <Link to="/bookflight">
                    <Button variant="primary" >Book a Flight</Button>
                  </Link>                  
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 image-container carousel-image"
                  src="/seats.webp"
                  alt="Dashboard Image 2"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 image-container carousel-image"
                  src="/787-8.png"
                  alt="Dashboard Image 3"
                />
              </Carousel.Item>
             <Carousel.Item>
                <img
                  className="d-block w-100 image-container carousel-image"
                  src="/KQ-1.png"
                  alt="Dashboard Image 3"
                />
                <Carousel.Caption>
                  <h3>Relax in Comfort</h3>
                  <p>Choose your preferred seat and travel in style.</p>
                  <Link to="/searchflight">
                    <Button variant="primary">View Seat Options</Button>
                  </Link>                  
                </Carousel.Caption>
              </Carousel.Item>

              {/* Add more Carousel.Items with different images as needed */}
            </Carousel>
          </Col>
        </Row>
      </Container>
     <hr />
     <Cards />
     <hr />
     <Footer />
    </div>  
  );
}
