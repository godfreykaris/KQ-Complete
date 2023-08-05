import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import Footer from "../../components/homeelements/footer";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import Cards from "../../components/homeelements/cards";
import "./dashboard-image.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";

export default function Dashboard() {
  return (
    <div style={{ backgroundColor: "-moz-initial" }}>
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
          <Col md={8} className="mx-auto">
            <Carousel fade interval={1000}>
              <Carousel.Item>
                <img
                  className="d-block w-100 image-container carousel-image"
                  src="/hostess.jpg"
                  alt="Dashboard Image 1"
                />
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
