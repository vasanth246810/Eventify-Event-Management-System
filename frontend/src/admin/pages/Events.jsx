import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, formInputStyle, FormGroup, ModalOverlay, modalCloseStyle, filterStyle, ActionButton, StatusBadge } from "../AdminLayout";
import "../AdminDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineModeEdit, MdOutlineDelete, MdOpenInNew, MdAdd, MdSearch } from "react-icons/md";
import CommonTable from './Commontable';

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchFilter, setSearchFilter] = useState('');

  const outlet = useOutletContext() || {};
  const { openModal = () => {}, refresh, setRefresh = () => {} } = outlet;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/events/`);
        setEvents(response.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [refresh]);

  const handleDelete = async (event_id, event_title) => {
    if (!window.confirm(`Are you sure you want to delete event "${event_title || event_id}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/DeleteEvent/${event_id}/`, {
        withCredentials: true,
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  // Determine computed status (Upcoming vs Live vs Completed vs Sold Out)
  const getEventLifecycle = (ev) => {
    if (ev.is_sold_out || (ev.event_available_seats !== undefined && ev.event_available_seats <= 0)) {
      return 'Sold Out';
    }
    const eventTime = new Date(ev.event_scheduled_date).getTime();
    const now = Date.now();
    if (isNaN(eventTime)) return 'Upcoming';
    if (eventTime > now) return 'Upcoming';
    if (now - eventTime < 86400000) return 'Live';
    return 'Completed';
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const status = getEventLifecycle(ev);
    const matchesCategory =
      selectedCategory === 'All Categories' || ev.event_category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All Status' || status === selectedStatus;
    const matchesSearch =
      !searchFilter ||
      ev.event_title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ev.event_location?.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categoriesList = Array.from(new Set(events.map((e) => e.event_category).filter(Boolean)));

  const EventColumns = [
    {
      key: "event_title",
      label: "Event Name",
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.event_image ? (
            <img
              src={row.event_image}
              alt=""
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#252830', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🎟
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: '#ffffff' }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>ID #{row.event_id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "event_category",
      label: "Category",
      render: (val) => (
        <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #252830' }}>
          {val || 'General'}
        </span>
      ),
    },
    {
      key: "event_scheduled_date",
      label: "Scheduled Date",
      render: (value, row) => {
        const d = new Date(value);
        const isUpcoming = d.getTime() > Date.now();
        return (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 500 }}>
              {!isNaN(d.getTime()) ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending'}
            </div>
            <div style={{ fontSize: '11px', color: isUpcoming ? '#38bdf8' : '#9ca3af' }}>
              {!isNaN(d.getTime()) ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
              {isUpcoming ? ' • Upcoming' : ''}
            </div>
          </div>
        );
      },
    },
    {
      key: "event_location",
      label: "Venue / City",
      render: (val) => <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{val || 'Not set'}</span>,
    },
    {
      key: "event_price",
      label: "Base Price",
      render: (val) => <span style={{ color: '#ff2c55', fontWeight: 700 }}>₹{val || 0}</span>,
    },
    {
      key: "event_total_seats",
      label: "Seats Inventory",
      render: (val, row) => {
        const avail = row.event_available_seats ?? val ?? 0;
        return (
          <span style={{ fontSize: '12px' }}>
            <strong style={{ color: avail > 0 ? '#34d399' : '#f87171' }}>{avail}</strong> / {val} left
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Lifecycle Status",
      render: (_, row) => {
        const status = getEventLifecycle(row);
        let badgeColor = '#3b82f6';
        if (status === 'Sold Out') badgeColor = '#ef4444';
        if (status === 'Live') badgeColor = '#10b981';
        if (status === 'Completed') badgeColor = '#64748b';

        return (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              background: `${badgeColor}22`,
              color: badgeColor,
              border: `1px solid ${badgeColor}44`,
            }}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="admintable" style={{ padding: '0 0 32px' }}>
      {/* Header with Title and Create Action */}
      <div
        style={{
          padding: '24px 28px',
          borderBottom: '1px solid #252830',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#ffffff' }}>
            Event Management & Configuration
          </h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            Configure upcoming and existing events, seating inventories, and live ticket tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/events/create')}
          style={{
            background: '#ff2c55',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(255, 44, 85, 0.35)',
            transition: 'all 0.2s',
          }}
        >
          <MdAdd style={{ fontSize: '18px' }} />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          padding: '16px 28px',
          borderBottom: '1px solid #252830',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <MdSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '18px',
            }}
          />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              ...filterStyle,
              paddingLeft: '38px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filter */}
        <select
          style={filterStyle}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All Categories">All Categories ({events.length})</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          style={filterStyle}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Status">All Statuses</option>
          <option value="Upcoming">Upcoming Events</option>
          <option value="Live">Live / Active</option>
          <option value="Sold Out">Sold Out</option>
          <option value="Completed">Completed</option>
        </select>

        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 'auto' }}>
          Showing <strong>{filteredEvents.length}</strong> of {events.length} events
        </span>
      </div>

      {/* Data Table */}
      <div style={{ overflowX: 'auto' }}>
        <CommonTable
          columns={EventColumns}
          data={filteredEvents}
          actions={(event) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton
                title="Configure Event Studio"
                onClick={() => navigate(`/admin/events/configure/${event.event_id}`)}
              >
                <MdOutlineModeEdit />
              </ActionButton>

              <a
                href={`/events/${event.event_id}/buy-page`}
                target="_blank"
                rel="noopener noreferrer"
                title="View Live Seatmap Page"
                style={{
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  textDecoration: 'none',
                }}
              >
                <MdOpenInNew />
              </a>

              <ActionButton
                title="Delete Event"
                onClick={() => handleDelete(event.event_id, event.event_title)}
              >
                <MdOutlineDelete />
              </ActionButton>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function EventModal({ show, onClose, showToast, selectedEvent, setRefresh }) {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: '24px', borderBottom: '1px solid #252830', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
          {selectedEvent ? `Configure: ${selectedEvent.event_title}` : "Create New Event"}
        </h3>
        <button onClick={onClose} style={modalCloseStyle}>×</button>
      </div>
      <div style={{ padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✦</div>
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px' }}>
          {selectedEvent ? "Open Event Configuration Studio" : "Open Event Creation Studio"}
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px' }}>
          Configure detailed venue coordinates, District seatmap pricing tiers, artist associations, and live inventory.
        </p>
        <button
          type="button"
          onClick={() => {
            onClose();
            if (selectedEvent) {
              navigate(`/admin/events/configure/${selectedEvent.event_id}`);
            } else {
              navigate('/admin/events/create');
            }
          }}
          style={{
            background: '#ff2c55',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 44, 85, 0.4)',
          }}
        >
          {selectedEvent ? "Open Studio to Configure →" : "Launch Creation Studio →"}
        </button>
      </div>
    </ModalOverlay>
  );
}

