import React, { useState, useEffect } from 'react';
import { getQuestion, submitAnswer } from '../services/api';
import PokemonOption from './PokemonOption';
import PokemonExpandedView from './PokemonExpandedView';
import FeedbackDisplay from './FeedbackDisplay';
import CommentSection from './CommentSection';
import NextButton from './NextButton';

const QuizInterface = ({ questionId, onNext, onComplete, onAnswerSubmit }) => {
  const [question, setQuestion] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [expandedPokemon, setExpandedPokemon] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  // Add animation keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
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
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedPokemon(null);
    setExpandedPokemon(null);
    setFeedback(null);
    try {
      const data = await getQuestion(questionId);
      console.log('Loaded question data:', {
        categoryName: data.categoryName,
        pokemonCount: data.pokemonCount,
        pokemonArrayLength: data.pokemon?.length,
        pokemonNames: data.pokemon?.map(p => p.name)
      });
      setQuestion(data);
    } catch (error) {
      console.error('Error loading question:', error);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSelect = async (pokemonName) => {
    if (selectedPokemon) return; // Already selected

    setSelectedPokemon(pokemonName);
    try {
      const result = await submitAnswer(questionId, pokemonName);
      setFeedback(result);
      
      // Calculate points for score tracking
      const points = {
        super_valid: 15,
        valid: 10,
        understandable: 5,
        no: -10,
        hell_no: -20,
      }[result.resultType] || 0;

      // Notify parent component of answer
      if (onAnswerSubmit) {
        onAnswerSubmit({
          questionId,
          selectedPokemon: pokemonName,
          resultType: result.resultType,
          dialogue: result.dialogue,
          points,
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer');
    }
  };

  const handlePokemonClick = (pokemon) => {
    if (selectedPokemon) return; // Already selected
    const pokemonName = pokemon.originalName || pokemon.name;
    if (expandedPokemon === pokemonName) {
      // Second click - confirm selection
      handlePokemonSelect(pokemonName);
      setExpandedPokemon(null);
    } else {
      // First click - expand view
      setExpandedPokemon(pokemonName);
    }
  };

  const handleExpandedConfirm = () => {
    if (expandedPokemon) {
      handlePokemonSelect(expandedPokemon);
      setExpandedPokemon(null);
    }
  };

  const handleExpandedClose = () => {
    setExpandedPokemon(null);
  };

  const handleNext = () => {
    if (onComplete && questionId === null) {
      onComplete();
    } else {
      onNext();
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading question...</div>;
  }

  if (error || !question) {
    return <div style={styles.error}>{error || 'Question not found'}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.categoryName}>{question.categoryName}</h2>
      <div style={styles.mainContent}>
        <div style={styles.leftSection}>
          <div style={styles.pokemonGrid}>
            {question.pokemon.map((pokemon, index) => {
              const pokemonName = pokemon.originalName || pokemon.name;
              return (
                <PokemonOption
                  key={index}
                  pokemon={pokemon}
                  onClick={() => handlePokemonClick(pokemon)}
                  disabled={selectedPokemon !== null}
                  isSelected={selectedPokemon === pokemonName}
                  isExpanded={expandedPokemon === pokemonName}
                  index={index}
                />
              );
            })}
          </div>
        </div>

        <div style={styles.middleSection}>
          {(() => {
            // Show expanded view if there's an expanded pokemon or if we have feedback (to show in background)
            const expandedPokemonData = expandedPokemon && !selectedPokemon
              ? question.pokemon.find(p => (p.originalName || p.name) === expandedPokemon)
              : feedback
              ? question.pokemon.find(p => (p.originalName || p.name) === feedback.selectedPokemon)
              : null;

            return (
              <>
                {expandedPokemonData ? (
                  <PokemonExpandedView
                    pokemon={expandedPokemonData}
                    onConfirm={expandedPokemon && !selectedPokemon ? handleExpandedConfirm : undefined}
                    onClose={expandedPokemon && !selectedPokemon ? handleExpandedClose : undefined}
                    isBackground={!!feedback}
                  />
                ) : !expandedPokemon && !feedback ? (
                  <div style={styles.emptyMiddle}>
                    <p style={styles.emptyText}>Click a Pokemon to view details</p>
                  </div>
                ) : null}
                
                {feedback && (
                  <>
                    <div style={styles.backdrop}></div>
                    <div style={styles.feedbackOverlayWrapper}>
                      <div style={styles.feedbackOverlay}>
                        <FeedbackDisplay
                          resultType={feedback.resultType}
                          dialogue={feedback.dialogue}
                          selectedPokemon={feedback.selectedPokemon}
                        />
                        <NextButton
                          onClick={handleNext}
                          disabled={false}
                          isLastQuestion={onComplete !== undefined}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>

        <div style={styles.rightSection}>
          {feedback ? (
            <CommentSection
              questionId={questionId}
              selectedPokemon={feedback.selectedPokemon}
              allPokemon={question.pokemon}
            />
          ) : (
            <div style={styles.emptyRight}>
              <p style={styles.emptyText}>Comments will appear after selection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '8px 12px',
    maxWidth: '100%',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
  },
  categoryName: {
    fontSize: '1.3rem',
    textAlign: 'center',
    marginBottom: '8px',
    marginTop: '4px',
    color: '#e0e0e0',
    fontWeight: '600',
    flexShrink: 0,
    animation: 'fadeIn 0.5s ease-out',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '1400px',
    justifyContent: 'center',
  },
  leftSection: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    height: '100%',
  },
  pokemonGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '2px',
    maxHeight: '100%',
    alignItems: 'center',
  },
  middleSection: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
    maxWidth: '500px',
    height: '100%',
    overflow: 'hidden',
    minHeight: 0,
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 99,
    pointerEvents: 'auto',
    animation: 'fadeIn 0.3s ease-out',
  },
  feedbackOverlayWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
    width: '90%',
    maxWidth: '450px',
    pointerEvents: 'none',
  },
  feedbackOverlay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
    animation: 'fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  rightSection: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
    width: '350px',
    height: '100%',
    overflow: 'hidden',
  },
  emptyMiddle: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: '10px',
    border: '2px solid #404040',
    minHeight: '200px',
  },
  emptyRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: '10px',
    border: '2px solid #404040',
    minHeight: '200px',
  },
  emptyText: {
    color: '#808080',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem',
    color: '#b0b0b0',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem',
    color: '#F44336',
  },
};

export default QuizInterface;


