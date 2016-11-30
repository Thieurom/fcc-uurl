'use strict'

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const validUrl = require('valid-url');
const hash = require('string-hash');

const PORT = process.env.PORT || 8080;
const DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data-dev';

const app = express();

// Serve static files
app.use('/static', express.static('public'));

// Home page route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// Shorten route
app.get('/shorten/:url(*)', (req, res) => {
    let url = req.params.url;

    if (validUrl.isWebUri(url)) {
        // Query database
        MongoClient.connect(DATABASE, (err, db) => {
            if (err) throw err;
            let collection = db.collection('shortUrls');

            collection.findOneAndUpdate({url: url}
                , {
                    $setOnInsert:
                    {
                        url: url,
                        shortUrl: req.protocol + '://' + req.hostname + '/' + hash(url)
                    }
                }
                , {
                    returnOriginal: false,
                    upsert: true
                }
                , (err, doc) => {
                    if (err) throw err;
                    console.log(doc);

                    res.json({
                        original_url: doc.value.url,
                        short_url: doc.value.shortUrl
                    });

                    db.close();
            });
        });

    } else {
        res.json({ error: 'Wrong url format, make sure you have a valid protocol and real site.' });
    }
});

// Short url route
app.get('/:shortUrl', (req, res) => {
    let shortUrl = req.protocol + '://' + req.hostname + '/' + req.params.shortUrl;
    let url = '';

    MongoClient.connect(DATABASE, (err, db) => {
        if (err) throw err;
        let collection = db.collection('shortUrls');

        collection.findOne({shortUrl: shortUrl}
        , (err, doc) => {
            if (err) throw err;

            if (doc) {
                url = doc.url;
                res.redirect(url);
            } else {
                res.json({error: 'Can\'t find this url in database.'});
            }

            db.close();
        });
    });
});

// Listen on incoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`);
});