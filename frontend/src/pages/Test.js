import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGameClick = () => {
    navigate('/game');
  };
  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleGameClick}>Go to Game</button>
      <button onClick={handleHomeClick}>Go to Home</button>
    </div>
  );
};

export default Home;