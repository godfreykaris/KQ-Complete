import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Popup({show, handleClose}) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header className="modal-title mx-auto">
            <Modal.Title>The Pride of Africa!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
            <p>Fly with KQ!</p>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column">
            <Link to="/signin">
                <Button variant='primary'  className="mb-2">Sign In</Button>
            </Link>
            <Link to="/signup">
                <Button variant='primary'  className="mb-2">Sign Up</Button>
            </Link>
            <Link to="/dashboard">
                <Button variant='primary'  className="mb-2">Continue as Guest</Button>
            </Link>           
        </Modal.Footer>
    </Modal>
  )
}
