// requires express js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
require('./Models/db')
const AuthRouter = require('./Routes/AuthRouter')
const UploadRouter = require('./Routes/UploadRouter')

const cors = require('cors')


// requires dotenv
const PORT = process.env.PORT || 5100

// requires database connection


app.use(bodyParser.json())
const allowedOrigins = [
    'http://localhost:5173',  // Local development
    'https://drdo-project.vercel.app' // Deployed frontend
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // Allow cookies/auth headers
  }));
app.use('/auth', AuthRouter)
app.use('/api', UploadRouter)




app.get('/ping', (req, res) => {
    res.send('PONG')
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})

