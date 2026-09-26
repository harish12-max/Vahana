const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON request body.',
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
};

module.exports = errorHandler;
