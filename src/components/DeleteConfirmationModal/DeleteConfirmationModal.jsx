import closeIcon from "../../assets/icons/close-icon.svg";
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal_is-opened" onClick={onCancel}>
      <div
        className="modal__content modal-confirm__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onCancel}>
          <img src={closeIcon} alt="Close" />
        </button>
        <h3 className="modal__message">
          Are you sure you want to delete this item?
          <br />
          This action is irreversible
        </h3>
        <div className="modal__actions">
          <button className="modal__action-delete" onClick={onConfirm}>
            Yes, delete item
          </button>
          <button className="modal__action-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
