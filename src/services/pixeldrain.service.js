const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { AppError } = require('../middleware/errorHandler');

class PixeldrainService {
  async getFileInfo(url) {
    try {
      const apiUrl = url.replace("/u/", "/api/file/");
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new AppError('Failed to fetch Pixeldrain page', response.status);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const titleElement = doc.querySelector('title');
      let titleText = titleElement ? titleElement.textContent : '';

      const searchTerm = ' ~ pixeldrain';
      
      if (titleText.includes(searchTerm)) {
        titleText = titleText.split(searchTerm)[0];
        
        return {
          filename: titleText,
          fileurl: apiUrl
        };
      } else {
        throw new AppError('Pixeldrain file not found or invalid title', 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Pixeldrain service error: ${error.message}`, 500);
    }
  }
}

module.exports = new PixeldrainService();