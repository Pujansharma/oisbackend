const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connection } = require('./config');
const { Router } = require('./routes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/data', Router);

app.listen(port, async () => {
    try {
        await connection;
        console.log({ message: 'Connected to database' });
    } catch (error) {
        console.log({ error: 'Something went wrong' });
    }
    console.log(`Server is running on port ${port}`);
});
