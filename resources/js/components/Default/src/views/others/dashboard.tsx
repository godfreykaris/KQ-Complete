import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import MenuBar2 from "../../components/menubars/menubar2";
import Footer from "../../components/homeelements/footer";
import Cards from "../../components/homeelements/cards";
import "./dashboard-image.css";
import "bootstrap/dist/css/bootstrap.min.css";
import hostessImage from "../../../public/hostess.jpg";


export default function Dashboard() {
  return (
    <div className="dashboard-fade-in">
      <MenuBar1 isAuthenticated={false} />
      <hr />
      <br/>
      <br/>
      <MenuBar2/>
      <div
        className="dashboard-background"
        style={{
          backgroundImage: `url(${hostessImage})`,
          marginTop: '8px',
        }}
      >
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <div className="custom-caption">
                <h3>Welcome to KQ Airlines</h3>
                <p>Enjoy a seamless travel experience with us.</p>
                <Link to="/bookflight">
                  <Button variant="primary">Book a Flight</Button>
                </Link>
              </div>

              <div className="custom-caption">
              <h3>Relax in Comfort</h3>
                  <p>Choose your preferred seat and travel in style.</p>
                  <Link to="/searchflight">
                    <Button variant="primary">View Seat Options</Button>
                  </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <hr />
      <Cards />
      <hr />
      <Footer />
    </div>
  );
}
