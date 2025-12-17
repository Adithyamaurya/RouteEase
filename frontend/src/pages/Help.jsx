import React, { useState } from 'react';
import './Help.css';

const Help = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I book a bus ticket?',
      answer: 'To book a bus ticket, simply search for buses by entering your source, destination, and travel date on the home page. Select your preferred bus, choose your seats, and complete the payment process.'
    },
    {
      id: 2,
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking. Go to "My Bookings" section, select the booking you want to cancel, and follow the cancellation process. Please note that cancellation charges may apply based on the cancellation policy.'
    },
    {
      id: 3,
      question: 'How do I modify my booking?',
      answer: 'You can modify your booking by going to "My Bookings" section. Click on the booking you want to modify and select the "Modify" option. You can change the date, time, or seats (subject to availability).'
    },
    {
      id: 4,
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, net banking, UPI, and digital wallets. All transactions are secure and encrypted.'
    },
    {
      id: 5,
      question: 'Will I receive a confirmation email?',
      answer: 'Yes, you will receive a confirmation email with your booking details immediately after successful payment. The email will contain your booking ID, travel details, and ticket information.'
    },
    {
      id: 6,
      question: 'What if I miss my bus?',
      answer: 'If you miss your bus, please contact our customer support immediately. Depending on the bus operator\'s policy, you may be able to board the next available bus or get a partial refund.'
    },
    {
      id: 7,
      question: 'Are there any discounts available?',
      answer: 'Yes, we offer various discounts including early bird discounts, student discounts, weekend specials, and group booking discounts. Check our offers section on the home page for current promotions.'
    },
    {
      id: 8,
      question: 'How can I track my bus?',
      answer: 'You can track your bus in real-time through our mobile app or website. Enter your booking ID or PNR number to get live updates on your bus location and estimated arrival time.'
    }
  ];

  const supportOptions = [
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Call us 24/7 for immediate assistance',
      contact: '+91 965 665 2441'
    },
    {
      icon: '✉️',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@routeease.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9 AM - 9 PM'
    }
  ];

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="container">
          <h1>Help & Support</h1>
          <p>We're here to help you with any questions or concerns</p>
        </div>
      </div>

      <div className="container">
        {/* Support Options */}
        <section className="support-options">
          <h2 className="section-title">Get in Touch</h2>
          <div className="support-grid">
            {supportOptions.map((option, index) => (
              <div key={index} className="support-card">
                <div className="support-icon">{option.icon}</div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <div className="support-contact">{option.contact}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find answers to common questions</p>
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq.id} className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{activeFaq === faq.id ? '−' : '+'}</span>
                </div>
                {activeFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="quick-links-section">
          <h2 className="section-title">Quick Links</h2>
          <div className="quick-links-grid">
            <div className="quick-link-card">
              <h3>Booking Guide</h3>
              <p>Step-by-step guide to book your tickets</p>
            </div>
            <div className="quick-link-card">
              <h3>Cancellation Policy</h3>
              <p>Learn about our cancellation and refund policies</p>
            </div>
            <div className="quick-link-card">
              <h3>Terms & Conditions</h3>
              <p>Read our terms of service and conditions</p>
            </div>
            <div className="quick-link-card">
              <h3>Privacy Policy</h3>
              <p>How we protect and use your personal information</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;

