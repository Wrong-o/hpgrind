import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGameClick = () => {
    navigate('/game'); // Navigate to Game page
  };

  const handleRegisterClick = () => {
    navigate('/Register'); // Navigate to Register page
  };

  const handleLoginClick = () => {
    navigate('/Login'); // Navigate to Login page
  };

  return (
    <div>
      <h1>Welcome to the Application</h1>
      <button onClick={handleGameClick}>Go to Game</button>
      <button onClick={handleRegisterClick}>Go to Register</button>
      <button onClick={handleLoginClick}>Go to Login</button>

    </div>
  );
};

export default Home;
