const express=require("express")
const Router=express.Router()
const {Form}=require("./model")
const jwt=require("jsonwebtoken")
require('dotenv').config();
// const verifyToken=require("./middleware")
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


// const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization'];

//     if (!token) {
//         return res.status(403).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to authenticate token' });
//         }

//         // Save decoded token to request for use in other routes
//         req.user = decoded;
//         next();
//     });
// };


const SECRET_KEY = process.env.SECRET_KEY ;

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

module.exports={Router}