import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login'; // Adjust the path if necessary

const Home = () => {
  const navigate = useNavigate();

  const handleGameClick = () => {
    navigate('/game'); // Navigate to Game page
  };

  const handleTestClick = () => {
    navigate('/test'); // Navigate to Test page
  };

  const handleProfileClick = () => {
    navigate('/Profile'); // Navigate to Test page
  };

  return (
    <div>
      <h1>Time</h1>
      <Login />
      <button onClick={handleGameClick}>Go to Game</button>
      <button onClick={handleTestClick}>Go to Test</button> 
      <button onClick={handleProfileClick}>Go to Profile</button> 
    </div>
  );
};

export default Home;
