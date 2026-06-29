const errorHandler = (err, req, res, next) => {
  console.error('Express Error Handler:', err);

  let errorResponse = {
    success: false,
    message: err.message || 'Server Error'
  };

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    errorResponse.message = 'Resource not found';
  }

  // Handle Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    errorResponse.message = `Duplicate field value entered: "${field}". Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };
