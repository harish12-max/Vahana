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

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: { message: 'Document file exceeds the 5 MB limit.' } });
  }

  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ success: false, error: { message: 'Invalid document upload.' } });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
};

module.exports = errorHandler;
