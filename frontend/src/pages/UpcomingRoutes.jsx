import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UpcomingRoutes.css';

const UpcomingRoutes = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const response = await api.get('/buses/upcoming', { params: { limit: 30 } });
        setRoutes(response.data.data || []);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Unable to load upcoming routes right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysUntilDeparture = (dateString) => {
    const today = new Date();
    const departure = new Date(dateString);
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const daysUntil = getDaysUntilDeparture(route.departureTime);
      if (filter === 'this-month') return daysUntil <= 30;
      if (filter === 'next-month') return daysUntil > 30 && daysUntil <= 60;
      return true;
    });
  }, [routes, filter]);

  const handleViewRoute = (route) => {
    const d = new Date(route.departureTime);
    // Use LOCAL date so it matches the date the user will search with
    const dateParam = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    navigate(
      `/buses?source=${encodeURIComponent(route.source)}&destination=${encodeURIComponent(
        route.destination
      )}&date=${dateParam}`
    );
  };

  return (
    <div className="upcoming-routes-page">
      <div className="routes-hero">
        <div className="container">
          <h1>Upcoming Bus Routes</h1>
          <p>Discover new routes launching soon and be the first to book</p>
        </div>
      </div>

      <div className="container">
        {/* Filter Section */}
        <section className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Routes
            </button>
            <button 
              className={`filter-btn ${filter === 'this-month' ? 'active' : ''}`}
              onClick={() => setFilter('this-month')}
            >
              This Month
            </button>
            <button 
              className={`filter-btn ${filter === 'next-month' ? 'active' : ''}`}
              onClick={() => setFilter('next-month')}
            >
              Next Month
            </button>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="routes-section">
          {loading ? (
            <div className="loading">Loading upcoming routes...</div>
          ) : error ? (
            <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>
          ) : filteredRoutes.length === 0 ? (
            <div className="empty-state">
              <h3>No upcoming routes</h3>
              <p>Check back soon for newly added routes.</p>
            </div>
          ) : (
            <div className="routes-grid">
              {filteredRoutes.map((route) => {
                const daysUntil = getDaysUntilDeparture(route.departureTime);
                const features =
                  (route.amenities && route.amenities.length > 0
                    ? route.amenities
                    : route.features && route.features.length > 0
                    ? route.features
                    : ['WiFi', 'AC', 'USB Charging']);
                return (
                  <div key={route._id} className="route-card">
                    <div className="route-header">
                      <div className="route-cities">
                        <span className="route-from">{route.source}</span>
                        <span className="route-arrow">→</span>
                        <span className="route-to">{route.destination}</span>
                      </div>
                      <div className="route-status-badge">
                        {daysUntil > 0 ? `In ${daysUntil} days` : 'Today'}
                      </div>
                    </div>

                    <div className="route-details">
                      <div className="detail-item">
                        <span className="detail-label">Departure:</span>
                        <span className="detail-value">
                          {formatDate(route.departureTime)} • {formatTime(route.departureTime)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Arrival:</span>
                        <span className="detail-value">
                          {formatDate(route.arrivalTime)} • {formatTime(route.arrivalTime)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Seats Left:</span>
                        <span className="detail-value">{route.availableSeats}/{route.totalSeats}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Fare From:</span>
                        <span className="detail-value price">₹{route.price}</span>
                      </div>
                    </div>

                    <div className="route-features">
                      <h4>Amenities</h4>
                      <div className="features-list">
                        {features.map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="route-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewRoute(route)}
                      >
                        View & Book
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleViewRoute(route)}
                      >
                        View Similar Routes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Info Section */}

      </div>
    </div>
  );
};

export default UpcomingRoutes;

