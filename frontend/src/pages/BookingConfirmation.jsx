import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data.data);
        setError('');
      } catch (err) {
        setError('Failed to load booking details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="container">
        <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  const bus = booking.busId;

  return (
    <div className="booking-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking has been confirmed successfully.</p>
          </div>

          <div className="booking-details">
            <div className="detail-section">
              <h3>Booking Information</h3>
              <div className="detail-item">
                <span>Booking ID:</span>
                <span>{booking._id}</span>
              </div>
              <div className="detail-item">
                <span>Booking Date:</span>
                <span>{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span className={`status status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Journey Details</h3>
              <div className="detail-item">
                <span>Bus Number:</span>
                <span>{bus.busNumber}</span>
              </div>
              <div className="detail-item">
                <span>Route:</span>
                <span>{bus.source} → {bus.destination}</span>
              </div>
              <div className="detail-item">
                <span>Travel Date:</span>
                <span>{formatDate(booking.travelDate)}</span>
              </div>
              <div className="detail-item">
                <span>Departure Time:</span>
                <span>{formatTime(bus.departureTime)}</span>
              </div>
              <div className="detail-item">
                <span>Arrival Time:</span>
                <span>{formatTime(bus.arrivalTime)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Seat Details</h3>
              <div className="detail-item">
                <span>Selected Seats:</span>
                <span className="seat-numbers">{booking.seatNumbers.join(', ')}</span>
              </div>
              <div className="detail-item">
                <span>Number of Seats:</span>
                <span>{booking.seatNumbers.length}</span>
              </div>
            </div>

            <div className="detail-section total-section">
              <div className="detail-item total">
                <span>Total Amount:</span>
                <span>₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Book Another Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

