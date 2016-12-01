'use strict'

const express = require('express');
const service = require('../service/service')

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../public' });
});

router.get('/:hashNumber', (req, res) => {
  let hashNumber = parseInt(req.params.hashNumber);

  service.getFromHash(hashNumber, (err, doc) => {
    if (err) {
      res.json(err);
    } else if (doc) {
      res.redirect(doc.url);
    }
  });
});

module.exports = router;