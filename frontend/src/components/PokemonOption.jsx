import React, { useState, useEffect } from 'react';

// Utility function to format Pokemon names properly
const formatPokemonName = (name) => {
  if (!name) return '';
  
  // Handle special cases
  const specialCases = {
    'mr-mime': 'Mr. Mime',
    'mime-jr': 'Mime Jr.',
    'nidoran-f': 'Nidoran♀',
    'nidoran-m': 'Nidoran♂',
    'farfetchd': "Farfetch'd",
    'sirfetchd': "Sirfetch'd",
  };
  
  const lowerName = name.toLowerCase();
  if (specialCases[lowerName]) {
    return specialCases[lowerName];
  }
  
  // Split by hyphens and capitalize each word
  const words = name.split('-');
  const formatted = words.map(word => {
    // Handle special characters
    if (word === 'm') return '♂';
    if (word === 'f') return '♀';
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  return formatted.join(' ');
};

const PokemonOption = ({ pokemon, onClick, disabled, isSelected, isExpanded, index = 0 }) => {
  const formattedName = formatPokemonName(pokemon.name);
  const displayName = formattedName || pokemon.name;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
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

  const handleClick = (e) => {
    if (!disabled && onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };


  return (
    <>
      <div 
        style={{
          ...styles.container,
          ...(isSelected ? styles.selected : {}),
          ...(isExpanded ? styles.expanded : {}),
          ...(disabled && !isSelected ? styles.disabled : {}),
          ...(isHovered && !disabled ? styles.hovered : {}),
          animation: `slideInFromLeft 0.4s ease-out ${index * 0.1}s both`,
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.imageWrapper}>
          <img
            src={pokemon.imageUrl}
            alt={displayName}
            style={{
              ...styles.image,
              ...(isSelected ? styles.selectedImage : {}),
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Pokemon';
            }}
            title={disabled ? 'Already selected' : isExpanded ? 'Click again to confirm' : 'Click to view details'}
          />
        </div>
        
        <h3 style={styles.name}>{displayName}</h3>
      </div>

    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#2d2d2d',
    borderRadius: '10px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#404040',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '160px',
    flexShrink: 0,
    cursor: 'pointer',
  },
  hovered: {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
    borderColor: '#505050',
  },
  selected: {
    borderColor: '#4CAF50',
    backgroundColor: '#1e3a1e',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
  },
  expanded: {
    borderColor: '#2196F3',
    backgroundColor: '#1a2a3a',
  },
  disabled: {
    opacity: 0.4,
    borderColor: '#505050',
    cursor: 'not-allowed',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  image: {
    width: '90px',
    height: '90px',
    objectFit: 'contain',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '8px',
  },
  selectedImage: {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)',
  },
  name: {
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '6px 0',
    textAlign: 'center',
    color: '#e0e0e0',
  },
};

export default PokemonOption;
