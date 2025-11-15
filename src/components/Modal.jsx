import React from "react";
import { Modal as BsModal } from "react-bootstrap";

const Modal = ({ show, title, children, onClose, footer }) => {
  return (
    <BsModal show={show} onHide={onClose} centered backdrop="static">
      <BsModal.Header closeButton>
        <BsModal.Title>{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
      {footer && <BsModal.Footer>{footer}</BsModal.Footer>}
    </BsModal>
  );
};

export default Modal;
