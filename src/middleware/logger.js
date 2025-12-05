const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    };

    // Color coding for console
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' :
                       res.statusCode >= 400 ? '\x1b[33m' :
                       res.statusCode >= 300 ? '\x1b[36m' :
                       '\x1b[32m';
    
    console.log(
      `${statusColor}${log.method}\x1b[0m ${log.url} - ${statusColor}${log.status}\x1b[0m [${log.duration}]`
    );
  });

  next();
};

module.exports = { requestLogger };