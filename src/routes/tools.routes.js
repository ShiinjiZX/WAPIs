const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/tools.controller');
const { 
  validateRequired, 
  validateYouTubeUrl,
  validateImageToolType 
} = require('../middleware/validator');

router.get('/imagetools',
  validateRequired(['imgurl', 'type']),
  validateImageToolType,
  toolsController.imageTools
);

router.get('/yt-transcript',
  validateYouTubeUrl,
  toolsController.youtubeTranscript
);

module.exports = router;