const express = require('express');
const ProjectRouter = express.Router();
const { Project } = require('./model');
const multer = require('multer');
const { v2: cloudinary, config: cloudinaryConfig } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinaryConfig({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file uploads to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', // Format can be adjusted as needed
        public_id: (req, file) => Date.now().toString() + '-' + file.originalname,
    },
});

const upload = multer({ storage: storage });

// Routes for Forms





// Routes for Projects
ProjectRouter.post('/projects', upload.single('image'), async (req, res) => {
    try {
        const { description, clientName, industry, technology } = req.body;
        const imagePath = req.file.path; // Assuming Multer saves the file path to Cloudinary

        const Project = new Project({
            image: imagePath,
            description,
            clientName,
            industry,
            technology
        });

        await Project.save();
        res.json(Project);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

ProjectRouter.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

ProjectRouter.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { image, description, clientName, industry, technology } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { image, description, clientName, industry, technology },
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

ProjectRouter.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Delete the image file if it exists (not necessary with Cloudinary)
        await Project.findByIdAndDelete(id);
        res.json({ message: 'Project deleted successfully', project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { ProjectRouter };
