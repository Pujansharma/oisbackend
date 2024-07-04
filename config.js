const mongoose=require("mongoose")
const connection=mongoose.connect("mongodb+srv://pujansharma:pujansharma@cluster0.epdy6qd.mongodb.net/oisbackend")

module.exports={
    connection
}