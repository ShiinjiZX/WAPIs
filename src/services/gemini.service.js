const { GoogleGenAI } = require('@google/genai');
const { AppError } = require('../middleware/errorHandler');

class GeminiService {
  async chat(text, apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: text
      });

      const replyText = response?.text ?? 
                       response?.output?.[0]?.content ?? 
                       JSON.stringify(response);

      return replyText;
    } catch (error) {
      if (error.message.includes('API key')) {
        throw new AppError('Invalid or expired API key', 401);
      }
      throw new AppError(`Gemini API error: ${error.message}`, 500);
    }
  }
}

module.exports = new GeminiService();