import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeatMap from './HeatMap'; // Import the new HeatMap component

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const Game = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);


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
    setSelectedAnswer(selected);
    const isCorrect = selected === questionData.correct_answer;
    if (isCorrect) {
      setCorrectAnswer(selected);
      setMessage("Rätt!");
    } else {
      setCorrectAnswer(questionData.correct_answer);
      setMessage("Fel");
    }
    await submitAnswer(isCorrect);
    setTimeout(() => {
      fetchQuestion();
    }, 200);
  };

  const handleHomeClick = () => {
    navigate('/');
  };


  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl mb-8">Gångertabell</h1>
      {loading ? (
        <p className="text-xl">Genererar frågor...</p>
      ) : (
        questionData && (
          <div className="flex flex-col items-center">
            <p className="text-2xl mb-6">{questionData.question}</p>
            <div className="flex flex-row flex-wrap justify-center gap-4 mb-6">
              {/* ... (existing answer buttons code) */}
            </div>
            <p className="text-xl mb-6">{message}</p>
          </div>
        )
      )}
      <button 
        onClick={toggleHeatmap} 
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
      </button>
      {showHeatmap && <HeatMap />}
      <button 
        onClick={handleHomeClick} 
        className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Game;