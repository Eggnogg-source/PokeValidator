import React, { useEffect, useState } from 'react';

const NextButton = ({ onClick, disabled, isLastQuestion }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <button
      style={{
        ...styles.button,
        ...(disabled ? styles.disabled : {}),
        ...(isHovered && !disabled ? styles.buttonHover : {}),
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLastQuestion ? 'View Results' : 'Next Question'}
    </button>
  );
};

const styles = {
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    alignSelf: 'center',
    flexShrink: 0,
    width: '100%',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
    animation: 'slideInUp 0.5s ease-out 0.3s both',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
  },
  disabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

export default NextButton;

