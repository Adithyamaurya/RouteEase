import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyBookings.css';
import yoo from '../assets/socialProofingDefault.webp';
const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my');
      setBookings(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.delete(`/bookings/${bookingId}`);
      // Refresh bookings list
      await fetchBookings();
      alert('Booking cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isUpcoming = (travelDate) => {
    return new Date(travelDate) > new Date();
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
          {error}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
          <button className="btn btn-primary" style={{marginTop:'20px'}} onClick={() => navigate('/')}>
            Book a Ticket
          </button>
        </div>
        <div style={{textAlign:'center', marginTop:'20px', display:'flex',alignItems:'center', justifyContent:'center'}}>
        <img src={yoo} style={{width:'250px',marginBottom:'-10px' }} alt="Social proofing" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h2 className="page-title">My Bookings</h2>
        <div className="bookings-list">
          {bookings.map((booking) => {
            const bus = booking.busId;
            const upcoming = isUpcoming(booking.travelDate) && booking.status === 'CONFIRMED';

            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">Booking ID: {booking._id.slice(-8)}</div>
                  <span className={`status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-content">
                  <div className="booking-info">
                    <div className="route-info">
                      <div className="route-section">
                        <div className="time">{formatTime(bus.departureTime)}</div>
                        <div className="location">{bus.source}</div>
                        <div className="date">{formatDate(booking.travelDate)}</div>
                      </div>
                      <div className="route-arrow">→</div>
                      <div className="route-section">
                        <div className="time">{formatTime(bus.arrivalTime)}</div>
                        <div className="location">{bus.destination}</div>
                      </div>
                    </div>

                    <div className="booking-details-list">
                      <div className="detail-row">
                        <span>Bus:</span>
                        <span>{bus.busNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span>Seats:</span>
                        <span className="seat-numbers">{booking.seatNumbers.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span>Total Amount:</span>
                        <span className="amount">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {upcoming && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

