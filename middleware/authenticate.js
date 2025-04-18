const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Get token after "Bearer "
    const decoded = jwt.verify(token, 'your_secret_key'); // Use your actual secret
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

