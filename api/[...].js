// Catch-all route for Vercel serverless functions
// This file handles all routes (both /api/* and /*)
const app = require('./index.js');

// Export as Vercel serverless function handler
module.exports = app;
module.exports.default = app;

