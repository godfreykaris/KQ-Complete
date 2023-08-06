import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MenuBar1 from "../../components/menubars/menubar1";
import "./about.css"

export default function About() {
  return (
    <div className="about-page body">
      <MenuBar1/>
      <Container>
        <Row>
          <Col>
            <h1 className="mt-5">About KQ Airline</h1>
            <p>
              Welcome to KQ Airline! We are a leading airline dedicated to providing excellent flight experiences
              and world-class services to our passengers. With a legacy of serving the skies for decades, we take
              pride in being the first choice for millions of travelers worldwide.
            </p>
            <p>
              Our fleet of modern aircraft, well-trained crew, and state-of-the-art facilities ensure that your journey
              with us is comfortable, safe, and memorable. Whether you are traveling for business or leisure, we strive
              to make your flight experience seamless and enjoyable.
            </p>
            <h2>Our Mission</h2>
            <p>
              At KQ Airline, our mission is to connect people, cultures, and experiences through air travel. We are
              committed to delivering reliable, efficient, and sustainable air transport services while prioritizing
              the safety and well-being of our passengers and employees.
            </p>
            <h2>Our Vision</h2>
            <p>
              Our vision is to be the leading airline in the industry, known for excellence in service, innovation, and
              customer satisfaction. We aim to set new standards for the aviation industry and remain dedicated to making
              air travel accessible and enjoyable for everyone.
            </p>
            <h2>Core Values</h2>
            <ul>
              <li>Safety First: We prioritize the safety of our passengers and crew above all else.</li>
              <li>Customer-Centric: Our passengers are at the heart of everything we do.</li>
              <li>Integrity: We uphold the highest ethical standards in all our operations.</li>
              <li>Innovation: We embrace innovation to improve our services and operations continuously.</li>
              <li>Environmental Responsibility: We are committed to sustainable practices for a greener future.</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}