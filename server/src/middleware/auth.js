const { verifyToken } = require('../utils/jwt');

function authRequired(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = verifyToken(token);
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authRequired, allowRoles };
