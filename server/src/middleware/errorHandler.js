function errorHandler(err, req, res, next) {
  console.error(err);
  return res.status(err.status || 500).json({ message: err.message || 'Server Error' });
}

module.exports = { errorHandler };
