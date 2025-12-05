const fetch = require('node-fetch');
const axios = require('axios');
const FormData = require('form-data');
const { JSDOM } = require('jsdom');
const { AppError } = require('../middleware/errorHandler');

class ImageToolsService {
  async processImage(imgUrl, type) {
    try {
      // Fetch image
      const imageResponse = await fetch(imgUrl);
      
      if (!imageResponse.ok) {
        throw new AppError('Failed to fetch image from URL', 400);
      }

      const imageBuffer = await imageResponse.buffer();

      // Prepare form data
      const form = new FormData();
      form.append("file", imageBuffer, "image.png");
      form.append("type", type);

      // Send to image processing service
      const { data } = await axios.post(
        "https://imagetools.rapikzyeah.biz.id/upload",
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000
        }
      );

      // Parse response HTML
      const dom = new JSDOM(data);
      const resultImg = dom.window.document.querySelector("#result");

      if (!resultImg) {
        throw new AppError('Failed to process image - result not found', 500);
      }

      const resultUrl = resultImg.getAttribute("src");
      
      if (!resultUrl) {
        throw new AppError('Processed image URL not found', 500);
      }

      // Fetch processed image
      const processedResponse = await fetch(resultUrl);
      
      if (!processedResponse.ok) {
        throw new AppError('Failed to fetch processed image', 500);
      }

      const processedBuffer = await processedResponse.buffer();
      
      return processedBuffer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new AppError('Image processing timeout', 408);
      }
      throw new AppError(`Image processing error: ${error.message}`, 500);
    }
  }
}

module.exports = new ImageToolsService();