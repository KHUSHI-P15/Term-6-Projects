const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dms'

async function init(){
  await mongoose.connect(uri)
}

module.exports = { init, mongoose }
