const Modal = ({ children, onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;