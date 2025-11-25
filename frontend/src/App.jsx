import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizInterface from './components/QuizInterface';
import ResultsScreen from './components/ResultsScreen';
import FullResultsView from './components/FullResultsView';
import { getQuestions } from './services/api';

const SCREENS = {
  START: 'start',
  QUIZ: 'quiz',
  LOADING_RESULTS: 'loading_results',
  RESULTS: 'results',
  FULL_RESULTS: 'full_results',
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.START);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getQuestions();
      if (!data || data.length === 0) {
        setError('No questions found. The database may not be seeded. Please contact the administrator.');
      } else {
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setError(`Failed to load questions: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (questions.length === 0) {
      setError('Cannot start quiz: No questions available. Please try reloading.');
      return;
    }
    setCurrentScreen(SCREENS.QUIZ);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  };

  const handleAnswerSubmit = (answerData) => {
    setAnswers([...answers, answerData]);
    setScore(score + answerData.points);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setCurrentScreen(SCREENS.LOADING_RESULTS);
    // Show loading screen for 3 seconds before showing results
    setTimeout(() => {
      setCurrentScreen(SCREENS.RESULTS);
    }, 3000);
  };

  const handleViewFullResults = () => {
    setCurrentScreen(SCREENS.FULL_RESULTS);
  };

  const handleBackToResults = () => {
    setCurrentScreen(SCREENS.RESULTS);
  };

  const handleBackToStart = () => {
    setCurrentScreen(SCREENS.START);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  };

  const calculatePercentage = () => {
    if (questions.length === 0) return 0;
    // Calculate max possible points (assuming all super_valid = 15 points each)
    const maxPoints = questions.length * 15;
    // Calculate minimum possible points (assuming all hell_no = -20 points each)
    const minPoints = questions.length * -20;
    // Normalize score to percentage
    const range = maxPoints - minPoints;
    const normalizedScore = score - minPoints;
    return (normalizedScore / range) * 100;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading quiz...
      </div>
    );
  }

  // Error display component
  const ErrorDisplay = () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: '#2d2d2d',
        padding: '36px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #404040',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '1.5rem' }}>
          Error Loading Quiz
        </h2>
        <p style={{ color: '#b0b0b0', marginBottom: '24px', lineHeight: '1.6' }}>
          {error}
        </p>
        <button
          onClick={loadQuestions}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Show error if there's an error or no questions after loading
  if (error || (!loading && questions.length === 0)) {
    return <ErrorDisplay />;
  }

  return (
    <div className="App">
      {currentScreen === SCREENS.START && (
        <StartScreen onStart={handleStart} />
      )}

      {currentScreen === SCREENS.QUIZ && questions.length > 0 && (
        <QuizInterface
          questionId={questions[currentQuestionIndex]?.id}
          onNext={handleNextQuestion}
          onComplete={currentQuestionIndex === questions.length - 1 ? handleComplete : undefined}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {currentScreen === SCREENS.LOADING_RESULTS && (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: '20px',
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            color: '#333',
            maxWidth: '600px',
          }}>
            After this, the designs get a lot more boring, so lets calculate your score!
          </div>
        </div>
      )}

      {currentScreen === SCREENS.RESULTS && (
        <ResultsScreen
          score={score}
          percentage={calculatePercentage()}
          answers={answers}
          onViewFullResults={handleViewFullResults}
          onBackToStart={handleBackToStart}
        />
      )}

      {currentScreen === SCREENS.FULL_RESULTS && (
        <FullResultsView
          answers={answers}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
}

export default App;
