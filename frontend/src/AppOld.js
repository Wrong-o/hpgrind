import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { motion } from 'framer-motion';

const QuizApp = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState([]);

  // Gångertabell game state
  const [isGångertabell, setIsGångertabell] = useState(false);
  const [gangerQuestion, setGangerQuestion] = useState({});
  const [gangerAnswers, setGangerAnswers] = useState([]);
  const [gangerScore, setGangerScore] = useState(0);
  const [gangerGameOver, setGangerGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalAnswers, setTotalAnswers] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('/question.json');
      const data = await response.json();
      const shuffledQuestions = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
    };
    fetchQuestions();
  }, []);

  const generateGangerQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;
    const wrongAnswers = new Set();

    while (wrongAnswers.size < 3) {
      const wrongAnswer = Math.floor(Math.random() * 100) + 1;
      if (wrongAnswer !== correctAnswer) {
        wrongAnswers.add(wrongAnswer);
      }
    }

    const allAnswers = Array.from(wrongAnswers).concat(correctAnswer);
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    setGangerQuestion({ num1, num2, correctAnswer });
    setGangerAnswers(shuffledAnswers);
  }, []);

  useEffect(() => {
    if (isGångertabell && !gangerGameOver) {
      generateGangerQuestion();
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGangerGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGångertabell, gangerGameOver, generateGangerQuestion]);

  const handleGangerAnswer = (selectedOption) => {
    setTotalAnswers((prev) => prev + 1);
    if (selectedOption === gangerQuestion.correctAnswer) {
      setGangerScore((prev) => prev + 1);
    }
    generateGangerQuestion();
  };

  const startGangerGame = () => {
    setIsGångertabell(true);
    setMenuVisible(false);
    setGangerScore(0);
    setTotalAnswers(0);
    setGangerGameOver(false);
    setTimeLeft(15);
  };

  const handleAnswer = (selectedOption) => {
    setUserAnswers((prev) => [...prev, selectedOption]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      checkMissedQuestions();
    }
  };

  const checkMissedQuestions = () => {
    const missed = questions.filter((question, index) => userAnswers[index] !== question.correct_answer);
    setMissedQuestions(missed);
  };

  const correctAnswersCount = () => {
    return userAnswers.filter((answer, index) => answer === questions[index].correct_answer).length;
  };

  const restartQuiz = () => {
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    const shuffledMissedQuestions = missedQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffledMissedQuestions);
  };

  const startQuiz = (category) => {
    if (category === 'Kvadratrot') {
      const kvadratrotQuestions = questions.filter(q => q.category === 'Kvadratrot');
      setQuestions(kvadratrotQuestions);
      setCurrentQuestionIndex(0);
      setIsFinished(false);
      setMenuVisible(false);
    }
  };

  const resetAllGames = () => {
    setIsGångertabell(false);
    setGangerGameOver(false);
    setGangerScore(0);
    setTotalAnswers(0);
    setTimeLeft(15);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  if (menuVisible) {
    return (
      <div className="App">
        <h1>Huvudmeny</h1>
        <button onClick={() => { resetAllGames(); startQuiz('Kvadratrot'); }}>Kvadratrot</button>
        <button onClick={() => { resetAllGames(); startGangerGame(); }}>Gångertabell</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="App">
        <h1>Quiz avslutat!</h1>
        <p>Rätta svar: {correctAnswersCount()} av {questions.length}</p>
        <h2>Resultat</h2>
        <table>
          <thead>
            <tr>
              <th>Fråga</th>
              <th>Ditt svar</th>
              <th>Rätt svar</th>
              <th>Resultat</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;
              return (
                <tr key={index}>
                  <td>{question.text}</td>
                  <td>{userAnswer || 'N/A'}</td>
                  <td>{question.correct_answer}</td>
                  <td>{isCorrect ? 'Rätt' : 'Fel'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={restartQuiz}>Försök med missade frågor</button>
        <button onClick={() => { resetAllGames(); setMenuVisible(true); }}>Tillbaka till menyn</button>
      </div>
    );
  }

  if (isGångertabell) {
    if (gangerGameOver) {
      const percentage = totalAnswers > 0 ? (gangerScore / totalAnswers) * 100 : 0;
      return (
        <div className="App">
          <h1>Spelet är slut!</h1>
          <p>Rätta svar: {gangerScore} av {totalAnswers}</p>
          <p>Procent: {percentage.toFixed(2)}%</p>
          <button onClick={() => { resetAllGames(); setMenuVisible(true); }}>Tillbaka till menyn</button>
        </div>
      );
    }

    return (
      <div className="App">
        <h2>Tid kvar: {timeLeft} sekunder</h2>
        <h2>{gangerQuestion.num1} x {gangerQuestion.num2} = ?</h2>
        <div>
          {gangerAnswers.map((answer, index) => (
            <button key={index} onClick={() => handleGangerAnswer(answer)}>
              {answer}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="App">Laddar frågor...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="App">
      <h2>{currentQuestion.text}</h2>
      <div>
        {currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizApp;