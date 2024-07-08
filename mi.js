const express = require("express");
const ProjectRouter = express.Router();
const { Form } = require("./model"); // Assuming you have a Project model
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Existing routes

ProjectRouter.get('/forms', async (req, res) => {
    try {
        const forms = await Form.find();
        res.json(forms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

ProjectRouter.post('/forms', async (req, res) => {
    const { name, email, phone, company, message } = req.body;

    const currentDate = new Date();
    const date = currentDate.toISOString(); // Convert date to ISO string format

    const newForm = new Form({
        name,
        email,
        phone,
        company,
        message,
        date
    });

    try {
        const savedForm = await newForm.save();
        res.json(savedForm);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

ProjectRouter.delete('/forms/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedForm = await Form.findByIdAndDelete(id);
        if (!deletedForm) {
            return res.status(404).json({ error: 'Form not found' });
        }
        res.json({ message: 'Form deleted successfully', deletedForm });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const SECRET_KEY = process.env.SECRET_KEY;

// Dummy credentials
const USERNAME = 'oissoftware@gmail.com';
const PASSWORD = 'Ois@123456';

// Login route
ProjectRouter.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password match the hardcoded credentials
    if (username === USERNAME && password === PASSWORD) {
        // Create JWT token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        // Send token as response
        res.json({ token });
    } else {
        // Invalid credentials
        res.status(401).json({ message: 'Invalid username or password' });
    }
});
module.exports = { ProjectRouter };