import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function Skills({showSkillsModal, handleCloseModal, skillsArray}) {


  return (
    <Modal show={showSkillsModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Skills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {skillsArray > 0 ? (
            skillsArray.map((item, index) => (
                <div key={index}>
                    <p>{item}</p>
                </div>                
            ))
        ) : (
            <p className="text-danger"><b>No skills information provided. Contact support for further help </b></p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}