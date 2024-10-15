import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import useQuestionGetter from '../components/QuestionGetter';

const App = () => {
  const {
    loading,
    questionData,
    message,
    selectedAnswer,
    correctAnswer,
    getQuestion,
    selectAnswer,
    submitAnswer
  } = useQuestionGetter();

  const renderMathEquation = (equation) => {
    return <BlockMath math={equation} />;
  };

  const renderAnswers = () => {
    if (!questionData || !questionData.answers) return null;
    
    return questionData.answers.map((answer, index) => (
      <button
        key={index}
        onClick={() => selectAnswer(answer)}
        style={{ 
          backgroundColor: selectedAnswer === answer ? '#e0e0e0' : 'white',
          margin: '5px',
          padding: '10px'
        }}
      >
        <InlineMath math={answer} />
      </button>
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Math Equation Display</h1>
      {loading ? (
        <p>Loading question...</p>
      ) : questionData ? (
        <div>
          <h2>Question:</h2>
          {renderMathEquation(questionData.question)}
          <h3>Choose your answer:</h3>
          {renderAnswers()}
          <button onClick={submitAnswer} style={{ marginTop: '20px', padding: '10px' }}>
            Submit Answer
          </button>
          {message && <p>{message}</p>}
          {correctAnswer && (
            <div>
              <h3>Correct Answer:</h3>
              {renderMathEquation(correctAnswer)}
            </div>
          )}
          <button onClick={getQuestion} style={{ marginTop: '20px', padding: '10px' }}>
            Get New Question
          </button>
        </div>
      ) : (
        <p>No question data available. Click "Get New Question" to start.</p>
      )}
    </div>
  );
};

export default App;