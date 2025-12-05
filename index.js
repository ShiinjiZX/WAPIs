const app = require('./src/app');
const config = require('./src/config/app.config');

const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
  });
}

module.exports = app;