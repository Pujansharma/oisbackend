const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now } // Add date field with default value
});

const Form = mongoose.model('Form', formSchema);

const ProjectSchema = new mongoose.Schema({
    image: String,
    description: String,
    industry: String,
    technology: String
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = { Form, Project };
