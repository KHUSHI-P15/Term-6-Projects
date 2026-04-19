import React, { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import PhishingWarning from './components/PhishingWarning';

function App() {
  const [showWarning, setShowWarning] = useState(false);
  const [securityTips, setSecurityTips] = useState([]);

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.phished) {
        setSecurityTips(data.tips);
        setShowWarning(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    setShowWarning(false);
    setSecurityTips([]);
  };

  return (
    <div className="App">
      {!showWarning ? (
        <LoginPage onSubmit={handleLogin} />
      ) : (
        <PhishingWarning tips={securityTips} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
