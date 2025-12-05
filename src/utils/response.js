const successResponse = (data = {}, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

const errorResponse = (message = 'Error', statusCode = 500) => {
  return {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

const paginatedResponse = (data = [], page = 1, limit = 10, total = 0) => {
  return {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};