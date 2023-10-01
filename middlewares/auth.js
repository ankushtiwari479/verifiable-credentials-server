const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config'); // Replace with your JWT secret key and configuration
function verifyToken(req, res, next) {
  const token = req.headers['authorization'] || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = verifyToken;
