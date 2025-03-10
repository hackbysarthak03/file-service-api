const mongoose = require('mongoose')

const conn = process.env.MONGO_CONN

mongoose.connect(conn).then(() =>{
    console.log('Database Connected')
}).catch((err) => {
    console.log("Facing Issues ", err)
})