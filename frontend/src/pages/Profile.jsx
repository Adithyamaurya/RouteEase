import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await api.get('/bookings/my');
        setBookings(response.data.data || []);
      } catch (err) {
        console.error('Failed to load bookings for profile', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.travelDate) > new Date() && b.status === 'CONFIRMED'
  );

  const pastBookings = bookings.filter(
    (b) => new Date(b.travelDate) <= new Date()
  );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put('/auth/me', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setUser(response.data.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <h3>You are not logged in</h3>
          <p>Please sign in to view and manage your profile.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <h3>Personal Information</h3>
            <p className="section-subtitle">Update your contact details</p>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type='text' 
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                />
              </div>

              {message && <div className="profile-message success">{message}</div>}
              {error && <div className="profile-message error">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="profile-side">
            <div className="profile-card">
              <h3>E‑Tickets</h3>
              <p className="section-subtitle">Your upcoming journeys</p>
              {loadingBookings ? (
                <div className="profile-subtext">Loading tickets...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="profile-subtext">No upcoming trips yet.</div>
              ) : (
                <ul className="ticket-list">
                  {upcomingBookings.slice(0, 3).map((b) => (
                    <li key={b._id} className="ticket-item">
                      <div>
                        <div className="ticket-route">
                          {b.busId?.source} → {b.busId?.destination}
                        </div>
                        <div className="ticket-meta">
                          {formatDate(b.travelDate)} · Seats {b.seatNumbers.join(', ')}
                        </div>
                      </div>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => navigate(`/booking/${b._id}`)}
                      >
                        View Ticket
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/my-bookings" className="btn btn-secondary btn-full">
                View all bookings
              </Link>
            </div>

            <div className="profile-card">
              <h3>Invoices</h3>
              <p className="section-subtitle">Previous trips & receipts</p>
              {loadingBookings ? (
                <div className="profile-subtext">Loading invoices...</div>
              ) : pastBookings.length === 0 ? (
                <div className="profile-subtext">No past trips yet.</div>
              ) : (
                <ul className="ticket-list">
                  {pastBookings.slice(0, 3).map((b) => (
                    <li key={b._id} className="ticket-item">
                      <div>
                        <div className="ticket-route">
                          {b.busId?.source} → {b.busId?.destination}
                        </div>
                        <div className="ticket-meta">
                          {formatDate(b.travelDate)} · ₹{b.totalAmount}
                        </div>
                      </div>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => navigate(`/booking/${b._id}`)}
                      >
                        View Invoice
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="profile-card danger">
              <h3>Logout</h3>
              <p>Sign out from this device.</p>
              <button className="btn btn-primary btn-full" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


