# 🚀 REST API Documentation

## Base URL
```
https://your-domain.com
```

## 📡 Endpoints Overview

### Health Check
Check API status and uptime.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345.67
}
```

---

## 🤖 AI Endpoints

### Gemini AI Chat

Chat with Google's Gemini AI model.

**Endpoint:** `GET /api/ai/gemini`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | ✅ | Input text for AI |
| apikey | string | ✅ | Your Gemini API key |

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/ai/gemini?text=Hello&apikey=YOUR_API_KEY"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "text": "Hello! How can I assist you today?"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields: text, apikey"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired API key"
}
```

---

## 📥 Downloader Endpoints

### Videy Downloader

Download videos from Videy platform.

**Endpoint:** `GET /api/downloader/videy`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | ✅ | Videy video URL |

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/downloader/videy?url=https://videy.co/?v=abc123"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "fileurl": "https://cdn.videy.co/abc123.mp4"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Pixeldrain Downloader

Download files from Pixeldrain.

**Endpoint:** `GET /api/downloader/pixeldrain`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | ✅ | Pixeldrain file URL |

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/downloader/pixeldrain?url=https://pixeldrain.com/u/abc123"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "filename": "document.pdf",
    "fileurl": "https://pixeldrain.com/api/file/abc123"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Pixeldrain file not found or invalid title"
}
```

---

## 🔧 Tools Endpoints

### Image Tools

Process images with various tools.

**Endpoint:** `GET /api/tools/imagetools`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| imgurl | string | ✅ | Image URL to process |
| type | string | ✅ | Tool type (see below) |

**Available Types:**
- `removebg` - Remove background
- `enhance` - Enhance image quality
- `upscale` - Upscale resolution
- `restore` - Restore old photos
- `colorize` - Colorize black & white

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/tools/imagetools?imgurl=https://example.com/image.jpg&type=removebg" --output result.png
```

**Success Response (200):**
- Returns processed image as PNG binary data
- Content-Type: `image/png`

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid type. Must be one of: removebg, enhance, upscale, restore, colorize"
}
```

---

### YouTube Transcript

Get transcript from YouTube videos.

**Endpoint:** `GET /api/tools/yt-transcript`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | ✅ | YouTube video URL |

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/tools/yt-transcript?url=https://youtube.com/watch?v=abc123"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "title": "Video Title",
    "author": "Channel Name",
    "transcript": "Full transcript text...",
    "segments": [
      {
        "text": "Segment text",
        "start": 0.5,
        "duration": 2.3
      }
    ],
    "totalSegments": 150,
    "url": "https://youtube.com/watch?v=abc123"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid YouTube URL format"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Transcript not found - video may not have captions"
}
```

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 404 | Not Found - Resource not found |
| 408 | Request Timeout - Operation took too long |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 🔒 Rate Limiting

### General Endpoints
- **Window:** 15 minutes
- **Max Requests:** 100 per IP

### AI Endpoints
- **Window:** 15 minutes
- **Max Requests:** 20 per IP

### Downloader Endpoints
- **Window:** 15 minutes
- **Max Requests:** 50 per IP

**Rate Limit Response (429):**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

**Headers:**
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time until reset (Unix timestamp)

---

## 📝 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "timestamp": "ISO 8601 timestamp"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "ISO 8601 timestamp"
}
```

---

## 🛠️ Usage Examples

### JavaScript (Fetch)
```javascript
async function callAPI() {
  const response = await fetch('https://your-domain.com/api/ai/gemini?text=Hello&apikey=YOUR_KEY');
  const data = await response.json();
  console.log(data);
}
```

### Python (Requests)
```python
import requests

response = requests.get('https://your-domain.com/api/ai/gemini', params={
    'text': 'Hello',
    'apikey': 'YOUR_KEY'
})
print(response.json())
```

### cURL
```bash
curl -X GET "https://your-domain.com/api/ai/gemini?text=Hello&apikey=YOUR_KEY"
```

---

## 🔐 Security

1. **API Keys:** Keep your API keys secure and never expose them in client-side code
2. **HTTPS:** Always use HTTPS in production
3. **Rate Limiting:** Respect rate limits to avoid being blocked
4. **Input Validation:** All inputs are validated server-side

---

## 📞 Support

For issues or questions:
- GitHub: [Repository Link](https://github.com/ShiinjiZX)
- Documentation: `/apis.json`

---

## 📄 License

MIT License - © 2025 KYYRYUU XPZX