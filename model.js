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

module.exports = { Form };
