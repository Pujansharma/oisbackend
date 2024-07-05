const mongoose=require("mongoose")
require('dotenv').config();
const MongoUrl = process.env.Mongo_url
const connection=mongoose.connect(MongoUrl)

module.exports={
    connection
}