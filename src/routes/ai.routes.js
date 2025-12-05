const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { validateRequired } = require('../middleware/validator');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Apply AI-specific rate limiting
router.use(aiRateLimiter);

router.get('/gemini', 
  validateRequired(['text', 'apikey']),
  aiController.geminiChat
);

module.exports = router;