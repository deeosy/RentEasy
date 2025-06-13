const express = require('express')
const { default: mongoose } = require('mongoose')
const userRoutes = require('./routes/UserRoutes')
require('dotenv').config()


const port = process.env.PORT || 4001
const server = express()

//middlewares
server.use(express.json())



//routes
server.use(userRoutes)

// mongoose connection
mongoose.connect(process.env.MONGO_DB).then((result) => {
  server.listen(port, () => {
    console.log(`server is live at http://localhost:${port}`);
  })
}).catch((err) => {
  console.log(err);
})