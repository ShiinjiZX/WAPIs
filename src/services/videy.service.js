const { AppError } = require('../middleware/errorHandler');

class VideyService {
  getDownloadUrl(url) {
    try {
      const videoId = url.split("=")[1];
      
      if (!videoId) {
        throw new AppError('Invalid Videy URL format', 400);
      }

      const downloadUrl = `https://cdn.videy.co/${videoId}.mp4`;
      return downloadUrl;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to parse Videy URL', 400);
    }
  }
}

module.exports = new VideyService();