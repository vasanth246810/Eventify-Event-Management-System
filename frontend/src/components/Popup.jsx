import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate, useLocation } from 'react-router-dom';

function PopupGfg({ isPopupOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Popup
      open={isPopupOpen}
      onClose={onClose}
      modal
      position="center center"
    >
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-4" style={{zIndex: 1050}}>
        <div className="bg-white rounded-4 w-100" style={{maxWidth: '28rem', overflow: 'hidden', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'}}>

          {/* Header */}
          <div
            className="px-4 py-5 text-center text-white position-relative"
            style={{
              background: '#000000'
            }}
          >
            <button
              onClick={onClose}
              className="btn-close btn-close-white position-absolute"
              style={{top: '1rem', right: '1rem'}}
            ></button>
            <div className="fs-3 fw-bold mb-2">Login Required</div>
            <div className="small opacity-90">
              Please log in to book tickets for this event.
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="text-center mb-4">
              <p className="text-muted">If you don't have an account yet, we'll create one for you</p>
            </div>

            {/* Login Button */}
            <button
              onClick={() => {
                onClose();
                navigate('/Login', { state: { from: location } });
              }}
              className="btn btn-dark w-100 py-3 mb-4"
            >
              Go to Login
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="btn btn-light w-100 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default PopupGfg;
