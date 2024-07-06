const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connection } = require("./config");
const { Router } = require("./routes");
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://oissoftware.com/ois/' // replace with your frontend domain
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/data", Router);

app.listen(port, async () => {
    try {
        await connection;
        console.log({ "msg": "connected to database" });
    } catch (error) {
        console.log({ error: "something went wrong" });
    }
    console.log(`server is running on port ${port}`);
});
