import React, { useEffect, useState } from 'react';

const Meme = () => {
  const [questionData, setQuestionData] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchQuestion = async () => {
      const timestamp = new Date().getTime(); // Current timestamp
      try {
        const response = await fetch(`http://localhost:8000/get-question?ts=${timestamp}`, {
          method: 'GET',
          cache: 'no-store', // Prevent caching
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestionData(data); // Update the state with new data
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  if (!questionData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{questionData.question}</h2>
      <ul>
        {questionData.answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default Meme;
