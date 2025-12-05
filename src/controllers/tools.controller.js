const { asyncHandler } = require('../middleware/errorHandler');
const imagetoolsService = require('../services/imagetools.service');
const youtubeService = require('../services/youtube.service');
const { successResponse } = require('../utils/response');

const imageTools = asyncHandler(async (req, res) => {
  const { imgurl, type } = req.query;

  const imageBuffer = await imagetoolsService.processImage(imgurl, type);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageBuffer.length
  });
  res.end(imageBuffer);
});

const youtubeTranscript = asyncHandler(async (req, res) => {
  const { url } = req.query;

  const transcript = await youtubeService.getTranscript(url);

  res.json(successResponse(transcript));
});

module.exports = {
  imageTools,
  youtubeTranscript
};