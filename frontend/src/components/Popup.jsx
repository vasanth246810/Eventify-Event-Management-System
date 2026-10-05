import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PopupGfg({ isPopupOpen, onClose, onGoLogin }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen, onClose]);

  if (!isPopupOpen) return null;

  const modalContent = (
    <>
      <style>
        {`
          @keyframes eventifyModalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes eventifyModalScaleUp {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(16px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .eventify-login-btn:hover {
            background-color: #e02449 !important;
            transform: translateY(-1px);
          }
          .eventify-cancel-btn:hover {
            border-color: rgba(255, 255, 255, 0.25) !important;
            color: #ffffff !important;
            background: rgba(255, 255, 255, 0.05) !important;
          }
        `}
      </style>

      <div
        className="eventify-popup-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-popup-title"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(5, 7, 12, 0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'eventifyModalFadeIn 0.22s ease-out',
        }}
      >
        <div
          className="eventify-popup-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#0e1017',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.85), 0 0 45px -10px rgba(255, 44, 85, 0.25)',
            position: 'relative',
            animation: 'eventifyModalScaleUp 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header Section */}
          <div
            style={{
              padding: '36px 30px 24px',
              textAlign: 'center',
              position: 'relative',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              background: 'linear-gradient(180deg, rgba(255, 44, 85, 0.09) 0%, transparent 100%)',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              ✕
            </button>

            {/* Glowing Lock Badge */}
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '16px',
                background: 'rgba(255, 44, 85, 0.12)',
                border: '1px solid rgba(255, 44, 85, 0.35)',
                color: '#ff2c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 8px 24px -4px rgba(255, 44, 85, 0.35)',
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h3
              id="login-popup-title"
              style={{
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.45rem',
                letterSpacing: '-0.025em',
                margin: '0 0 8px',
              }}
            >
              Login Required
            </h3>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.93rem',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Please log in to your account to reserve your tickets and select your preferred seats.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              padding: '24px 30px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={onGoLogin}
              className="eventify-login-btn"
              style={{
                background: '#ff2c55',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 20px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 6px 20px rgba(255, 44, 85, 0.4)',
              }}
            >
              <span>Go to Login</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="eventify-cancel-btn"
              style={{
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
