import React from 'react';
import {Modal} from 'react-bootstrap';

function MyModal(props) {
  
    return (

  
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.component}</Modal.Body>
        </Modal>
    );
  }

  export default MyModal;