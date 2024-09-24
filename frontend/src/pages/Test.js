import React, { useEffect, useState } from 'react';

const Game = () => {
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/get-question')
      .then(response => response.json())
      .then(data => setQuestionData(data))
      .catch(error => console.error('Error fetching question:', error));
  }, []);

  if (!questionData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{questionData.question}</h2>

      <button>{questionData.answers[0]}</button>
      <button>{questionData.answers[1]}</button>
      <button>{questionData.answers[2]}</button>
      <button>{questionData.answers[3]}</button>
      </div>
  );
};

export default Game;
