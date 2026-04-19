import React from 'react';
import './PhishingWarning.css';

const PhishingWarning = ({ tips, onBack }) => {
  return (
    <div className="warning-container">
      {/* Red Alert Banner */}
      <div className="alert-banner">
        <div className="alert-content">
          <span className="alert-icon">⚠️</span>
          <h1>You Have Been Phished!</h1>
        </div>
      </div>

      {/* Main Warning Content */}
      <div className="warning-content">
        <div className="warning-card">
          <h2>This was a phishing simulation</h2>
          <p className="warning-message">
            <strong>Your credentials were NOT stored.</strong> This was an educational demonstration
            to help you understand how phishing attacks work and how to protect yourself.
          </p>

          {/* Security Tips Section */}
          <div className="tips-section">
            <h3>5 Security Tips to Identify Phishing Websites</h3>

            <div className="tips-grid">
              {tips && tips.length > 0 ? (
                tips.map((tip, index) => (
                  <div key={index} className="tip-card">
                    <div className="tip-number">{index + 1}</div>
                    <h4>{tip.title}</h4>
                    <p>{tip.description}</p>
                  </div>
                ))
              ) : (
                <p>No tips available.</p>
              )}
            </div>
          </div>

          {/* Learning Points */}
          <div className="learning-section">
            <h3>Key Learning Points</h3>
            <ul className="learning-list">
              <li>Always verify the complete URL before logging in</li>
              <li>Legitimate websites use HTTPS encryption (lock icon)</li>
              <li>Official institutions never ask for passwords via email or suspicious links</li>
              <li>When in doubt, navigate directly to the official website instead of clicking links</li>
              <li>Be cautious of urgent messages requesting immediate action</li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <p className="cta-text">
              This simulation was designed to raise awareness about phishing attacks. Now that you
              know how it feels, you'll be better equipped to recognize similar attempts in the future.
            </p>

            <button onClick={onBack} className="back-button">
              Start Over
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="warning-footer">
        <p>
          <strong>Disclaimer:</strong> This is an educational project for cybersecurity awareness. If
          you ever encounter a real phishing attempt, report it to the appropriate IT department or cybersecurity
          authorities.
        </p>
      </footer>
    </div>
  );
};

export default PhishingWarning;
