import React, { useEffect, useState } from 'react';

const Game = () => {
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/get-question')
      .then(response => response.json())
      .then(data => setQuestionData(data))
      .catch(error => console.error('Error fetching question:', error));
  }, []);

  const sendResultToBackend = (answer, isCorrect) => {
    const data = {
      variables: questionData.variables, // Ensure questionData.id is defined
      selectedAnswer: answer.toString(), // Ensure answer is a string
      isCorrect: isCorrect,
    };

    // Print the content of the data object before sending
    console.log('Sending result to backend:', JSON.stringify(data, null, 2));

    fetch('http://localhost:8000/submit-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log('Result sent successfully:', data))
    .catch(error => console.error('Error sending result:', error));
  };

  if (!questionData) return <div>Loading...</div>;

  const handleAnswerClick = (answer) => {
    const isCorrect = answer === questionData.correct_answer; // Update as per your correct answer logic
    sendResultToBackend(answer, isCorrect);
  };

  return (
    <div>
      <h2>{questionData.question}</h2>
      {questionData.answers.map((answer, index) => (
        <button key={index} onClick={() => handleAnswerClick(answer)}>
          {answer}
        </button>
      ))}
    </div>
  );
};

export default Game;
