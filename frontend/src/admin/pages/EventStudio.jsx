import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EventStudio.css';

const CATEGORIES = [
  'Concert & Live Music',
  'Standup Comedy',
  'Theatre & Arts',
  'EDM & Club Night',
  'Technology & Conference',
  'Sports & Gaming',
  'Festival',
  'Workshop & Masterclass'
];

export default function EventStudio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Concert & Live Music');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 86400000 * 7));
  const [location, setLocation] = useState('');
  const [totalSeats, setTotalSeats] = useState(500);
  const [availableSeats, setAvailableSeats] = useState(500);
  const [basePrice, setBasePrice] = useState(999);
  const [isSoldOut, setIsSoldOut] = useState(false);

  // Artists & Media
  const [allArtists, setAllArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch available artists
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/artists/`)
      .then((res) => {
        setAllArtists(res.data || []);
      })
      .catch((err) => console.error('Error fetching artists:', err));
  }, []);

  // If in edit mode, fetch existing event configuration
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/CreateEvent/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data;
          if (data) {
            setTitle(data.event_title || '');
            setCategory(data.event_category || 'Concert & Live Music');
            setDescription(data.event_description || '');
            if (data.event_scheduled_date) {
              setScheduledDate(new Date(data.event_scheduled_date));
            }
            setLocation(data.event_location || data.location_name || '');
            setTotalSeats(data.event_total_seats ?? 500);
            setAvailableSeats(data.event_available_seats ?? data.event_total_seats ?? 500);
            setBasePrice(data.event_price ?? 999);
            setIsSoldOut(Boolean(data.is_sold_out));
            if (data.event_image) {
              setImagePreview(data.event_image);
            }
            if (Array.isArray(data.artists)) {
              setSelectedArtists(data.artists);
            }
          }
        })
        .catch((err) => {
          console.error('Error loading event for editing:', err);
          setFeedback({
            type: 'error',
            message: 'Unable to load event details. Please verify the event ID.',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleArtist = (artistId) => {
    setSelectedArtists((prev) =>
      prev.includes(artistId)
        ? prev.filter((item) => item !== artistId)
        : [...prev, artistId]
    );
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Event Title is required.' });
      return;
    }
    if (!location.trim()) {
      setFeedback({ type: 'error', message: 'Venue / Event Location is required.' });
      return;
    }
    if (!scheduledDate) {
      setFeedback({ type: 'error', message: 'Event Scheduled Date & Time is required.' });
      return;
    }

    setSaving(true);

    try {
      // 1. Get CSRF Token
      const csrfRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || ''}/api/get-csrf-token/`,
        { withCredentials: true }
      );
      const csrfToken = csrfRes.data.csrfToken;

      // 2. Build FormData
      const formData = new FormData();
      formData.append('event_title', title);
      formData.append('event_category', category);
      formData.append('event_description', description);
      formData.append('event_scheduled_date', scheduledDate.toISOString());
      formData.append('event_location', location);
      formData.append('event_total_seats', totalSeats);
      formData.append('event_available_seats', availableSeats);
      formData.append('event_price', basePrice);
      formData.append('is_sold_out', isSoldOut ? 'True' : 'False');

      if (imageFile) {
        formData.append('event_image', imageFile);
      }

      // Append artists
      selectedArtists.forEach((aid) => {
        formData.append('artists', aid);
      });

      // 3. Post to endpoint
      const endpoint = isEdit
        ? `${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/CreateEvent/${id}/`
        : `${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/CreateEvent/`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data?.success || response.data?.message) {
        setFeedback({
          type: 'success',
          message: isEdit
            ? 'Event configuration updated successfully!'
            : 'New event published successfully!',
        });

        const targetEventId = isEdit ? id : response.data.event_id;
        setTimeout(() => {
          navigate(`/admin/events`);
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: 'Unable to save event. Please check required fields.',
        });
      }
    } catch (err) {
      console.error('Error saving event:', err);
      const errDetail =
        err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : err.response?.data?.error || 'Failed to save event configuration.';
      setFeedback({ type: 'error', message: errDetail });
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Tier Breakdown Preview
  const computedPrice = Number(basePrice) || 0;
  const tiers = [
    { name: 'Phase 1 | Bronze', zone: 'Standing Pit', price: Math.round(computedPrice * 1.0), color: '#f8b69b' },
    { name: 'Phase 1 | Silver', zone: 'General Seated', price: Math.round(computedPrice * 1.5), color: '#9de8e3' },
    { name: 'Early Bird | Gold', zone: 'Reserved Seated', price: Math.round(computedPrice * 2.2), color: '#f7cb8b' },
    { name: 'Early Bird | Platinum', zone: 'VIP Seated', price: Math.round(computedPrice * 3.5), color: '#d6cbfe' },
    { name: 'Early Bird | Diamond', zone: '4-Block Stage Matrix', price: Math.round(computedPrice * 5.0), color: '#d0e2fc' },
    { name: 'Standing Lounge', zone: 'Elevated Platform + F&B', price: Math.round(computedPrice * 8.0), color: '#e4a0f7' },
    { name: 'Phase 1 | Solitaire', zone: 'Front Sofa Seating', price: Math.round(computedPrice * 10.0), color: '#f4cad2' },
  ];

  if (loading) {
    return (
      <div className="event-studio-root text-center py-5">
        <p className="text-secondary">Loading event configuration studio...</p>
      </div>
    );
  }

  return (
    <div className="event-studio-root">
      {/* Top Header */}
      <header className="event-studio-header">
        <div className="studio-header-left">
          <button
            type="button"
            className="studio-back-btn"
            onClick={() => navigate('/admin/events')}
            title="Back to Events list"
          >
            ←
          </button>
          <div className="studio-title-group">
            <h1>
              <span>{isEdit ? 'Configure Event' : 'Create New Event'}</span>
              <span className={`studio-badge ${isEdit ? 'edit' : 'create'}`}>
                {isEdit ? `ID #${id}` : 'Admin Studio'}
              </span>
            </h1>
            <p className="studio-subtitle">
              {isEdit
                ? 'Update venue coordinates, seat inventory, pricing tiers, and event lifecycle settings'
                : 'Configure all details, interactive District seatmap tiers, and publish to the live catalog'}
            </p>
          </div>
        </div>

        <div className="studio-header-actions">
          {isEdit && (
            <a
              href={`/events/${id}/buy-page`}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-btn studio-btn-secondary"
            >
              Live Seatmap ↗
            </a>
          )}
          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={() => navigate('/admin/events')}
          >
            Cancel
          </button>
          <button
            type="button"
            className="studio-btn studio-btn-primary"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Saving Changes...' : isEdit ? 'Update Event' : 'Publish Event'}
          </button>
        </div>
      </header>

      {/* Feedback Alert */}
      {feedback.message && (
        <div className={`studio-alert ${feedback.type}`}>
          <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview Card on Right */}
      <div className="studio-grid">
        {/* Left Column: Configuration Forms */}
        <div className="studio-left-col">
          {/* Card 1: Core Event Details */}
          <section className="studio-card">
            <div className="studio-card-header">
              <h2 className="studio-card-title">
                <span className="icon">◈</span> Core Event Information
              </h2>
            </div>

            <div className="studio-field">
              <label className="studio-label">
                <span>Event Title</span>
                <span className="studio-label-hint">{title.length}/100 chars</span>
              </label>
              <input
                type="text"
                className="studio-input"
                placeholder="e.g. A R Rahman Live in Concert - Delhi 2026"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="studio-form-row">
              <div className="studio-field">
                <label className="studio-label">Category</label>
                <select
                  className="studio-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="studio-field">
                <label className="studio-label">Scheduled Date & Time</label>
                <DatePicker
                  selected={scheduledDate}
                  onChange={(date) => setScheduledDate(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  minDate={new Date()}
                  className="studio-input"
                  placeholderText="Select date and time"
                />
              </div>
            </div>

            <div className="studio-field">
              <label className="studio-label">
                <span>Event Description</span>
                <span className="studio-label-hint">Shown on event page and modals</span>
              </label>
              <textarea
                className="studio-textarea"
                placeholder="Describe the experience, musical setlists, special guest highlights..."
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Performing Artists Selection */}
            <div className="studio-field">
              <label className="studio-label">
                <span>Featured Artists</span>
                <span className="studio-label-hint">Select all performing artists</span>
              </label>
              <div className="studio-artists-grid">
                {allArtists.map((artist) => {
                  const isSelected = selectedArtists.includes(artist.artistid);
                  return (
                    <div
                      key={artist.artistid}
                      className={`artist-checkbox-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleArtist(artist.artistid)}
                    >
                      <img
                        src={artist.artist_image || artist.image_url || '/placeholder.png'}
                        alt={artist.artistname}
                      />
                      <span>{artist.artistname}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Card 2: Venue, Location & Coordinates */}
          <section className="studio-card">
            <div className="studio-card-header">
              <h2 className="studio-card-title">
                <span className="icon">📍</span> Venue & Geolocation Settings
              </h2>
            </div>

            <div className="studio-field">
              <label className="studio-label">
                <span>Venue Name & Address</span>
                <span className="studio-label-hint">Geocoded automatically for Google Maps</span>
              </label>
              <input
                type="text"
                className="studio-input"
                placeholder="e.g. Leisure Valley Grounds, Sector 29, Gurugram"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Card 3: Ticketing, Inventory & Seating Matrix */}
          <section className="studio-card">
            <div className="studio-card-header">
              <h2 className="studio-card-title">
                <span className="icon">🎟</span> Ticket Pricing & Inventory
              </h2>
            </div>

            <div className="studio-form-row">
              <div className="studio-field">
                <label className="studio-label">Base Ticket Price (₹)</label>
                <input
                  type="number"
                  className="studio-input"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
              </div>

              <div className="studio-field">
                <label className="studio-label">Total Venue Capacity</label>
                <input
                  type="number"
                  className="studio-input"
                  min="1"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                />
              </div>
            </div>

            <div className="studio-form-row">
              <div className="studio-field">
                <label className="studio-label">
                  <span>Remaining Available Seats</span>
                  <span className="studio-label-hint">Manual inventory override</span>
                </label>
                <input
                  type="number"
                  className="studio-input"
                  min="0"
                  max={totalSeats}
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                />
              </div>

              <div className="studio-field" style={{ justifyContent: 'center' }}>
                <label className="studio-label">Sold Out Status</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    checked={isSoldOut}
                    onChange={(e) => setIsSoldOut(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#ff2c55' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isSoldOut ? '#ff2c55' : '#9ca3af' }}>
                    {isSoldOut ? 'Marked as Sold Out (Sales Disabled)' : 'Tickets Available for Booking'}
                  </span>
                </label>
              </div>
            </div>

            {/* District Venue Seatmap Breakdown */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #252830' }}>
              <label className="studio-label" style={{ marginBottom: '10px' }}>
                <span>District Venue Seating Tier Breakdown</span>
                <span className="studio-label-hint">Interactive venue SVG multipliers</span>
              </label>

              <table className="tier-matrix-table">
                <thead>
                  <tr>
                    <th>Section Name</th>
                    <th>Zone Type</th>
                    <th>Computed Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((t) => (
                    <tr key={t.name}>
                      <td>
                        <span className="tier-badge" style={{ backgroundColor: `${t.color}22`, color: t.color }}>
                          {t.name}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8' }}>{t.zone}</td>
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>₹{t.price.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Live Event Card & Poster Preview */}
        <aside className="studio-right-col">
          <div className="studio-preview-card">
            {/* Visual Banner Upload / Preview */}
            <div className="studio-banner-upload-box">
              {imagePreview ? (
                <img src={imagePreview} alt="Event Poster Preview" className="studio-banner-img" />
              ) : (
                <div className="studio-banner-placeholder">
                  <span className="icon">🖼</span>
                  <span>Click or drag image to upload banner</span>
                </div>
              )}
              <input
                type="file"
                className="studio-file-input"
                accept="image/*"
                onChange={handleImageChange}
                title="Choose event banner"
              />
            </div>

            {/* Preview Details */}
            <div className="studio-preview-content">
              <span className="studio-badge create" style={{ marginBottom: '8px', display: 'inline-block' }}>
                {category}
              </span>
              <h3 className="studio-preview-title">{title || 'Untitled Event Showcase'}</h3>
              <p className="studio-preview-meta">
                📅 {scheduledDate ? scheduledDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date Pending'}
                <br />
                📍 {location || 'Venue location not set'}
              </p>

              <div className="studio-preview-stats">
                <div className="preview-stat-item">
                  <span className="label">Entry Starting From</span>
                  <span className="val" style={{ color: '#ff2c55' }}>
                    ₹{computedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="preview-stat-item">
                  <span className="label">Available Seats</span>
                  <span className="val">
                    {availableSeats} / {totalSeats}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  className="studio-btn studio-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? 'Publishing...' : isEdit ? 'Save Event Configuration' : 'Publish Live Event'}
                </button>

                {isEdit && (
                  <Link
                    to={`/event-list/${id}`}
                    target="_blank"
                    className="studio-btn studio-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    View Public Event Page ↗
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
