const express = require('express')
const { default: mongoose } = require('mongoose')
const userRoutes = require('./routes/UserRoutes')
const propertyRoutes = require('./routes/PropertyRoutes')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const admin = require('firebase-admin') 

require('dotenv').config()

const serviceAccount = require('./firebase/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})


const port = process.env.PORT || 4001
const server = express()
// const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

//middlewares
server.use(cookieParser())
server.use(cors({
  origin: "http://localhost:5173",  // cors configuration  for local host,

  // // cors config for deployment
  // origin: (origin, callback) => {
  //   if(!origin) return callback(null, true) // allow a request with no origin like postman
  //   if(allowedOrigins.includes(origin)){
  //     return callback(null,true)
  //   }else{
  //     return callback(new Error("Not allowed by CORS"))
  //   }
  // },

  credentials: true, //needed for cookies to work
}))
server.use(express.json())



//routes
server.use("/api", userRoutes)
server.use("/api", propertyRoutes);

// mongoose connection
mongoose.connect(process.env.MONGO_DB).then(() => {
  server.listen(port, () => {
    console.log(`server is live at http://localhost:${port}`);
  })
}).catch((err) => {
  console.log(err);
})

module.exports = {admin}