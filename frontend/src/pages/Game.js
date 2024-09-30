import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const Game = () => {
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); // Message to display feedback

    // Function to fetch the question from the FastAPI backend
    const fetchQuestion = async () => {
        try {
            setLoading(true); // Set loading to true when fetching new question
            const response = await axios.get('http://localhost:8000/get-question'); // Adjust the URL to your FastAPI server
            setQuestionData(response.data);
            setLoading(false); // Set loading to false once the data is fetched
            setMessage(""); // Clear any previous message
        } catch (error) {
            console.error("Error fetching question:", error);
            setLoading(false);
        }
    };

    // Fetch the question when the component mounts
    useEffect(() => {
        fetchQuestion();
    }, []);

    // Handle answer click
    const handleAnswerClick = (selectedAnswer) => {
        if (selectedAnswer === questionData.correct_answer) {
            setMessage("Correct! Fetching a new question...");
        } else {
            setMessage("Incorrect! Try again...");
        }

        // Fetch a new question after a short delay
        setTimeout(() => {
            fetchQuestion();
        }, 0); // 1.5 seconds delay before fetching new question
    };

    // Handle going back to the home page
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
                                    onClick={() => handleAnswerClick(answer)} // Make the answer clickable
                                    style={{ cursor: 'pointer', padding: '5px', border: '1px solid black', margin: '5px', display: 'inline-block' }}
                                >
                                    {answer}
                                </li>
                            ))}
                        </ul>
                        <p>{message}</p> {/* Feedback message */}
                    </>
                )
            )}
            <button onClick={handleGameClick}>Go to Home</button>
        </div>
    );
};

export default Game;
