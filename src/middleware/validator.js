const { AppError } = require('./errorHandler');

const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];
    
    fields.forEach(field => {
      const value = req.query[field] || req.body[field];
      if (!value || value.trim() === '') {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
    }

    next();
  };
};

const validateUrl = (field) => {
  return (req, res, next) => {
    const url = req.query[field] || req.body[field];
    
    if (!url) {
      return next(new AppError(`Missing '${field}' parameter`, 400));
    }

    try {
      new URL(url);
      next();
    } catch (e) {
      return next(new AppError(`Invalid URL format for '${field}'`, 400));
    }
  };
};

const validateYouTubeUrl = (req, res, next) => {
  const url = req.query.url || req.body.url;
  
  if (!url) {
    return next(new AppError('Missing YouTube URL', 400));
  }

  const youtubePattern = /^((?:https?:)?\/\/)?((?:www|m|gaming)\.)?((?:youtu\.be|youtube\.com)(?:\/(?:[\w\-]+\?v=|embed\/|shorts\/|live\/|v\/)?))([\w\-]{11})(\S+)?$/;
  
  if (!youtubePattern.test(url)) {
    return next(new AppError('Invalid YouTube URL format', 400));
  }

  next();
};

const validateImageToolType = (req, res, next) => {
  const validTypes = ['removebg', 'enhance', 'upscale', 'restore', 'colorize'];
  const type = req.query.type;

  if (!type) {
    return next(new AppError('Missing type parameter', 400));
  }

  if (!validTypes.includes(type)) {
    return next(new AppError(
      `Invalid type. Must be one of: ${validTypes.join(', ')}`,
      400
    ));
  }

  next();
};

module.exports = {
  validateRequired,
  validateUrl,
  validateYouTubeUrl,
  validateImageToolType
};