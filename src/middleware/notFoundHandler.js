const path = require('path');

const notFoundHandler = (req, res, next) => {
  // Check if request is for API
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      path: req.path,
      method: req.method,
      availableEndpoints: {
        ai: ['/api/ai/gemini'],
        downloader: ['/api/downloader/videy', '/api/downloader/pixeldrain'],
        tools: ['/api/tools/imagetools', '/api/tools/yt-transcript']
      },
      documentation: '/apis.json'
    });
  }
  
  // For web requests, serve 404 page
  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));
};

module.exports = { notFoundHandler };