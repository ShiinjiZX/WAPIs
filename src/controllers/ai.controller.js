const { asyncHandler } = require('../middleware/errorHandler');
const geminiService = require('../services/gemini.service');
const { successResponse } = require('../utils/response');

const geminiChat = asyncHandler(async (req, res) => {
  const { text, apikey } = req.query;

  const response = await geminiService.chat(text, apikey);

  res.json(successResponse({ text: response }));
});

module.exports = {
  geminiChat
};