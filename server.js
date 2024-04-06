const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3030; // Changed port to 3030

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.post('/createFile', (req, res) => {
    const { filename, content, password } = req.body;
    if (!filename || !content) {
        return res.status(400).send('Both filename and content are required.');
    }
    fs.writeFile(filename, content, (err) => {
        if (err) {
            return res.status(500).send('Error saving file.');
        }
        res.status(200).send('File created successfully.');
    });
});

app.get('/getFiles', (req, res) => {
    fs.readdir('.', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files.');
        }
        res.status(200).json(files);
    });
});

app.get('/getFile', (req, res) => {
    const { filename } = req.query;
    if (!filename) {
        return res.status(400).send('Filename parameter is required.');
    }
    fs.readFile(filename, (err, data) => {
        if (err) {
            return res.status(400).send('File not found.');
        }
        res.status(200).send(data);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
