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

module.exports = { Form, Project };
