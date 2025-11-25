import React, { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment as deleteCommentApi } from '../services/api';

// Utility function to format Pokemon names (same as in PokemonOption)
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

// Generate color for Pokemon based on name
const getPokemonColor = (pokemonName, allPokemon) => {
  if (!allPokemon || allPokemon.length === 0) return '#4CAF50';
  
  const index = allPokemon.findIndex(p => 
    (p.originalName || p.name).toLowerCase() === pokemonName.toLowerCase()
  );
  
  if (index === -1) return '#4CAF50';
  
  // Color palette for Pokemon flags
  const colors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#F44336', // Red
  ];
  
  return colors[index % colors.length];
};

const CommentSection = ({ questionId, selectedPokemon, allPokemon }) => {
  const [comments, setComments] = useState([]);
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
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

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    try {
      const data = await getComments(questionId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) return;

    setDeletingId(commentId);
    try {
      await deleteCommentApi(commentId);
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commenterName.trim() || !commentText.trim() || !selectedPokemon) {
      return;
    }

    setLoading(true);
    try {
      await addComment(questionId, selectedPokemon, commenterName, commentText);
      setCommenterName('');
      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comments</h3>
      {selectedPokemon && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Your name"
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
      <div style={styles.commentsList}>
        {comments.length === 0 ? (
          <p style={styles.noComments}>No comments yet. Be the first!</p>
        ) : (
          comments.map((comment, index) => {
            const pokemonColor = getPokemonColor(comment.pokemon_name, allPokemon);
            const pokemonDisplayName = allPokemon?.find(p => 
              (p.originalName || p.name).toLowerCase() === comment.pokemon_name.toLowerCase()
            );
            const formattedPokemonName = pokemonDisplayName 
              ? formatPokemonName(pokemonDisplayName.name)
              : formatPokemonName(comment.pokemon_name);
            
            return (
              <div 
                key={comment.id} 
                style={{
                  ...styles.comment,
                  animation: `fadeInSlide 0.4s ease-out ${Math.min(index * 0.05, 0.3)}s both`,
                }}
              >
                <div style={styles.commentHeader}>
                  <div style={styles.commenterInfo}>
                    <span style={styles.commenterName}>{comment.commenter_name}</span>
                    <span 
                      style={{
                        ...styles.pokemonFlag,
                        backgroundColor: pokemonColor,
                      }}
                      title={`Voted for ${formattedPokemonName}`}
                    >
                      {formattedPokemonName}
                    </span>
                  </div>
                  <div style={styles.commentActions}>
                    <span style={styles.commentDate}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      title="Delete comment"
                    >
                      {deletingId === comment.id ? '...' : '×'}
                    </button>
                  </div>
                </div>
                <p style={styles.commentText}>{comment.comment_text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 12px',
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    border: '1px solid #404040',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    height: '100%',
    overflow: 'hidden',
    animation: 'fadeInSlide 0.4s ease-out',
  },
  title: {
    fontSize: '1rem',
    marginBottom: '8px',
    color: '#e0e0e0',
    fontWeight: '600',
    flexShrink: 0,
  },
  form: {
    marginBottom: '8px',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    marginBottom: '8px',
    border: '1px solid #505050',
    borderRadius: '6px',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    marginBottom: '8px',
    border: '1px solid #505050',
    borderRadius: '6px',
    fontSize: '0.9rem',
    minHeight: '50px',
    maxHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  commentsList: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
  },
  comment: {
    padding: '10px 12px',
    marginBottom: '8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    border: '1px solid #404040',
    animation: 'fadeInSlide 0.4s ease-out',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  commenterInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  commentActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  commenterName: {
    fontWeight: '600',
    color: '#e0e0e0',
    fontSize: '0.9rem',
  },
  pokemonFlag: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white',
    whiteSpace: 'nowrap',
  },
  commentDate: {
    fontSize: '0.8rem',
    color: '#b0b0b0',
  },
  deleteButton: {
    background: 'transparent',
    border: '1px solid #ff5252',
    color: '#ff8a80',
    borderRadius: '4px',
    width: '28px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    lineHeight: 1,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentText: {
    color: '#d0d0d0',
    lineHeight: '1.4',
    fontSize: '0.9rem',
    margin: 0,
  },
  noComments: {
    color: '#808080',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '12px',
    fontSize: '0.9rem',
  },
};

export default CommentSection;
