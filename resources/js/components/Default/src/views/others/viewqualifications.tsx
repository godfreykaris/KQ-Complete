import React from "react";
import { Modal, Button } from "react-bootstrap";

interface qualification{
  name: string
}

interface qualificationProp{
  showQualificationsModal: boolean;
  handleCloseModal: () => void;
  Qualifications: qualification[];
}

const Qualifications: React.FC<qualificationProp> = ({showQualificationsModal, handleCloseModal, Qualifications}) => {


  return (
    <Modal show={showQualificationsModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Qualifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {Qualifications.length > 0 ? (
            Qualifications.map((item: qualification, index: number) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>                
            ))
        ) : (
            <p className="text-center"><b>No Qualifications information provided. Contact support for further help </b></p>
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

export default Qualifications;