const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests', () => {
  
  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
  
  describe('Root Endpoint', () => {
    test('GET / should return HTML', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });
  
  describe('API Info', () => {
    test('GET /api should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });
  
  describe('APIs JSON', () => {
    test('GET /apis.json should return API documentation', async () => {
      const response = await request(app)
        .get('/apis.json')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
    });
  });
  
  describe('404 Handler', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
  
  describe('AI Endpoints', () => {
    test('GET /api/ai/gemini without params should return 400', async () => {
      const response = await request(app)
        .get('/api/ai/gemini')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Missing required fields');
    });
    
    test('GET /api/ai/gemini with only text should return 400', async () => {
      const response = await request(app)
        .get('/api/ai/gemini?text=hello')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  describe('Downloader Endpoints', () => {
    test('GET /api/downloader/videy without URL should return 400', async () => {
      const response = await request(app)
        .get('/api/downloader/videy')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('url');
    });
    
    test('GET /api/downloader/videy with invalid URL should return 400', async () => {
      const response = await request(app)
        .get('/api/downloader/videy?url=not-a-url')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
    
    test('GET /api/downloader/pixeldrain without URL should return 400', async () => {
      const response = await request(app)
        .get('/api/downloader/pixeldrain')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  describe('Tools Endpoints', () => {
    test('GET /api/tools/imagetools without params should return 400', async () => {
      const response = await request(app)
        .get('/api/tools/imagetools')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
    
    test('GET /api/tools/imagetools with invalid type should return 400', async () => {
      const response = await request(app)
        .get('/api/tools/imagetools?imgurl=http://example.com/image.jpg&type=invalid')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Invalid type');
    });
    
    test('GET /api/tools/yt-transcript without URL should return 400', async () => {
      const response = await request(app)
        .get('/api/tools/yt-transcript')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
    
    test('GET /api/tools/yt-transcript with invalid YouTube URL should return 400', async () => {
      const response = await request(app)
        .get('/api/tools/yt-transcript?url=http://example.com')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Invalid YouTube URL');
    });
  });
  
  describe('Rate Limiting', () => {
    test('should not rate limit health check', async () => {
      // Make multiple requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/health')
          .expect(200);
      }
    });
  });
});