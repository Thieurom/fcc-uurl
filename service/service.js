'use strict'

const MongoClient = require('mongodb').MongoClient;
const validUrl = require('valid-url');
const hash = require('string-hash');

const DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data-dev';

exports.getFromUrl = function (url, callback) {
  if (validUrl.isWebUri(url)) {
    MongoClient.connect(DATABASE, (err, db) => {
      if (err) {
        console.log('Unable to connect to mongoDB server. Error: ', err);
        callback({ error: 'Unable to connect to mongoDB server.' });
      } else {
        console.log('Established connection to mongoDB server.')

        let collection = db.collection('shortenUrls');

        // Find the document that matches given url,
        // if not existed, insert new one to database
        // either case, return existed or new document
        collection.findOneAndUpdate({ url: url }
          , {
            $setOnInsert:
            {
              url: url,
              hashedUrl: hash(url)
            }
          }
          , {
            returnOriginal: false,
            upsert: true
          }
          , (err, res) => {
            if (err) {
              console.log('Error when querying database: ', err);
              callback({ error: 'Error when querying database.' });
            } else {
              console.log('Query result: ', res);
              callback(null, res.value);
            }

            db.close();
          });
      }
    });

  } else {
    callback({ error: 'Wrong url format, make sure you have a valid protocol and real site.' });
  }
};

exports.getFromHash = function (hashNumber, callback) {
  MongoClient.connect(DATABASE, (err, db) => {
    if (err) {
      console.log('Unable to connect to mongoDB server. Error: ', err);
      callback({ error: 'Unable to connect to mongoDB server.' });
    } else {
      console.log('Established connection to mongoDB server.')

      let collection = db.collection('shortenUrls');

      // Find the document that matches given hash number
      // return document if found
      collection.findOne({ hashedUrl: hashNumber }
        , (err, doc) => {
          if (err) {
            console.log('Error when querying database: ', err);
            callback({ error: 'Error when querying database.' });
          } else if (doc) {
            console.log('Query result: ', doc);
            callback(null, doc);
          } else {
            callback({ error: 'Can\'t find this url in database.' });
          }

          db.close();
        });
    }
  });
}