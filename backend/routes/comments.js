const express = require('express');
const router = express.Router();
const { getComments, getAllCommentsForQuestion, addComment, deleteComment } = require('../models/db');

// Get all comments for a question (shared pool)
router.get('/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const comments = await getAllCommentsForQuestion(parseInt(questionId));
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get comments for a specific Pokemon in a question (kept for backward compatibility)
router.get('/:questionId/:pokemonName', async (req, res) => {
  try {
    const { questionId, pokemonName } = req.params;
    // Decode the pokemon name (it's URL encoded from frontend)
    const decodedName = decodeURIComponent(pokemonName);
    const comments = await getComments(parseInt(questionId), decodedName);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/', async (req, res) => {
  try {
    const { questionId, pokemonName, commenterName, commentText } = req.body;

    if (!questionId || !pokemonName || !commenterName || !commentText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Trim and normalize the pokemon name to ensure consistency
    const normalizedPokemonName = pokemonName.trim();
    const normalizedCommenterName = commenterName.trim();
    const normalizedCommentText = commentText.trim();

    const comment = await addComment(
      parseInt(questionId),
      normalizedPokemonName,
      normalizedCommenterName,
      normalizedCommentText
    );

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await deleteComment(parseInt(commentId));

    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ success: true, comment: deleted });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;

