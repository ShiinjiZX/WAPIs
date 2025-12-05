const express = require('express');
const router = express.Router();
const downloaderController = require('../controllers/downloader.controller');
const { validateUrl } = require('../middleware/validator');
const { downloaderRateLimiter } = require('../middleware/rateLimiter');

// Apply downloader-specific rate limiting
router.use(downloaderRateLimiter);

router.get('/videy',
  validateUrl('url'),
  downloaderController.videyDownload
);

router.get('/pixeldrain',
  validateUrl('url'),
  downloaderController.pixeldrainDownload
);

module.exports = router;