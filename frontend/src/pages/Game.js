
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Game = () => {
    const navigate = useNavigate();

    const handleGameClick= () =>{
        navigate('/');
    }
  return (
    <div>
      <h1>Game Page</h1>
      <p>Welcome to the game!</p>
      <button onClick={handleGameClick}>Go to Home</button>
    </div>
  );
};

export default Game;
