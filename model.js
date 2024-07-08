const mongoose = require('mongoose');

// Schema for Form submissions
const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Form = mongoose.model('Form', formSchema);

// Schema for Project details
const projectSchema = new mongoose.Schema({
    image: { type: String, required: true },
    description: { type: String, required: true },
    clientName: { type: String, required: true },
    industry: { type: String, required: true },
    technology: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);

const articleSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Article = mongoose.model('articel', articleSchema);

const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    message: { type: String, required: true },
    fileUrl: { type: String }
});
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = { Form, Project , Article, FormData};
