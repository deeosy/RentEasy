// const punycode = require('punycode/'); 
// const express = require('express')
// const mongoose = require('mongoose')
// const userRoutes = require('./routes/UserRoutes')
// const propertyRoutes = require('./routes/PropertyRoutes')
// const cookieParser = require('cookie-parser')
// const cors = require('cors')

// require('dotenv').config()

// const port = process.env.PORT || 4001
// const server = express()
// const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

//middlewares
//               // cors configuration  for local host,

  // // cors config for deployment
  // origin: (origin, callback) => {
  //   if(!origin) return callback(null, true) // allow a request with no origin like postman
  //   if(allowedOrigins.includes(origin)){
  //     return callback(null,true)
  //   }else{
  //     return callback(new Error("Not allowed by CORS"))
  //   }
  // },

//   credentials: true, //needed for cookies to work
// }))




//routes
// server.use("/api", userRoutes)
// server.use("/api", propertyRoutes);

// mongoose connection
// mongoose.connect(process.env.MONGO_DB).then(() => {
//   server.listen(port, () => {
//     console.log(`server is live at http://localhost:${port}`);
//   })
// }).catch((err) => {
//   console.log(err);
// })

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const propertyRoutes = require('./routes/PropertyRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4001;
const server = express();

// CORS allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://renteasy-gh.netlify.app'];

server.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Routes
server.use('/api/users', userRoutes);
server.use('/api/properties', propertyRoutes);

// Global error handler
server.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// DB connection + start server
mongoose.connect(process.env.MONGO_DB)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is live at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
