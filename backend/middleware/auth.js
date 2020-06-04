const jwt = require('jsonwebtoken'); // We need jwt to setup our token security system

module.exports = (req, res, next) => {
  try { // If the token we gave to the user matches with what the user has
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else { // Then the user can navigate the application
      next();
    }
  } catch { // Otherwise, the connection isn't authorized
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};