import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Poke Validator</h1>
        <div style={styles.rules}>
          <h2 style={styles.rulesTitle}>The the only PokeQuiz that will judge you honestly.</h2>
          <ul style={styles.rulesList}>
            <li>You'll will be presented with a category of Pokemon</li>
            <li>You'll then be presented with 2-4 Pokemon to choose from</li>
            <li>Choose which Pokemon you think is better, based on bias, taste, or just because.</li>
            <li>Depending on your choice, you'll receive a score based on how valid your choice is according to ME.</li>
            <li>Dont agree with my opinion? Feel free to leave a comment.</li>
            <li>At the end, see your score and detailed results of how valid you are as a person.</li>
          </ul>
        </div>
        <button style={styles.startButton} onClick={onStart}>
          Begin Judgement.
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: '20px',
  },
  content: {
    maxWidth: '600px',
    backgroundColor: '#2d2d2d',
    padding: '36px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    border: '1px solid #404040',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#e0e0e0',
    fontWeight: '700',
  },
  rules: {
    marginBottom: '24px',
  },
  rulesTitle: {
    fontSize: '1.3rem',
    marginBottom: '12px',
    color: '#d0d0d0',
    fontWeight: '600',
  },
  rulesList: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#b0b0b0',
    paddingLeft: '20px',
  },
  startButton: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '1.1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
};

export default StartScreen;

