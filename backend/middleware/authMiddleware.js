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

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };