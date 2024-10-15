import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

function useQuestionGetter() {
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const getQuestion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/get-question');
      setQuestionData(response.data);
      setLoading(false);
      setMessage("");
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    } catch (error) {
      console.error("Error fetching question:", error);
      setLoading(false);
      setMessage("Failed to fetch question. Please try again.");
    }
  }, []);

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = async () => {
    if (!selectedAnswer) {
      setMessage("Please select an answer before submitting.");
      return;
    }

    try {
      const response = await api.post('/submit-answer', { answer: selectedAnswer });
      setCorrectAnswer(response.data.correctAnswer);
      setMessage(response.data.message || "Answer submitted successfully.");
    } catch (error) {
      console.error("Error submitting answer:", error);
      setMessage("Failed to submit answer. Please try again.");
    }
  };

  return { 
    loading, 
    questionData, 
    message, 
    selectedAnswer, 
    correctAnswer, 
    getQuestion, 
    selectAnswer, 
    submitAnswer 
  };
}

export default useQuestionGetter;