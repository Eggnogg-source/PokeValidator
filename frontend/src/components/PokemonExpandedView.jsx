import React, { useEffect, useMemo } from 'react';

// Utility function to format Pokemon names properly
const formatPokemonName = (name) => {
  if (!name) return '';
  
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
  
  const words = name.split('-');
  const formatted = words.map(word => {
    if (word === 'm') return '♂';
    if (word === 'f') return '♀';
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  return formatted.join(' ');
};

const formatAbilityName = (name) => {
  if (!name) return 'Unknown';
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
};

const PokemonExpandedView = ({ pokemon, onConfirm, onClose, isBackground = false }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInExpand {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
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

  if (!pokemon) return null;

  const formattedName = formatPokemonName(pokemon.name);
  const displayName = formattedName || pokemon.name;
  const baseAbilityName = pokemon.ability?.name || '';
  const hiddenAbilityName = pokemon.hiddenAbility?.name || '';
  const shouldShowHiddenAbility =
    hiddenAbilityName &&
    (!baseAbilityName || hiddenAbilityName.toLowerCase() !== baseAbilityName.toLowerCase());

  const expandedImageSrc = useMemo(() => {
    if (pokemon.officialArtworkUrl) {
      return pokemon.officialArtworkUrl;
    }
    const preferred = pokemon.expandedImageUrl || pokemon.alternativeImageUrl;
    if (preferred && preferred !== pokemon.imageUrl) {
      return preferred;
    }
    return pokemon.imageUrl || 'https://via.placeholder.com/300?text=Pokemon';
  }, [pokemon]);

  return (
    <div 
      style={{
        ...styles.container,
        ...(isBackground ? {} : { animation: 'fadeInExpand 0.4s ease-out' }),
      }}
    >
      {!isBackground && onClose && (
        <button 
          style={styles.closeButton} 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#505050';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#404040';
            e.target.style.transform = 'scale(1)';
          }}
        >×</button>
      )}
      <div style={styles.content}>
        <div style={styles.imageContainer}>
          <img
            src={expandedImageSrc}
            alt={displayName}
            style={{
              ...styles.image,
              ...(isBackground ? {} : { animation: 'fadeInUp 0.5s ease-out 0.1s both' }),
              ...(onConfirm && !isBackground ? styles.clickableImage : {}),
            }}
            onClick={onConfirm && !isBackground ? (e) => {
              e.stopPropagation();
              onConfirm();
            } : undefined}
            onError={(e) => {
              e.target.src = pokemon.imageUrl || 'https://via.placeholder.com/300?text=Pokemon';
            }}
          />
        </div>
        <h3 style={{
          ...styles.name,
          ...(isBackground ? {} : { animation: 'fadeInUp 0.5s ease-out 0.2s both' }),
        }}>{displayName}</h3>
        {!isBackground && onConfirm && <p style={styles.hint}>Click the image to confirm selection</p>}
        
        <div style={{
          ...styles.stats,
          ...(isBackground ? {} : { animation: 'fadeInUp 0.5s ease-out 0.3s both' }),
        }}>
          <h4 style={styles.statsTitle}>Base Stats</h4>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>HP:</span>
              <span style={styles.statValue}>{pokemon.stats.hp}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Attack:</span>
              <span style={styles.statValue}>{pokemon.stats.attack}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Defense:</span>
              <span style={styles.statValue}>{pokemon.stats.defense}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Sp. Atk:</span>
              <span style={styles.statValue}>{pokemon.stats.spAttack}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Sp. Def:</span>
              <span style={styles.statValue}>{pokemon.stats.spDefense}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Speed:</span>
              <span style={styles.statValue}>{pokemon.stats.speed}</span>
            </div>
          </div>
        </div>

        <div style={{
          ...styles.ability,
          ...(isBackground ? {} : { animation: 'fadeInUp 0.5s ease-out 0.4s both' }),
        }}>
          <h4 style={styles.abilityTitle}>Ability</h4>
          <p style={styles.abilityName}>{formatAbilityName(pokemon.ability.name)}</p>
          <p style={styles.abilityDescription}>{pokemon.ability.description}</p>
        </div>

        {shouldShowHiddenAbility && (
          <div style={{
            ...styles.ability,
            ...(isBackground ? {} : { animation: 'fadeInUp 0.5s ease-out 0.45s both' }),
          }}>
            <h4 style={styles.abilityTitle}>Hidden Ability</h4>
            <p style={styles.abilityName}>{formatAbilityName(hiddenAbilityName)}</p>
            <p style={styles.abilityDescription}>{pokemon.hiddenAbility.description}</p>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    padding: '12px',
    backgroundColor: '#2d2d2d',
    borderRadius: '10px',
    border: '2px solid #404040',
    cursor: 'pointer',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    minHeight: 0,
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#404040',
    color: '#e0e0e0',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
    zIndex: 10,
    transition: 'all 0.2s ease',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 0,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px',
  },
  image: {
    width: '280px',
    height: '280px',
    objectFit: 'contain',
    borderRadius: '10px',
    transition: 'transform 0.3s ease',
  },
  clickableImage: {
    cursor: 'pointer',
  },
  name: {
    fontSize: '1.2rem',
    fontWeight: '700',
    textAlign: 'center',
    color: '#e0e0e0',
    marginBottom: '6px',
  },
  hint: {
    fontSize: '0.85rem',
    textAlign: 'center',
    color: '#b0b0b0',
    marginBottom: '10px',
    fontStyle: 'italic',
  },
  stats: {
    width: '100%',
    marginBottom: '10px',
  },
  statsTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#d0d0d0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  statLabel: {
    fontWeight: '500',
    color: '#b0b0b0',
  },
  statValue: {
    color: '#e0e0e0',
    fontWeight: '600',
  },
  ability: {
    width: '100%',
    paddingTop: '10px',
    borderTop: '1px solid #404040',
    marginBottom: '10px',
  },
  abilityTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#d0d0d0',
  },
  abilityName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#e0e0e0',
  },
  abilityDescription: {
    fontSize: '0.8rem',
    color: '#b0b0b0',
    lineHeight: '1.4',
    wordWrap: 'break-word',
    maxHeight: '100px',
    overflowY: 'auto',
  },
};

export default PokemonExpandedView;

