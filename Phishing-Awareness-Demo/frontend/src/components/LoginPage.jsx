import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    session: 'Winter 2025',
    exam: 'ba-sem-1-regular',
    enrollmentNo: '',
    password: '',
    captcha: '',
  });

  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate random captcha code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  // Generate captcha on component mount (page refresh)
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefreshCaptcha = (e) => {
    e.preventDefault();
    generateCaptcha();
    // Clear captcha input
    setFormData((prev) => ({
      ...prev,
      captcha: '',
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
          <a href="https://www.gturesults.in/Default.aspx?ext=archive" className="archive-link">Archive</a>
          <span>|</span>
          <span className="current-text">Current <span className="current-label">[Winter 2025]</span></span>
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
              <img src="/search.png" alt="" className="section-icon-img" aria-hidden="true" />
              <h2>SEARCH :</h2>
            </div>

            <form onSubmit={handleSubmit} className="gtu-form">
              <div className="form-line">
                <label className="form-label">Session</label>
                <span className="form-value">{formData.session}</span>
              </div>

              <div className="form-line">
                <label className="form-label">Exam</label>
                <select
                  name="exam"
                  value={formData.exam}
                  onChange={handleInputChange}
                  className="form-input exam-select"
                >
                    
                    {/* BA */}
                    <optgroup label="BA">
                      <option value="ba-sem-1-regular">BA SEM 1 - Regular (DEC 2025)</option>
                      <option value="ba-sem-1-remedial">BA SEM 1 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-2-remedial">BA SEM 2 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-3-regular">BA SEM 3 - Regular (DEC 2025)</option>
                      <option value="ba-sem-3-remedial">BA SEM 3 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-4-remedial">BA SEM 4 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-5-regular">BA SEM 5 - Regular (DEC 2025)</option>
                      <option value="ba-sem-6-remedial">BA SEM 6 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-7-regular">BA SEM 7 - Regular (DEC 2025)</option>
                      <option value="ba-sem-8-remedial">BA SEM 8 - Remedial (DEC 2025)</option>
                      <option value="ba-sem-9-regular">BA SEM 9 - Regular (DEC 2025)</option>
                      <option value="ba-sem-10-remedial">BA SEM 10 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* BB */}
                    <optgroup label="BB">
                      <option value="bb-sem-1-regular">BB SEM 1 - Regular (DEC 2025)</option>
                      <option value="bb-sem-1-remedial">BB SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bb-sem-2-remedial">BB SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bb-sem-3-regular">BB SEM 3 - Regular (DEC 2025)</option>
                      <option value="bb-sem-3-remedial">BB SEM 3 - Remedial (DEC 2025)</option>
                      <option value="bb-sem-4-remedial">BB SEM 4 - Remedial (DEC 2025)</option>
                      <option value="bb-sem-5-regular">BB SEM 5 - Regular (DEC 2025)</option>
                      <option value="bb-sem-5-remedial">BB SEM 5 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* BCA */}
                    <optgroup label="BCA">
                      <option value="bca-sem-1-regular">BCA SEM 1 - Regular (DEC 2025)</option>
                      <option value="bca-sem-1-remedial">BCA SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bca-sem-2-remedial">BCA SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bca-sem-3-regular">BCA SEM 3 - Regular (DEC 2025)</option>
                    </optgroup>

                    {/* BE */}
                    <optgroup label="BE">
                      <option value="be-sem-1-regular">BE SEM 1 - Regular (DEC 2025)</option>
                      <option value="be-sem-1-remedial">BE SEM 1 - Remedial (DEC 2025)</option>
                      <option value="be-sem-2-remedial">BE SEM 2 - Remedial (DEC 2025)</option>
                      <option value="be-sem-3-regular">BE SEM 3 - Regular (DEC 2025)</option>
                      <option value="be-sem-3-remedial">BE SEM 3 - Remedial (DEC 2025)</option>
                      <option value="be-sem-4-remedial">BE SEM 4 - Remedial (DEC 2025)</option>
                      <option value="be-sem-5-regular">BE SEM 5 - Regular (DEC 2025)</option>
                      <option value="be-sem-5-remedial">BE SEM 5 - Remedial (DEC 2025)</option>
                      <option value="be-sem-6-remedial">BE SEM 6 - Remedial (DEC 2025)</option>
                      <option value="be-sem-7-regular">BE SEM 7 - Regular (DEC 2025)</option>
                      <option value="be-sem-7-remedial">BE SEM 7 - Remedial (DEC 2025)</option>
                      <option value="be-sem-8-remedial">BE SEM 8 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* BH */}
                    <optgroup label="BH">
                      <option value="bh-sem-1-regular">BH SEM 1 - Regular (DEC 2025)</option>
                      <option value="bh-sem-1-remedial">BH SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-2-remedial">BH SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-3-regular">BH SEM 3 - Regular (DEC 2025)</option>
                      <option value="bh-sem-4-remedial">BH SEM 4 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-5-regular">BH SEM 5 - Regular (DEC 2025)</option>
                      <option value="bh-sem-5-remedial">BH SEM 5 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-6-remedial">BH SEM 6 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-7-regular">BH SEM 7 - Regular (DEC 2025)</option>
                      <option value="bh-sem-7-remedial">BH SEM 7 - Remedial (DEC 2025)</option>
                      <option value="bh-sem-8-remedial">BH SEM 8 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* BI */}
                    <optgroup label="BI">
                      <option value="bi-sem-1-regular">BI SEM 1 - Regular (DEC 2025)</option>
                      <option value="bi-sem-1-remedial">BI SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bi-sem-2-remedial">BI SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bi-sem-3-regular">BI SEM 3 - Regular (DEC 2025)</option>
                      <option value="bi-sem-3-remedial">BI SEM 3 - Remedial (DEC 2025)</option>
                      <option value="bi-sem-4-remedial">BI SEM 4 - Remedial (DEC 2025)</option>
                      <option value="bi-sem-5-regular">BI SEM 5 - Regular (DEC 2025)</option>
                      <option value="bi-sem-5-remedial">BI SEM 5 - Remedial (DEC 2025)</option>
                      <option value="bi-sem-7-regular">BI SEM 7 - Regular (DEC 2025)</option>
                    </optgroup>

                    {/* BPH */}
                    <optgroup label="BPH">
                      <option value="bph-sem-1-regular">BPH SEM 1 - Regular (DEC 2025)</option>
                      <option value="bph-sem-1-remedial">BPH SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-2-remedial">BPH SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-3-regular">BPH SEM 3 - Regular (DEC 2025)</option>
                      <option value="bph-sem-3-remedial">BPH SEM 3 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-4-remedial">BPH SEM 4 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-5-regular">BPH SEM 5 - Regular (DEC 2025)</option>
                      <option value="bph-sem-5-remedial">BPH SEM 5 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-6-remedial">BPH SEM 6 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-7-regular">BPH SEM 7 - Regular (DEC 2025)</option>
                      <option value="bph-sem-7-remedial">BPH SEM 7 - Remedial (DEC 2025)</option>
                      <option value="bph-sem-8-remedial">BPH SEM 8 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* BS */}
                    <optgroup label="BS">
                      <option value="bs-sem-1-regular">BS SEM 1 - Regular (DEC 2025)</option>
                      <option value="bs-sem-2-remedial">BS SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bs-sem-3-regular">BS SEM 3 - Regular (DEC 2025)</option>
                    </optgroup>

                    {/* BV */}
                    <optgroup label="BV">
                      <option value="bv-sem-1-regular">BV SEM 1 - Regular (DEC 2025)</option>
                      <option value="bv-sem-1-remedial">BV SEM 1 - Remedial (DEC 2025)</option>
                      <option value="bv-sem-2-remedial">BV SEM 2 - Remedial (DEC 2025)</option>
                      <option value="bv-sem-3-regular">BV SEM 3 - Regular (DEC 2025)</option>
                      <option value="bv-sem-3-remedial">BV SEM 3 - Remedial (DEC 2025)</option>
                      <option value="bv-sem-4-remedial">BV SEM 4 - Remedial (DEC 2025)</option>
                      <option value="bv-sem-5-regular">BV SEM 5 - Regular (DEC 2025)</option>
                      <option value="bv-sem-5-remedial">BV SEM 5 - Remedial (DEC 2025)</option>
                      <option value="bv-sem-6-remedial">BV SEM 6 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* CS */}
                    <optgroup label="CS">
                      <option value="cs-sem-1-regular">CS SEM 1 - Regular (DEC 2025)</option>
                      <option value="cs-sem-1-remedial">CS SEM 1 - Remedial (DEC 2025)</option>
                      <option value="cs-sem-2-remedial">CS SEM 2 - Remedial (DEC 2025)</option>
                      <option value="cs-sem-3-regular">CS SEM 3 - Regular (DEC 2025)</option>
                      <option value="cs-sem-3-remedial">CS SEM 3 - Remedial (DEC 2025)</option>
                      <option value="cs-sem-4-remedial">CS SEM 4 - Remedial (DEC 2025)</option>
                      <option value="cs-sem-5-regular">CS SEM 5 - Regular (DEC 2025)</option>
                      <option value="cs-sem-5-remedial">CS SEM 5 - Remedial (DEC 2025)</option>
                      <option value="cs-sem-6-remedial">CS SEM 6 - Remedial (DEC 2025)</option>
                    </optgroup>

                    {/* PDDC */}
                    <optgroup label="PDDC">
                      <option value="pddc-sem-1-regular">PDDC SEM 1 - Regular (DEC 2025)</option>
                      <option value="pddc-sem-2-remedial">PDDC SEM 2 - Remedial (DEC 2025)</option>
                    </optgroup>
                </select>
              </div>

              <div className="form-line">
                <label className="form-label">Enroll No.</label>
                <input
                  type="text"
                  name="enrollmentNo"
                  placeholder=""
                  value={formData.enrollmentNo}
                  onChange={handleInputChange}
                  className="form-input text-input"
                />
              </div>

              <div className="form-line">
                <label className="form-label">PassWord.</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Student Portal Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input text-input"
                />
              </div>

              <div className="code-line">
                <label className="form-label">Code :</label>
                <div className="captcha-image">{captchaCode}</div>
                <button type="button" className="captcha-refresh" onClick={handleRefreshCaptcha} aria-label="Refresh captcha">
                  <img src="/refresh_24.png" alt="Refresh" />
                </button>
                <input
                  type="text"
                  name="captcha"
                  placeholder=""
                  value={formData.captcha}
                  onChange={handleInputChange}
                  className="form-input captcha-input"
                />
                <button type="submit" className="search-button-inline" disabled={isLoading}>
                  {isLoading ? '...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Search Result Section */}
          <div className="gtu-result-section">
            <div className="section-header">
              <img
                src="/Exlam-small.gif"
                alt=""
                className="section-icon-result-img"
                aria-hidden="true"
              />
              <h2>SEARCH RESULT:</h2>
            </div>

            <div className="result-box">
              <div className="result-line">
                <div className="result-pair">
                  <span className="result-label">Name</span>
                  <span className="result-value">-----------</span>
                </div>
              </div>
              <div className="result-line">
                <div className="result-pair">
                  <span className="result-label">Enrollment No.</span>
                  <span className="result-value">-----------</span>
                </div>
              </div>
              <div className="result-line result-line-split">
                <div className="result-pair">
                  <span className="result-label">Exam Seat No.</span>
                  <span className="result-value">-----------</span>
                </div>
                <div className="result-pair">
                  <span className="result-label">Declared On</span>
                  <span className="result-value">-----------</span>
                </div>
              </div>
              <div className="result-line">
                <div className="result-pair">
                  <span className="result-label">Exam</span>
                  <span className="result-value">-----------</span>
                </div>
              </div>
              <div className="result-line">
                <div className="result-pair">
                  <span className="result-label">Branch</span>
                  <span className="result-value">-----------</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="gtu-info-box">
          <div className="info-content">
            <p className="info-heading">Enter search criteria and hit ?Search? button.</p>
            <hr />
            <p className="info-note">
              This is a Computer generated provisional result, please consider the Hard-copy Gradesheet as final result.<br />
              Result queries from Institute will be entertained till 15-days from the Result declaration date. No Result queries will be entertained afterwards.
            </p>
            <hr />
            <p className="info-social">
              GTU's Official Instagram Page: <a href="https://www.instagram.com/gtumedia?r=nametag">https://www.instagram.com/gtumedia?r=nametag</a><br />
              GTU's Official YouTube Channel: <a href="https://www.youtube.com/c/GujaratTechnologicalUniversity">https://www.youtube.com/c/GujaratTechnologicalUniversity</a>
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
