import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    session: 'Winter 2025',
    exam: '',
    enrollmentNo: '',
    password: '',
    captcha: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.exam.trim() ||
      !formData.enrollmentNo.trim() ||
      !formData.password.trim() ||
      !formData.captcha.trim()
    ) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <div className="gtu-page">
      {/* Header */}
      <header className="gtu-header">
        {/* Top right links */}
        <div className="header-links">
          <a href="#">Archive</a>
          <span>|</span>
          <a href="#">Current <span className="current-label">[Winter 2025]</span></a>
        </div>

        {/* Logo and Title */}
        <div className="gtu-header-top">
          <img src="/image.png" alt="GTU" className="gtu-logo" />
          <h1 className="gtu-title">Gujarat Technological University Ahmedabad</h1>
        </div>
        
        {/* Red separator line */}
        <div className="gtu-separator"></div>
      </header>

      {/* Main Content */}
      <div className="gtu-container">
        <div className="gtu-content">
          {/* Search Section */}
          <div className="gtu-search-section">
            <div className="section-header">
              <span className="search-icon">🔍</span>
              <h2>SEARCH :</h2>
            </div>

            <form onSubmit={handleSubmit} className="gtu-form">
              {/* Session */}
              <div className="form-row">
                <div className="form-cell">
                  <label>Session</label>
                  <input
                    type="text"
                    name="session"
                    value={formData.session}
                    readOnly
                    className="form-input"
                  />
                </div>
              </div>

              {/* Exam */}
              <div className="form-row">
                <div className="form-cell">
                  <label>Exam</label>
                  <select
                    name="exam"
                    value={formData.exam}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">-- Select Exam --</option>
                    <option value="ba-sem-1">BA SEM 1 - Regular (DEC 2025)</option>
                    <option value="ba-sem-2">BA SEM 2 - Regular (MAY 2025)</option>
                    <option value="ba-sem-3">BA SEM 3 - Regular (DEC 2024)</option>
                    <option value="ba-sem-4">BA SEM 4 - Regular (MAY 2024)</option>
                    <option value="ba-sem-5">BA SEM 5 - Regular (DEC 2023)</option>
                    <option value="ba-sem-6">BA SEM 6 - Regular (MAY 2023)</option>
                  </select>
                </div>
              </div>

              {/* Enroll No and Password in same row */}
              <div className="form-row-2col">
                <div className="form-cell">
                  <label>Enroll No.</label>
                  <input
                    type="text"
                    name="enrollmentNo"
                    placeholder=""
                    value={formData.enrollmentNo}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-cell">
                  <label>Password.</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Student Portal Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Code (CAPTCHA) */}
              <div className="form-row-2col">
                <div className="form-cell">
                  <label>Code :</label>
                  <div className="captcha-row">
                    <div className="captcha-image">b34010</div>
                    <button type="button" className="captcha-refresh">⟳</button>
                  </div>
                </div>
                <div className="form-cell">
                  <input
                    type="text"
                    name="captcha"
                    placeholder=""
                    value={formData.captcha}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="form-row">
                <button type="submit" className="search-button" disabled={isLoading}>
                  {isLoading ? '...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Search Result Section */}
          <div className="gtu-result-section">
            <div className="section-header">
              <span className="result-icon">🔎</span>
              <h2>SEARCH RESULT:</h2>
            </div>

            <div className="result-box">
              <div className="result-row">
                <div className="result-col">
                  <label>Name</label>
                  <span>-----------</span>
                </div>
                <div className="result-col">
                  <label>Declared On</label>
                  <span>-----------</span>
                </div>
              </div>
              <div className="result-row">
                <div className="result-col">
                  <label>Enrollment No.</label>
                  <span>-----------</span>
                </div>
              </div>
              <div className="result-row">
                <div className="result-col">
                  <label>Exam Seat No.</label>
                  <span>-----------</span>
                </div>
                <div className="result-col">
                  <label>&nbsp;</label>
                  <span>&nbsp;</span>
                </div>
              </div>
              <div className="result-row">
                <div className="result-col">
                  <label>Exam</label>
                  <span>-----------</span>
                </div>
              </div>
              <div className="result-row">
                <div className="result-col">
                  <label>Branch</label>
                  <span>-----------</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="gtu-info-box">
          <div className="info-content">
            <p><strong>Enter search criteria and hit ?Search? button.</strong></p>
            <hr />
            <p className="info-note">
              This is a Computer generated provisional result, please consider the Hard-copy Gradesheet as final result.<br />
              Result queries from Institute will be entertained till 15-days from the Result declaration date. No Result queries will be entertained afterwards.
            </p>
            <hr />
            <p className="info-social">
              GTU's Official Instagram Page: <a href="#">https://www.instagram.com/gtumedia7=nametag</a><br />
              GTU's Official YouTube Channel: <a href="#">https://www.youtube.com/c/GujaratTechnologicalUniversity</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="gtu-footer">
        <p>&copy; 2025 Gujarat Technological University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
