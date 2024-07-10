const express = require('express');
const Router = express.Router();
const { Project } = require('./model');
const { Article } = require('./model');
const {FormData} = require('./model');
const { Data } = require('./model');
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

// Routes for Projects
Router.post('/projects', upload.single('image'), async (req, res) => {
    try {
        const { description, clientName, industry, technology } = req.body;
        const imagePath = req.file.path; // Assuming Multer saves the file path to Cloudinary

        const NewProject = new Project({
            image: imagePath,
            description,
            clientName,
            industry,
            technology
        });

        await NewProject.save();
        res.json(NewProject);
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

Router.put('/projects/:id', async (req, res) => {
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

Router.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await Project.findByIdAndDelete(id);
        res.json({ message: 'Project deleted successfully', project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for Articles
Router.post('/articles', upload.single('image'), async (req, res) => {
    try {
        const { title, description, content } = req.body;
        const imagePath = req.file.path; // Assuming Multer saves the file path to Cloudinary

        const newArticle = new Article({
            image: imagePath,
            title,
            description,
            content
        });

        await newArticle.save();
        res.json(newArticle);
    } catch (err) {
        console.error('Error creating article:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

Router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.get('/articles/:articleId', async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const article = await Article.findById(articleId);
        
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.put('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const { image, title, description, content } = req.body;

    try {
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            { image, title, description, content },
            { new: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(updatedArticle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.delete('/articles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        await Article.findByIdAndDelete(id);
        res.json({ message: 'Article deleted successfully', article });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// GET route to fetch all form data



Router.get('/data', async (req, res) => {
    try {
      const data = await Data.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Route to add new data
  Router.post('/data', async (req, res) => {
    const { videoUrl, thumbnailUrl, name, section } = req.body;
  
    const newData = new Data({
      videoUrl,
      thumbnailUrl,
      name,
      section,
    });
  
    try {
      const savedData = await newData.save();
      res.status(201).json(savedData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = { Router };
