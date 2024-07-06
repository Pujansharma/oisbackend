const express = require("express");
const Router = express.Router();
const { Form, Project } = require("./model"); // Assuming you have a Project model
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
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




// Ensure the upload directory exists
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
// Multer configuration for file uploads
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      format: async (req, file) => 'png', // Supports promises as well
      public_id: (req, file) => Date.now().toString() + '-' + file.originalname,
    },
  });
const upload = multer({ storage: storage });

// Create a new project
Router.post('/data/projects', upload.single('image'), async (req, res) => {
    const { description, clientName, industry, technology } = req.body;
    const imagePath = req.file.path; // Cloudinary URL
  
    const newProject = new Project({
      image: imagePath,
      description,
      clientName,
      industry,
      technology,
    });
  
    try {
      await newProject.save();
      res.json(newProject);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Delete the image file if it exists
        if (project.image) {
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, '..', project.image);

            console.log('Attempting to delete image at path:', imagePath);

            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image:', err);
                    } else {
                        console.log('Image deleted successfully');
                    }
                });
            } else {
                console.log('Image file does not exist:', imagePath);
            }
        }

        await Project.findByIdAndDelete(id);
        res.json({ message: 'Project deleted successfully', project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = { Router };
