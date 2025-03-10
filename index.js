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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use('/auth', AuthRouter)
app.use('/api', UploadRouter)




app.get('/ping', (req, res) => {
    res.send('PONG')
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})

