import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const AppToast = ({ show, message, variant = "success", onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <ToastContainer className="p-3" position="bottom-end">
      <Toast
        onClose={onClose}
        show={show}
        bg={variant}
        autohide
        delay={3000}
        className="text-white"
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AppToast;
