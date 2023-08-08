import React from "react";
import { Card, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaPlaneDeparture } from "react-icons/fa";
import './cards.css';

import tokyoImage from "../../../public/tokyo.jpg";
import newYorkImage from "../../../public/new-york.jpg";
import beijingImage from "../../../public/beijing.jpg";
import dubaiImage from "../../../public/dubai.jpg";
import rioImage from "../../../public/rio.jpg";
import searchGif from "../../../public/search.gif";
import pamplonaImage from "../../../public/pamplona.avif";
import welcomeGif from "../../../public/welcome.gif";

interface Partner {
  amenity: string;
  link: string;
}

export default function Cards() {
  const navigate = useNavigate();
  const navigate1 = useNavigate();

  const handleRedirectToSignup = () => {
    navigate("/signup");
  };

  const handleBookNow = (destination: string) => {
    // Redirect to the booking page with the selected destination
    navigate(`/bookflight`);
  };

  //before landing preparations
  const beforeLanding: Partner[] = [
    { amenity: "Book Cab", link: "https://www.uber.com/ke/en/" },
    { amenity: "View Hotels", link: "https://www.booking.com/city/ke/nairobi.en/" },
    { amenity: "Recreation", link: "https://www.tripadvisor.com/Attractions-g294207-Activities-c57-t70-Nairobi.html" },
  ];

  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  const handlePartnerButtonClick = (amenity: string, link: string) => {
    setSelectedPartner(amenity);
    window.location.href = link;
  }


  const handleBeforeLanding = (amenityName: string) => {
    // navigate to cab, hotels, and other recreational center sites
  };
  

  //travel offers
  const travelOffers = [
    "Up to 50% off on international flights",
    "Free lounge access on select routes",
    "Priority boarding for members",
    "Complimentary upgrades on first-class bookings",
    "Special discounts on hotel and car rentals",
  ];

  //search flight
  const handleRedirectToSearchFlight = () => {
    navigate1("/searchflight");
  };

  return (
    <div className="cards-container">
      <Row className="justify-content-center">
        <Card border="primary" style={{ width: "50rem" }}>
          <Card.Header className="bg-primary text-white font-weight-bold" >Featured Destinations</Card.Header>
          <Card.Body>
            <Card.Title>Discover New Places</Card.Title>            

            {/* Nested Cards */}
            <Row className="mt-3">
              <Col>
                <Card>
                  <Card.Img variant="top" src={tokyoImage} alt="Tokyo" />
                  <Card.Body>
                    <Card.Title>Tokyo</Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("Tokyo")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Img variant="top" src={pamplonaImage} alt="Pamplona" />
                  <Card.Body>
                    <Card.Title>Pamplona</Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("Pamplona")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col>
                <Card>
                  <Card.Img variant="top" src={rioImage} alt="Rio" />
                  <Card.Body>
                    <Card.Title>Rio</Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("Rio")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <hr/>
              <Col>
                <Card>
                  <Card.Img variant="top" src={dubaiImage} alt="Dubai" />
                  <Card.Body>
                    <Card.Title>Dubai</Card.Title>
                    <Card.Text>
                   
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("Dubai")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
             
              <Col>
                <Card>
                  <Card.Img variant="top" src={newYorkImage} alt="New York" />
                  <Card.Body>
                    <Card.Title>New York</Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("New York")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Img variant="top" src={beijingImage} alt="Beijing" />
                  <Card.Body>
                    <Card.Title>Beijing</Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                    <Button
                      onClick={() => handleBookNow("Beijing")}
                      variant="primary"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              {/* Add more nested cards here */}
            </Row>
            {/* End of Nested Cards */}
          </Card.Body>
        </Card>
        <hr />

        <Card border="primary" style={{ width: "25rem" }}>
          <Card.Header className="bg-primary text-white font-weight-bold">Sign Up for membership benefits!</Card.Header>
          <Card.Body>
            <Card.Title>Discover the advantages!</Card.Title>
            <ListGroup variant="flush">
                <ListGroup.Item>
                  <FaPlane className="mr-2" />
                  View your booking history
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaPlane className="mr-2" />
                  Earn reward points for discounts
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaPlane className="mr-2" />
                  Accumulate points for future benefits
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaPlane className="mr-2" />
                  Store data for seamless bookings
                </ListGroup.Item>
            </ListGroup>
            <Card.Img variant="top" src={welcomeGif} alt="Welcome" style={{ height: "200px" }}/>
            <hr/>
            <button
              onClick={handleRedirectToSignup}
              type="button"
              className="btn btn-primary"
            >
              Join KQ!
            </button>
          </Card.Body>
        </Card>

        <Card border="primary" style={{ width: "25rem" }}>
            <Card.Header className="bg-primary text-white font-weight-bold">
              Make Plans!
            </Card.Header>
            <Card.Body>
              <Card.Title>Search a Flight</Card.Title>
              <Card.Img variant="top" src={searchGif} alt="Search GIF"/>
              <button
                onClick={handleRedirectToSearchFlight}
                type="button"
                className="btn btn-primary"
              >
                Search Flight
              </button>
            </Card.Body>
        </Card>

        <Card border="primary" style={{ width: "25rem" }}>
          <Card.Header className="bg-primary text-white font-weight-bold">Make Preparations Before Landing</Card.Header>
          <Card.Body>
            <Card.Title className="mb-4">View Some of Our Travel Partners</Card.Title>
            <Card.Text className="text-muted">Here, you will get the best discounts!</Card.Text>
            {beforeLanding.map((partner, index) => (
                <div key={index} className="mb-2">
                    <Button
                      variant="outline-primary"
                      onClick={() => handlePartnerButtonClick(partner.amenity, partner.link)}
                    >
                      {partner.amenity}
                    </Button>
                </div>
            ))}
          </Card.Body>
        </Card>
        <hr />

        <Card border="primary" style={{ width: "25rem" }}>
            <Card.Header className="bg-primary text-white font-weight-bold">
            <FaPlaneDeparture className="mr-2" />
                Exclusive Travel Offers
            </Card.Header>
            <Card.Body>
              <Card.Title>Unlock Your Travel Benefits</Card.Title>
              <ListGroup variant="flush">
                {travelOffers.map((offer, index) => (
                  <ListGroup.Item key={index}>
                    <FaPlaneDeparture className="mr-2" />
                    {offer}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button 
                variant="primary" 
                className="mt-3"
                onClick={handleRedirectToSignup}
                >
                Join Now
              </Button>
            </Card.Body>
        </Card>

        <Card border="primary" style={{ width: "25rem" }}>
          <Card.Header className="bg-primary text-white font-weight-bold">
            In-Flight Services
          </Card.Header>
          <Card.Body>
            <Card.Title className="mb-4">Comfort and Convenience</Card.Title>
            <Card.Text className="text-muted">
              Enjoy our world-class in-flight services, including premium
              meals, internet, entertainment, and personalized amenities to make your
              journey even more comfortable.
            </Card.Text>
          </Card.Body>
        </Card>
        <hr />
      </Row>
    </div>
  );
}
