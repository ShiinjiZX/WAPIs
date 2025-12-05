const { asyncHandler } = require('../middleware/errorHandler');
const videyService = require('../services/videy.service');
const pixeldrainService = require('../services/pixeldrain.service');
const { successResponse } = require('../utils/response');

const videyDownload = asyncHandler(async (req, res) => {
  const { url } = req.query;

  const fileUrl = await videyService.getDownloadUrl(url);

  res.json(successResponse({ fileurl: fileUrl }));
});

const pixeldrainDownload = asyncHandler(async (req, res) => {
  const { url } = req.query;

  const result = await pixeldrainService.getFileInfo(url);

  res.json(successResponse(result));
});

module.exports = {
  videyDownload,
  pixeldrainDownload
};