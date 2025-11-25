import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim() || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Quiz API
export const getQuestions = async () => {
  const response = await api.get('/quiz/questions');
  return response.data;
};

export const getQuestion = async (id) => {
  const response = await api.get(`/quiz/question/${id}`);
  return response.data;
};

export const submitAnswer = async (questionId, selectedPokemon) => {
  // Ensure pokemon name is trimmed before sending
  const normalizedPokemon = selectedPokemon ? selectedPokemon.trim() : selectedPokemon;
  const response = await api.post('/quiz/submit', {
    questionId,
    selectedPokemon: normalizedPokemon,
  });
  return response.data;
};

// Comments API
export const getComments = async (questionId) => {
  const response = await api.get(`/comments/${questionId}`);
  return response.data;
};

export const addComment = async (questionId, pokemonName, commenterName, commentText) => {
  const response = await api.post('/comments', {
    questionId,
    pokemonName,
    commenterName,
    commentText,
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export default api;

