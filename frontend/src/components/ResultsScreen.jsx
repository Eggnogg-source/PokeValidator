import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const ResultsScreen = ({ score, percentage, answers, onViewFullResults, onBackToStart }) => {
  const resultsRef = useRef(null);

  const getPercentageDialogue = (percentage) => {
    if (percentage > 85) {
      return "You know your way around a good pokemon, and we'd probably get along very well! You my twin fr fr. Good for you!";
    } else if (percentage >= 75) {
      return "Honestly, could be a lot worse. You would be a dope friend on PS4 or something like that.";
    } else if (percentage >= 65) {
      return "I mean, we could be associates at most. I couldn't care less. No respect, but ill fake it.";
    } else {
      return "Don't even look me in the eye if we meet each other in public. I'll have to restrain myself from wanting to square up.";
    }
  };

  const getResultTitle = (percentage) => {
    if (percentage > 85) {
      return "YOU ARE... Valid";
    } else if (percentage >= 75) {
      return "YOU ARE... Cool!";
    } else if (percentage >= 65) {
      return "YOU ARE... Eeeh!";
    } else {
      return "YOU ARE... Way too close, 6 feet bub.";
    }
  };

  const handleScreenshot = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `pokemon-quiz-results-${percentage}%.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error taking screenshot:', error);
      alert('Failed to take screenshot');
    }
  };

  return (
    <div style={styles.container}>
      <div ref={resultsRef} style={styles.resultsCard}>
        <h1 style={styles.title}>{getResultTitle(percentage)}</h1>
        <div style={styles.scoreSection}>
          <div style={styles.percentage}>{percentage.toFixed(1)}%</div>
          <div style={styles.points}>Total Points: {score}</div>
        </div>
        <div style={styles.dialogueSection}>
          <p style={styles.dialogue}>{getPercentageDialogue(percentage)}</p>
        </div>
      </div>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={handleScreenshot}>
          Screenshot Results
        </button>
        <button style={styles.button} onClick={onViewFullResults}>
          See Full Results
        </button>
        <button style={styles.button} onClick={onBackToStart}>
          Back to Start
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  resultsCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#333',
  },
  scoreSection: {
    marginBottom: '30px',
  },
  percentage: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '10px',
  },
  points: {
    fontSize: '1.5rem',
    color: '#666',
  },
  dialogueSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  dialogue: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    color: '#333',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
};

export default ResultsScreen;

