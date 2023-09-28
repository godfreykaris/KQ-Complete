import React, { useState } from "react"
import { Alert, Button, Col, Container, Row, Table, Spinner } from "react-bootstrap"
import MenuBar1 from "../../components/menubars/menubar1"
import MenuBar2 from "../../components/menubars/menubar2"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import apiBaseUrl from "../../../../../config";

import Skills from "./viewskills";
import Qualifications from "./viewqualifications.js";
import LoadingComponent from "../../../../Common/LoadingComponent";

interface skill{
  name: string
}

interface qualification{
  name: string;
}


interface opening{
  title: string;
  description: string;
  skills: skill[];
  qualifications: qualification[];
}


export default function ViewOpenings() {

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showQualificationsModal, setShowQualificationsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<opening | {title: '', description: '', skills: [], qualifications: []}>({title: '', description: '', skills: [], qualifications: []});

  const handleViewSkills = (item: opening) => {
    setSelectedItem(item);
    setShowSkillsModal(true);
  };

  const handleViewQualifications = (item: opening) => {
    setSelectedItem(item);
    setShowQualificationsModal(true);
  }

  const handleShowInterest = () => {
    navigate("/inquiries");
  };

  //fetch data as soon as the component renders and store it in the tableData array
  useEffect(() => {
    const API_URL = `${apiBaseUrl}/openings`;
    const fetchData = () => {
      fetch(API_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setTableData(data.openings);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };

    const timeoutId = setTimeout(() => {
      if(loading){
        setError("Unable to fetch data. Please try again later");
        setLoading(false);
      }
    }, 60000);

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading]);


  return (
    <div>
      <MenuBar1 isAuthenticated={false} />
      <br />
      <br />
      <br />
      <MenuBar2 />
      <Container className="mt-10">
        <Row className="mt-4">
          <Col>
            <h3 className="text-center">These are the available openings</h3>
            <div className="table-responsive table-container">
              {loading ? (
                <LoadingComponent/>
              ) : tableData.length === 0 ? (
                <Alert variant="warning">There are no Openings at the moment</Alert>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Skills</th>
                      <th>Qualifications</th>
                      <th>Show Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item: opening, index: number) => (
                      <tr key={index}>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>
                          <Button onClick={() => handleViewSkills(item)} variant="primary" type="button">
                            Skills
                          </Button>
                        </td>
                        <td>
                          <Button onClick={() => handleViewQualifications(item)} variant="primary" type="button">
                            Qualifications
                          </Button>
                        </td>
                        <td>
                          <Button onClick={handleShowInterest} variant="primary" type="button">
                            Go
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            {/*render the skills and qualifications modals*/}
            <Skills
              showSkillsModal={showSkillsModal}
              handleCloseModal={() => setShowSkillsModal(false)}
              skillsArray={selectedItem && selectedItem.skills}
            />

            <Qualifications
              showQualificationsModal={showQualificationsModal}
              handleCloseModal={() => setShowQualificationsModal(false)}
              Qualifications={selectedItem && selectedItem.qualifications}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}