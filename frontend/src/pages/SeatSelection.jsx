import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './SeatSelection.css';

const SeatSelection = () => {
  const { busId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const travelDate = searchParams.get('date');

  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [busResponse, seatsResponse] = await Promise.all([
          api.get(`/buses/${busId}`),
          api.get(`/buses/${busId}/booked-seats`, { params: { date: travelDate } }),
        ]);

        setBus(busResponse.data.data);
        setBookedSeats(seatsResponse.data.data.bookedSeats);
        setError('');
      } catch (err) {
        setError('Failed to load bus details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (busId && travelDate) {
      fetchData();
    }
  }, [busId, travelDate]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return; // Can't select booked seats
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      setBooking(true);
      const response = await api.post('/bookings', {
        busId,
        seatNumbers: selectedSeats,
        travelDate,
      });

      navigate(`/booking/${response.data.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  const renderSeats = () => {
    if (!bus) return null;

    const seats = [];
    const totalSeats = bus.totalSeats;
    const seatsPerRow = 4; // 2x2 layout means 4 seats per row (2 on each side)

    for (let i = 1; i <= totalSeats; i++) {
      const isBooked = bookedSeats.includes(i);
      const isSelected = selectedSeats.includes(i);
      const row = Math.floor((i - 1) / seatsPerRow);
      const col = (i - 1) % seatsPerRow;

      if (col === 0) {
        seats.push(<div key={`row-${row}`} className="seat-row-label">Row {row + 1}</div>);
      }

      let seatClass = 'seat';
      if (isBooked) {
        seatClass += ' seat-booked';
      } else if (isSelected) {
        seatClass += ' seat-selected';
      } else {
        seatClass += ' seat-available';
      }

      // Add aisle after 2 seats (middle of row)
      if (col === 2) {
        seats.push(<div key={`aisle-${i}`} className="seat-aisle"></div>);
      }

      seats.push(
        <button
          key={i}
          className={seatClass}
          onClick={() => handleSeatClick(i)}
          disabled={isBooked}
          title={`Seat ${i}`}
        >
          {i}
        </button>
      );
    }

    return seats;
  };

  if (loading) {
    return <div className="loading">Loading seat layout...</div>;
  }

  if (error || !bus) {
    return (
      <div className="container">
        <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
          {error || 'Bus not found'}
        </div>
      </div>
    );
  }

  const totalAmount = bus.price * selectedSeats.length;

  return (
    <div className="seat-selection-page">
      <div className="container">
        <div className="seat-selection-header">
          <h2>Select Your Seats</h2>
          <div className="bus-info-summary">
            <span>{bus.busNumber}</span>
            <span>{bus.source} → {bus.destination}</span>
            <span>{travelDate && new Date(travelDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="seat-selection-content">
          <div className="seat-layout-container">
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat seat-available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat seat-selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat seat-booked"></div>
                <span>Booked</span>
              </div>
            </div>

            <div className="bus-front">🚌 Front</div>
            <div className="seat-layout">{renderSeats()}</div>
            <div className="bus-back">Back 🚌</div>
          </div>

          <div className="booking-summary">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Selected Seats:</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              </div>
              <div className="summary-item">
                <span>Price per seat:</span>
                <span>₹{bus.price}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || booking}
              >
                {booking ? 'Booking...' : `Book ${selectedSeats.length} Seat(s)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

