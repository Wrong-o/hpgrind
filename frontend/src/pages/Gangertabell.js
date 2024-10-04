import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const Game = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null); // State för valt svar
  const [correctAnswer, setCorrectAnswer] = useState(null); // State för korrekt svar

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await api.get('/get-question');
      setQuestionData(response.data);
      setLoading(false);
      setMessage("");
      setSelectedAnswer(null); // Återställ valt svar
      setCorrectAnswer(null); // Återställ korrekt svar
    } catch (error) {
      console.error("Error fetching question:", error);
      setLoading(false);
    }
  };

  const submitAnswer = async (isCorrect) => {
    try {
      if (!questionData || !questionData.variables || questionData.variables.length < 2) {
        console.error("Question data is incomplete");
        return;
      }
      const [x, y] = questionData.variables;
      const response = await api.post('/submit-answer', {
        x: x,
        y: y,
        is_correct: isCorrect
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error submitting answer:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswerClick = async (selected) => {
    setSelectedAnswer(selected); // Spara det valda svaret
    const isCorrect = selected === questionData.correct_answer;
    if (isCorrect) {
      setCorrectAnswer(selected); // Spara korrekt svar
      setMessage("Correct! Fetching a new question...");
    } else {
      setCorrectAnswer(questionData.correct_answer); // Visa korrekt svar
      setMessage("Incorrect! Try again...");
    }

    // Submit the answer to the backend
    await submitAnswer(isCorrect);

    // Fetch a new question after a short delay
    setTimeout(() => {
      fetchQuestion();
    }, 1500);
  };

  const handleGameClick = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Game Page</h1>
      {loading ? (
        <p>Loading question...</p>
      ) : (
        questionData && (
          <>
            <p>{questionData.question}</p>
            <ul>
              {questionData.answers.map((answer, index) => {
                // Bestäm stilen för knappen
                let buttonStyle = {
                  cursor: 'pointer',
                  padding: '10px',
                  border: '1px solid black',
                  margin: '5px',
                  display: 'inline-block',
                  backgroundColor: 'gray',
                };

                // Om användaren har valt ett svar
                if (selectedAnswer) {
                  if (answer === correctAnswer) {
                    buttonStyle.backgroundColor = 'green'; // Grön för korrekt svar
                  } else if (answer === selectedAnswer) {
                    buttonStyle.backgroundColor = 'red'; // Röd för fel svar
                  }
                }

                return (
                  <li
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    style={buttonStyle}
                  >
                    {answer}
                  </li>
                );
              })}
            </ul>
            <p>{message}</p>
          </>
        )
      )}
      <button onClick={handleGameClick} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none' }}>Go to Home</button>
    </div>
  );
};

export default Game;
