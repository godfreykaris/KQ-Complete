import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function Qualifications({showQualificationsModal, handleCloseModal, Qualifications}) {


  return (
    <Modal show={showQualificationsModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Qualifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your seat information here */}
        {Qualifications > 0 ? (
            Qualifications.map((item, index) => (
                <div key={index}>
                    <p>{item}</p>
                </div>                
            ))
        ) : (
            <p className="text-danger"><b>No Qualifications information provided. Contact support for further help </b></p>
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