import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import offersImage from '../assets/HomeSaleBanner.webp';
import heroImage from '../assets/heroimg.jpg';
const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: '',
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchData.source || !searchData.destination || !searchData.date) {
      alert('Please fill all fields');
      return;
    }
    navigate(`/buses?source=${searchData.source}&destination=${searchData.destination}&date=${searchData.date}`);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const offers = [
    {
      id: 1,
      title: 'Early Bird Special',
      discount: '20% OFF',
      description: 'Book 7 days in advance and save big!',
      code: 'EARLY20',
      icon: '🎫'
    },
    {
      id: 2,
      title: 'Weekend Getaway',
      discount: '15% OFF',
      description: 'Special discount on weekend travels',
      code: 'WEEKEND15',
      icon: '🏖️'
    },
    {
      id: 3,
      title: 'Student Discount',
      discount: '25% OFF',
      description: 'Students get exclusive discounts',
      code: 'STUDENT25',
      icon: '🎓'
    },
    {
      id: 4,
      title: 'Group Booking',
      discount: '30% OFF',
      description: 'Book for 5+ people and save more',
      code: 'GROUP30',
      icon: '👥'
    }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure Booking',
      description: 'Your data and payments are completely secure'
    },
    {
      icon: '⚡',
      title: 'Instant Confirmation',
      description: 'Get instant booking confirmation via email'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Compare prices and get the best deals'
    },
    {
      icon: '🔄',
      title: 'Easy Cancellation',
      description: 'Cancel or modify bookings with ease'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Book tickets on the go with our mobile app'
    },
    {
      icon: '⭐',
      title: '24/7 Support',
      description: 'Round the clock customer support'
    }
  ];

  const popularRoutes = [
    { from: 'Borivali', to: 'Shirdi', price: '₹450' },
    { from: 'Churchgate', to: 'Lonavala', price: '₹550' },
    { from: 'Banglore', to: 'Goa', price: '₹650' },
    { from: 'Nagpur', to: 'Pune', price: '₹750' },
    { from: 'Mumbai', to: 'Pune', price: '₹550' },
    { from: 'Mumbai', to: 'Goa', price: '₹850' },
  ];

  return (
    <div className="home">
      <div className="hero-section" style={{ backgroundImage: `url(${heroImage})`, width: '100%', height: '90vh', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1>Book Your Bus Ticket</h1>
          <h3>Find and book buses for your journey</h3>
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  name="source"
                  value={searchData.source}
                  onChange={handleChange}
                  placeholder="Enter source city"
                  required
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  name="destination"
                  value={searchData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination city"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button type="submit" className="btn btn-primary search-btn">
                  Search Buses
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Breaker Offer Section */}
      <section className="breaker-section">
        <div className="container" style={{marginBottom: '50px'}}>
          <div className="breaker-offers">
            <div className="breaker-card festive">
              <h3>Save up to ₹300 on bus tickets</h3>
              <p>Valid till 03 Jan</p>
              <div className="coupon">FESTIVE300</div>
            </div>

            <div className="breaker-card wedding">
              <h3>Save up to ₹300 on bus tickets</h3>
              <p>Valid till 31 Dec</p>
              <div className="coupon">SHAADI300</div>
            </div>

            <div className="breaker-card cashback">
              <h3>Save up to ₹500 on bus tickets</h3>
              <p>Valid till 31 Dec</p>
              <div className="coupon">RED500</div>
            </div>

            <div className="breaker-card first">
              <h3>Save up to ₹250 on bus tickets</h3>
              <p>Valid till 31 Dec</p>
              <div className="coupon">FIRST</div>
            </div>
          </div>
        </div>
                        <div style={{ backgroundImage: `url(${offersImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px' }}></div>
      </section>
      {/* Offers Section */}
      <section className="offers-section">
        <div className="container">
          <h2 className="section-title">Special Offers</h2>
          <p className="section-subtitle">Don't miss out on these amazing deals!</p>
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer.id} className="offer-card">
                <div className="offer-top">
                  <span className="offer-tag">BUS</span>
                  <span className="offer-icon">{offer.icon}</span>
                </div>

                <h3 className="offer-title">{offer.title}</h3>

                <p className="offer-desc">{offer.description}</p>

                <div className="offer-footer">
                  <span className="offer-discount">{offer.discount}</span>
                  <span className="offer-code">Code: <strong>{offer.code}</strong></span>
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">Experience the best in bus travel booking</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      
      {/* Popular Routes Section */}
      <section className="popular-routes-section">
        <div className="container">
          <h2 className="section-title">Popular Routes</h2>
          <p className="section-subtitle">Most booked routes this month</p>
          <div className="routes-grid">
            {popularRoutes.map((route, index) => (
              <div key={index} className="route-card" onClick={() => navigate(`/buses?source=${route.from}&destination=${route.to}`)}>
                <div className="route-info">
                  <div className="route-cities">
                    <span className="route-from">{route.from}</span>
                    <span className="route-arrow">→</span>
                    <span className="route-to">{route.to}</span>
                  </div>
                  <div className="route-price">From {route.price}</div>
                </div>
                <button className="btn btn-outline route-btn">Book Now</button>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/upcoming-routes" className="btn btn-primary">
              View All Routes
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Book your bus ticket now and travel comfortably</p>
            <Link to="/buses" className="btn btn-primary btn-large">
              Search Buses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

