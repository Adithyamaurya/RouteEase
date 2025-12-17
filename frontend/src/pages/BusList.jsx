import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './BusList.css';

const getDuration = (departureTime, arrivalTime) => {
  const start = new Date(departureTime);
  const end = new Date(arrivalTime);
  const minutes = Math.max(0, Math.round((end - start) / (1000 * 60)));
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${hrs} hr ${mins} min`;
};

// Simple helper to show a few major stops for popular routes (purely visual)
const getMajorStops = (source, destination) => {
  const key = `${source?.toLowerCase()}-${destination?.toLowerCase()}`;
  switch (key) {
    case 'mumbai-pune':
      return ['Dadar', 'Vashi', 'Panvel', 'Lonavala', 'Wakad'];
    case 'pune-mumbai':
      return ['Wakad', 'Lonavala', 'Panvel', 'Vashi', 'Dadar'];
    case 'bangalore-chennai':
      return ['Silk Board', 'Hosur', 'Krishnagiri', 'Vellore', 'Sriperumbudur'];
    case 'chennai-bangalore':
      return ['Sriperumbudur', 'Vellore', 'Krishnagiri', 'Hosur', 'Silk Board'];
    default:
      return ['Boarding point in city', 'Midway refresh stop', 'Drop point in city'];
  }
};

const BusList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const params = {};
        if (source) params.source = source;
        if (destination) params.destination = destination;
        if (date) params.date = date;

        const response = await api.get('/buses/search', { params });
        setBuses(response.data.data || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch buses. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (source && destination && date) {
      fetchBuses();
    } else {
      setLoading(false);
      setError('Please search for buses from the home page');
    }
  }, [source, destination, date]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleSelectBus = (busId) => {
    if (!date) return;
    navigate(`/seats/${busId}?date=${date}`);
  };

  if (loading) {
    return <div className="loading">Loading buses...</div>;
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

  if (buses.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>No buses found</h3>
          <p>Try searching with different source, destination, or date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-list-page">
      <div className="container">
        <div className="bus-list-header">
          <h2>Available Buses</h2>
          <p>
            {source} → {destination} on {date && formatDate(date)}
          </p>
        </div>
        <div className="bus-list">
          {buses.map((bus) => (
            <div key={bus._id} className="bus-card">
              <div className="bus-info">
                <div className="bus-number">{bus.busNumber}</div>
                <div className="bus-timing">
                  <div className="time-section">
                    <div className="time">{formatTime(bus.departureTime)}</div>
                    <div className="location">{bus.source}</div>
                  </div>
                  <div className="time-arrow">→</div>
                  <div className="time-section">
                    <div className="time">{formatTime(bus.arrivalTime)}</div>
                    <div className="location">{bus.destination}</div>
                  </div>
                </div>
                <div className="bus-details">
                  <span>Available Seats: {bus.availableSeats ?? bus.totalSeats}</span>
                  <span>Total Seats: {bus.totalSeats}</span>
                </div>

                <div className="bus-route-section">
                  <div className="route-header-row">
                    <span className="route-title">Route overview</span>
                    <span className="route-duration">
                      Duration: {getDuration(bus.departureTime, bus.arrivalTime)}
                    </span>
                  </div>

                  <div className="bus-route-map">
                    <div className="route-node">
                      <div className="route-dot"></div>
                      <div className="route-node-info">
                        <span className="route-city">{bus.source}</span>
                        <span className="route-time">{formatTime(bus.departureTime)}</span>
                      </div>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-node">
                      <div className="route-dot route-dot-destination"></div>
                      <div className="route-node-info">
                        <span className="route-city">{bus.destination}</span>
                        <span className="route-time">{formatTime(bus.arrivalTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="route-stops">
                    <span className="route-stops-label">Major stops</span>
                    <div className="route-stops-chips">
                      {getMajorStops(bus.source, bus.destination).map((stop, idx) => (
                        <span key={idx} className="route-stop-chip">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bus-price">
                <div className="price">₹{bus.price}</div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSelectBus(bus._id)}
                  disabled={bus.availableSeats === 0}
                >
                  {bus.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusList;

