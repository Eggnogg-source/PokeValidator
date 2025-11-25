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

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
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
