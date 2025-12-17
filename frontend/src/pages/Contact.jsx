import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Address',
      details: [
        '402 SPIT',
        'Munshi Nagar',
        'Andheri'
      ]
    },
    {
      icon: '📞',
      title: 'Phone',
      details: [
        'Customer Support: +91 83569 61950',
        'Sales: +91 720 824 8380',
        'Emergency: +91 (555) 123-4569'
      ]
    },
    {
      icon: '✉️',
      title: 'Email',
      details: [
        'support@routeease.com',
        'sales@routeease.com',
        'info@routeease.com'
      ]
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      details: [
        'Weekdays: 9:00 AM - 8:00 PM',
        'Weekends: 10:00 AM - 4:00 PM'
      ]
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <p className="section-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>
            
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Thank you for contacting us!</h3>
                <p>We've received your message and will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="cancellation">Cancellation Request</option>
                      <option value="refund">Refund Request</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message here..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Send Message
                </button>
              </form>
            )}
          </section>

          {/* Contact Information */}
          <section className="contact-info-section">
            <h2>Get in Touch</h2>
            <p className="section-subtitle">Multiple ways to reach us</p>
            
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="info-icon">{info.icon}</div>
                  <h3>{info.title}</h3>
                  <ul>
                    {info.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Map Section */}
        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <p>📍 Map Location</p>
              <p className="map-note">402 SPIT , Munshi Nagar, Andheri</p>
              <p className="map-note"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1584.9450592310875!2d72.83557913215326!3d19.122746529760846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d90e067ba9%3A0x16268e5d6bca2e6a!2sBharatiya%20Vidya%20Bhavan&#39;s%20Sardar%20Patel%20Institute%20of%20Technology%20(SPIT)!5e0!3m2!1sen!2sin!4v1765820921283!5m2!1sen!2sin" width="600" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;

