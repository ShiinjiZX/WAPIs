const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { AppError } = require('../middleware/errorHandler');

class YouTubeService {
  async getTranscript(url) {
    try {
      const formData = new URLSearchParams();
      formData.append('youtube_url', url);

      const response = await fetch('https://youtubetotranscript.com/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        timeout: 30000
      });

      if (!response.ok) {
        throw new AppError(`Failed to fetch transcript: HTTP ${response.status}`, response.status);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const transcriptElement = doc.getElementById('transcript');
      
      if (!transcriptElement) {
        throw new AppError('Transcript not found - video may not have captions', 404);
      }

      const segments = transcriptElement.querySelectorAll('.transcript-segment');

      let transcriptText = '';
      let transcriptWithTimestamps = [];

      segments.forEach(segment => {
        const text = segment.textContent.trim();
        const start = segment.getAttribute('data-start');
        const duration = segment.getAttribute('data-duration');

        transcriptText += text + ' ';

        transcriptWithTimestamps.push({
          text: text,
          start: parseFloat(start),
          duration: parseFloat(duration)
        });
      });

      const titleElement = doc.querySelector('h1.card-title');
      const title = titleElement
        ? titleElement.textContent.replace('Transcript of ', '').trim()
        : '';

      const authorLink = doc.querySelector('a[data-ph-capture-attribute-element="author-link"]');
      const author = authorLink ? authorLink.textContent.trim() : '';

      return {
        title: title,
        author: author,
        transcript: transcriptText.trim(),
        segments: transcriptWithTimestamps,
        totalSegments: transcriptWithTimestamps.length,
        url: url
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.type === 'request-timeout') {
        throw new AppError('Request timeout while fetching transcript', 408);
      }
      throw new AppError(`YouTube transcript error: ${error.message}`, 500);
    }
  }
}

module.exports = new YouTubeService();