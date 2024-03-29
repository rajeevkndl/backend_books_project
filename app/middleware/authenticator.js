const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
exports.verifyToken = (req, res, next) => {
// console.log(req)
  // Getting the token from the request headers
  const token = req?.headers['x-auth']
  console.log(token,'token')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verifying the token
  jwt.verify(token, '12345678', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else {
        return res.status(401).json({ error: 'Failed to authenticate token: '+err });
      }
    }
    req.user = decoded;
    next();
  });
};
