'use strict'

const express = require('express');
const main = require('./routes/mainRouter');
const shorten = require('./routes/shortenRouter');

const PORT = process.env.PORT || 8080;
const app = express();

// Serve static files
app.use('/static', express.static('public'));

// Main route
app.use('/', main);

// Shorten route
app.use('/shorten', shorten);

// Listen on incoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`);
});