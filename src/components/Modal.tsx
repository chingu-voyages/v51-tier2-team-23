// Modal.tsx
import React from "react";
import "../styles/Modal.css"; // Ensure this is correctly set up for any necessary styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Allows any content inside the modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        {children} {/* This is where the GroupForm will be rendered */}
      </div>
    </div>
  );
};

export default Modal;
