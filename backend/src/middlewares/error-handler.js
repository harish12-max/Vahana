const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
};

module.exports = errorHandler;
