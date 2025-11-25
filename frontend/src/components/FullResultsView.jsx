import React from 'react';

const FullResultsView = ({ answers, onBack }) => {
  const resultTypeLabels = {
    super_valid: 'Super Valid (+15)',
    valid: 'Valid (+10)',
    understandable: 'Understandable (+5)',
    no: 'No (-10)',
    hell_no: 'Hell No (-20)',
  };

  const resultTypeColors = {
    super_valid: '#4CAF50',
    valid: '#8BC34A',
    understandable: '#FFC107',
    no: '#FF9800',
    hell_no: '#F44336',
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Full Results</h1>
      <div style={styles.resultsList}>
        {answers.map((answer, index) => (
          <div key={index} style={styles.resultItem}>
            <div style={styles.resultHeader}>
              <span style={styles.questionNumber}>Question {index + 1}</span>
              <span
                style={{
                  ...styles.resultType,
                  color: resultTypeColors[answer.resultType] || '#333',
                }}
              >
                {resultTypeLabels[answer.resultType] || answer.resultType}
              </span>
            </div>
            <div style={styles.pokemonName}>
              Selected: <strong>{answer.selectedPokemon}</strong>
            </div>
            <div style={styles.dialogue}>
              <p>{answer.dialogue}</p>
            </div>
          </div>
        ))}
      </div>
      <button style={styles.backButton} onClick={onBack}>
        Back to Results
      </button>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  resultItem: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  questionNumber: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  resultType: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  pokemonName: {
    fontSize: '1.1rem',
    marginBottom: '15px',
    color: '#666',
  },
  dialogue: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  backButton: {
    marginTop: '30px',
    padding: '15px 30px',
    fontSize: '1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
  },
};

export default FullResultsView;

