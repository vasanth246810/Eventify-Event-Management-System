import 'bootstrap/dist/css/bootstrap.min.css';

export default function PopupGfg({ isPopupOpen, onClose, onGoLogin }) {

  if (!isPopupOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-4"
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-white rounded-4 w-100"
        style={{
          maxWidth: "28rem",
          overflow: "hidden",
          boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)"
        }}
      >
        
        {/* Header */}
        <div
          className="px-4 py-5 text-center text-white position-relative"
          style={{ background: "#000" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-close btn-close-white position-absolute"
            style={{ top: "1rem", right: "1rem" }}
          ></button>

          <h3 className="fw-bold mb-2">Login Required</h3>
          <p className="opacity-75">Please log in to book tickets.</p>
        </div>

        {/* Buttons */}
        <div className="p-4">
          <button
            type="button"
            onClick={onGoLogin}
            className="btn btn-dark w-100 py-3 mb-3"
          >
            Go to Login
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-light w-100 py-2"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
