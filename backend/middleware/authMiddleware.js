// const jwt = require('jsonwebtoken')
// require('dotenv').config()

// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.token
//     if(!token) return res.status(401).json({message: "No token found"})

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
//     req.user = decoded
//     next()
//   } catch (err) {
//     if(err.username === TokenExpiredError ){
//         return res.status(401).json({message: "Token expired, Please sign in again"})
//     }
//     return res.status(401).json({message: "Invalid token"})
//   }
// }

// module.exports = authMiddleware


const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate requests using JWT token from cookies
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.error('Auth middleware: No token found in cookies');
    return res.status(401).json({ message: 'No token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Auth middleware: Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please sign in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;