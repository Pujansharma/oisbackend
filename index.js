const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const{connection}=require("./config")
const {Router}=require("./routes")
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/data",Router)


// Routes





app.listen(port,async()=>{
    try {
        await connection
        console.log({"mssg":"conneted to database"})
    } catch (error) {
        console.log({error:"something went wrong"})
    }
    console.log(`server is running on port ${process.env.port}`)
})
