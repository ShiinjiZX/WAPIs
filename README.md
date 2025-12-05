# REST API by Ikyy 🚀

A well-structured REST API with AI, Downloader, and Tools endpoints.

## 📁 Project Structure

```
project-root/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middlewares
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── public/              # Static files (HTML, CSS, JS)
├── data/                # JSON data files
├── index.js             # Entry point
└── package.json
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## 📚 API Endpoints

### AI Endpoints
- `GET /api/ai/gemini` - Chat with Gemini AI

### Downloader Endpoints
- `GET /api/downloader/videy` - Download Videy videos
- `GET /api/downloader/pixeldrain` - Download Pixeldrain files

### Tools Endpoints
- `GET /api/tools/imagetools` - Process images (removebg, enhance, etc.)
- `GET /api/tools/yt-transcript` - Get YouTube transcripts

## 🔧 Features

✅ Clean MVC Architecture
✅ Error Handling Middleware
✅ Request Validation
✅ Rate Limiting
✅ CORS Support
✅ Request Logging
✅ Security Headers (Helmet)
✅ Compression
✅ Health Check Endpoint

## 🛡️ Security

- Rate limiting on all endpoints
- Input validation
- Security headers via Helmet
- CORS configuration
- Error message sanitization

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### Vercel
Already configured with `vercel.json`

```bash
vercel --prod
```

## 📄 License

MIT

## 👨‍💻 Author

IkyyKzy