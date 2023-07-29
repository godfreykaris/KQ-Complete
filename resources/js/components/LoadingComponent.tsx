import React from "react";
import { Button, Spinner } from "react-bootstrap";

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      
      <Button variant="info" disabled>
        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
        Loading...
      </Button>
    </div>
  );
};

export default LoadingComponent;
