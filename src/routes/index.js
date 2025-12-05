const express = require('express');
const router = express.Router();

const aiRoutes = require('./ai.routes');
const downloaderRoutes = require('./downloader.routes');
const toolsRoutes = require('./tools.routes');

// Mount routes
router.use('/ai', aiRoutes);
router.use('/downloader', downloaderRoutes);
router.use('/tools', toolsRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'REST API by IkyyKzy',
    version: '1.0.0',
    endpoints: {
      ai: '/api/ai',
      downloader: '/api/downloader',
      tools: '/api/tools'
    },
    documentation: '/apis.json'
  });
});

module.exports = router;