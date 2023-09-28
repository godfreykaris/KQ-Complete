import React from "react";
import { Modal, Button } from "react-bootstrap";

interface skill{
  name: string
}

interface skillProp{
  showSkillsModal: boolean;
  handleCloseModal: () => void;
  skillsArray: skill[];
}

const Skills: React.FC<skillProp> = ({showSkillsModal, handleCloseModal, skillsArray}) => {

  return (
    <Modal show={showSkillsModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Skills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {skillsArray.length > 0 ? (
            skillsArray.map((item: skill, index: number) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>                
            ))
        ) : (
            <p className="text-center"><b>No skills information provided. Contact support for further help </b></p>
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

export default Skills;