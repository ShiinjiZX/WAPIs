const videyService = require('../../src/services/videy.service');
const pixeldrainService = require('../../src/services/pixeldrain.service');

describe('Videy Service', () => {
  describe('getDownloadUrl', () => {
    test('should extract video ID and return download URL', () => {
      const testUrl = 'https://videy.co/?v=abc123def';
      const result = videyService.getDownloadUrl(testUrl);
      
      expect(result).toBe('https://cdn.videy.co/abc123def.mp4');
    });
    
    test('should throw error for invalid URL format', () => {
      const invalidUrl = 'https://videy.co/invalid';
      
      expect(() => {
        videyService.getDownloadUrl(invalidUrl);
      }).toThrow('Invalid Videy URL format');
    });
    
    test('should throw error for URL without video ID', () => {
      const invalidUrl = 'https://videy.co/?v=';
      
      expect(() => {
        videyService.getDownloadUrl(invalidUrl);
      }).toThrow('Invalid Videy URL format');
    });
  });
});

describe('Pixeldrain Service', () => {
  describe('getFileInfo', () => {
    test('should handle network errors gracefully', async () => {
      const invalidUrl = 'https://invalid-pixeldrain-url.com';
      
      await expect(
        pixeldrainService.getFileInfo(invalidUrl)
      ).rejects.toThrow();
    });
  });
});

// Mock tests for external dependencies
jest.mock('node-fetch');
const fetch = require('node-fetch');

describe('Pixeldrain Service with Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should parse pixeldrain response correctly', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>test.pdf ~ pixeldrain</title></head>
        <body></body>
      </html>
    `;
    
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });
    
    const result = await pixeldrainService.getFileInfo('https://pixeldrain.com/u/test123');
    
    expect(result).toEqual({
      filename: 'test.pdf',
      fileurl: 'https://pixeldrain.com/api/file/test123'
    });
  });
  
  test('should throw error when title format is invalid', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Invalid Title</title></head>
        <body></body>
      </html>
    `;
    
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });
    
    await expect(
      pixeldrainService.getFileInfo('https://pixeldrain.com/u/test123')
    ).rejects.toThrow('Pixeldrain file not found or invalid title');
  });
});