'use strict'

const express = require('express');
const mongo = require('mongodb');

const PORT = process.env.PORT || 8080;
const app = express();

// Serve static files
app.use('/static', express.static('public'));

// Home page route
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: './public'});
});

// Listen on incoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`);
});