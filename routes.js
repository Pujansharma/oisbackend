const express = require("express");
const Router = express.Router();
const { Form, Project } = require("./model"); // Assuming you have a Project model
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// Existing routes

Router.get('/forms', async (req, res) => {
    try {
        const forms = await Form.find();
        res.json(forms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.post('/forms', async (req, res) => {
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

Router.delete('/forms/:id', async (req, res) => {
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
Router.post('/login', (req, res) => {
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

// New routes for projects




// Read all projects
// Read all projects


// Ensure the upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
Router.use('/uploads', express.static(uploadDir));
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create a new project
Router.post('/projects', upload.single('image'), async (req, res) => {
    const { description, industry, technology } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProject = new Project({
        image: imageUrl,
        description,
        industry,
        technology
    });

    try {
        const savedProject = await newProject.save();
        res.json(savedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Create a new project
Router.post('/projects', async (req, res) => {
    const { image, description, industry, technology } = req.body;
    const newProject = new Project({
        image,
        description,
        industry,
        technology
    });

    try {
        const savedProject = await newProject.save();
        res.json(savedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing project by ID
Router.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { image, description, industry, technology } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { image, description, industry, technology },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a project by ID
Router.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully', deletedProject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { Router };
