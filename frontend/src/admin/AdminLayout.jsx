import React, { useState, useRef } from 'react';
import Sidebar from '../admin/components/Sidebar.jsx';
import ToastContainer from '../admin/components/ToastContainer.jsx';
import Topbar from '../admin/components/Topbar.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import { EventModal } from "../admin/pages/Events"
import { UserModal } from "../admin/pages/Users"
import "../admin/AdminDashboard.css"

// Main App Component
export default function EventManagementAdmin() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState({
    userModal: false,
    eventModal: false,
    uploadModal: false
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(0);



  const sampleData = [
    { category: 'Events', title: 'Summer Music Festival' },
    { category: 'Events', title: 'Tech Conference 2025' },
    { category: 'Users', title: 'John Doe' },
    { category: 'Users', title: 'Jane Smith' },
    { category: 'Bookings', title: '#BK-10234' }
  ];

  const filteredData = sampleData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const openModal = (modalName,payload=null) => {
    if (modalName === "eventModal") {
    setSelectedEvent(payload); 
    setSelectedUser(null); 
  }
  if (modalName === "userModal") {
    setSelectedUser(payload); 
    setSelectedEvent(null); 
    console.log("Selected User:", payload);
  }

    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    if (modalName === "eventModal") {
    setSelectedEvent(null);
    }
    if (modalName === "userModal") {
      setSelectedUser(null);
    } 
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    const titles = {
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'users': 'Users',
      'events': 'Events',
      'calendar': 'Calendar',
      'kanban': 'Kanban',
      'bookings': 'Bookings',
      'media': 'Media',
      'activity': 'Activity',
      'admin': 'Dashboard' // default for /admin
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <div style={{ fontFamily: "'Archivo', -apple-system, sans-serif", background: '#0a0b0d', color: '#e8eaed', minHeight: '100vh' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        
        <main style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}>
          <Topbar 
            pageTitle={getPageTitle()}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showAutocomplete={showAutocomplete}
            setShowAutocomplete={setShowAutocomplete}
            filteredData={filteredData}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
          
          <NotificationPanel show={showNotifications} />
          
          <ToastContainer toasts={toasts} setToasts={setToasts} />
          
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <Outlet context={{ 
              // selectedRows, 
              // setSelectedRows,
              openModal,
              showToast,
              selectedEvent,
              setSelectedEvent,
              refresh,
              setRefresh,
              selectedUser,
              setSelectedUser
            }} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserModal show={modals.userModal} onClose={() => closeModal('userModal')} showToast={showToast} selectedUser={selectedUser} />
      <EventModal show={modals.eventModal} onClose={() => closeModal('eventModal')} showToast={showToast} selectedEvent={selectedEvent} setRefresh={setRefresh} refresh={refresh} />
      <UploadModal show={modals.uploadModal} onClose={() => closeModal('uploadModal')} showToast={showToast} setRefresh={setRefresh} refresh={refresh} />
    </div>
  );
}

// Notification Panel Component
function NotificationPanel({ show }) {
  if (!show) return null;

  const notifications = [
    { id: 1, avatar: '🎫', message: 'New booking for Summer Music Festival', user: 'New booking', time: '2 minutes ago', unread: true },
    { id: 2, avatar: '👤', message: 'Sarah Wilson registered', user: 'Sarah Wilson', time: '15 minutes ago', unread: true }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '72px',
      right: '32px',
      width: '380px',
      background: '#141619',
      border: '1px solid #252830',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      maxHeight: '500px',
      overflowY: 'auto',
      zIndex: 100,
      animation: 'slideDown 0.3s'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #252830',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>Notifications</h3>
        <button style={{
          padding: '6px 12px',
          fontSize: '12px',
          background: '#0a0b0d',
          color: '#e8eaed',
          border: '1px solid #252830',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Mark all read
        </button>
      </div>
      
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #252830',
            cursor: 'pointer',
            background: notif.unread ? 'rgba(0, 255, 148, 0.05)' : 'transparent'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ff2c5533',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {notif.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>{notif.user}</strong> {notif.message.replace(notif.user, '')}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{notif.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reusable Components
export function StatCard({ label, value, change, positive, icon, color }) {
  return (
    <div style={{
      background: '#141619',
      border: '1px solid #252830',
      borderRadius: '12px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#252830';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: color
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#9ca3af',
          fontWeight: 600
        }}>
          {label}
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: `${color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {icon}
        </div>
      </div>
      <div style={{
        fontSize: '36px',
        fontWeight: 700,
        marginBottom: '8px',
        letterSpacing: '-1px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: positive ? '#ff2c55' : '#ff3366'
      }}>
        {change}
      </div>
    </div>
  );
}

export function Button({ children, primary, secondary, danger, onClick }) {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };

  const variantStyle = primary
    ? { background: '#ff2c55', color: '#0a0b0d' }
    : secondary
    ? { background: '#0a0b0d', color: '#e8eaed', border: '1px solid #252830' }
    : danger
    ? { background: '#ff3366', color: 'white' }
    : {};

  return (
    <button
      style={{ ...baseStyle, ...variantStyle }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (primary) e.currentTarget.style.background = '#00dd7f';
        else if (secondary) e.currentTarget.style.background = '#1a1d21';
        else if (danger) e.currentTarget.style.background = '#ff1a4d';
      }}
      onMouseLeave={(e) => {
        if (primary) e.currentTarget.style.background = '#ff2c55';
        else if (secondary) e.currentTarget.style.background = '#0a0b0d';
        else if (danger) e.currentTarget.style.background = '#ff3366';
      }}
    >
      {children}
    </button>
  );
}

export const filterStyle = {
  padding: '8px 12px',
  background: '#0a0b0d',
  border: '1px solid #252830',
  borderRadius: '6px',
  color: '#e8eaed',
  fontSize: '14px',
  minWidth: '150px',
  outline: 'none'
};

export function StatusBadge({ status }) {
  const styles = {
    Active: {  color: '#ff2c55' },
    Pending: { background: 'rgba(255, 184, 0, 0.15)', color: '#ffb800' },
    Planning: { background: 'rgba(255, 184, 0, 0.15)', color: '#ffb800' },
    Inactive: { background: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af' },
    Done: { background: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af' },
    Confirmed: { background: 'rgba(0, 255, 148, 0.15)', color: '#ff2c55' },
    Approved: { background: 'rgba(0, 255, 148, 0.15)', color: '#ff2c55' }
  };

  const style = styles[status] || styles.Inactive;

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      ...style
    }}>
      {status}
    </span>
  );
}

export function ActionButton({ children, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        border: '1px solid #252830',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#ff2c55';
        e.currentTarget.style.background = '#ff2c55';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#252830';
        e.currentTarget.style.background = 'white';
      }}
    >
      {children}
    </button>
  );
}

// Modal Components


function UploadModal({ show, onClose, showToast }) {
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleUpload = () => {
    onClose();
    showToast('Files uploaded successfully!', 'success');
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: '24px', borderBottom: '1px solid #252830', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Upload Media</h3>
        <button onClick={onClose} style={modalCloseStyle}>×</button>
      </div>
      <div style={{ padding: '24px' }}>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #252830',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff2c55';
            e.currentTarget.style.background = '#ff2c5533';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#252830';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <div style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }}>📁</div>
          <div style={{ marginBottom: '8px', fontWeight: 600 }}>Drop files here or click to browse</div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>Supported: JPG, PNG, GIF, MP4 (Max 10MB)</div>
          <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} />
        </div>
      </div>
      <div style={{ padding: '24px', borderTop: '1px solid #252830', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button secondary onClick={onClose}>Cancel</Button>
        <Button primary onClick={handleUpload}>Upload</Button>
      </div>
    </ModalOverlay>
  );
}

export function ModalOverlay({ children, onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s'
      }}
    >
      <div className="hide-scrollbar" style={{
        background: '#141619',
        border: '1px solid #252830',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s',
        scrollbarWidth: 'none',               
        msOverflowStyle: 'none' 
      }}>
        {children}
      </div>
    </div>
  );
}

export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#e8eaed'
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Styles
export const tableHeaderStyle = {
  padding: '16px 24px',
  textAlign: 'left',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#9ca3af',
  fontWeight: 600,
  borderBottom: '1px solid #252830',
  cursor: 'pointer',
  userSelect: 'none'
};

export const tableCellStyle = {
  padding: '16px 24px',
  borderBottom: '1px solid #252830'
};



export const formInputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: '#0a0b0d',
  border: '1px solid #252830',
  borderRadius: '8px',
  color: '#e8eaed',
  fontSize: '14px',
  outline: 'none'
};

export const modalCloseStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  border: 'none',
  background: '#0a0b0d',
  color: '#e8eaed',
  cursor: 'pointer',
  fontSize: '20px',
  transition: 'all 0.2s'
};