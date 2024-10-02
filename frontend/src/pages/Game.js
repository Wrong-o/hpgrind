import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Game = () => {
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            //const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-question`);
            const response = await axios.get('http://13.60.217.156:8000/get-question');
            setQuestionData(response.data);
            setLoading(false);
            setMessage("");
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

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/submit-answer`, {
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

    const handleAnswerClick = async (selectedAnswer) => {
        const isCorrect = selectedAnswer === questionData.correct_answer;
        if (isCorrect) {
            setMessage("Correct! Fetching a new question...");
        } else {
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
                            {questionData.answers.map((answer, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleAnswerClick(answer)}
                                    style={{ cursor: 'pointer', padding: '5px', border: '1px solid black', margin: '5px', display: 'inline-block' }}
                                >
                                    {answer}
                                </li>
                            ))}
                        </ul>
                        <p>{message}</p>
                    </>
                )
            )}
            <button onClick={handleGameClick}>Go to Home</button>
        </div>
    );
};

export default Game;