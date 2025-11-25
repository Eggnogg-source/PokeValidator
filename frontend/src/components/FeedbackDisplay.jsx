import React from 'react';

const FeedbackDisplay = ({ resultType, dialogue, selectedPokemon }) => {
  // Add animation keyframes
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const resultTypeConfig = {
    super_valid: {
      label: 'Super Valid',
      color: '#4CAF50',
      points: '+15',
    },
    valid: {
      label: 'Valid',
      color: '#8BC34A',
      points: '+10',
    },
    understandable: {
      label: 'Understandable',
      color: '#FFC107',
      points: '+5',
    },
    no: {
      label: 'No',
      color: '#FF9800',
      points: '-10',
    },
    hell_no: {
      label: 'Hell No',
      color: '#F44336',
      points: '-20',
    },
  };

  const config = resultTypeConfig[resultType] || resultTypeConfig.understandable;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.badge, backgroundColor: config.color }}>
        <span style={styles.badgeLabel}>{config.label}</span>
        <span style={styles.badgePoints}>{config.points}</span>
      </div>
      <div style={styles.dialogue}>
        <p style={styles.dialogueText}>{dialogue}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 24px',
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    border: '2px solid #404040',
    flexShrink: 0,
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    animation: 'fadeInScale 0.4s ease-out',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    marginBottom: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
    animation: 'slideInUp 0.5s ease-out 0.1s both',
  },
  badgeLabel: {
    fontSize: '0.95rem',
  },
  badgePoints: {
    fontSize: '0.85rem',
    opacity: 0.95,
  },
  dialogue: {
    marginTop: '8px',
    animation: 'slideInUp 0.5s ease-out 0.2s both',
  },
  dialogueText: {
    fontSize: '1.1rem',
    lineHeight: '1.5',
    color: '#e0e0e0',
    margin: 0,
    wordWrap: 'break-word',
    fontWeight: '500',
  },
};

export default FeedbackDisplay;

