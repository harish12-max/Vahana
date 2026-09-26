const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `API route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

module.exports = notFound;
