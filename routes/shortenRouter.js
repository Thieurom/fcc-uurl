'use strict'

const express = require('express');
const service = require('../service/service');

const router = express.Router();

router.get('/:url(*)', (req, res) => {
  let url = req.params.url;

  service.getFromUrl(url, (err, doc) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        original_url: doc.url,
        short_url: req.protocol + '://' + req.hostname + '/' + doc.hashedUrl
      });
    }
  });
});

module.exports = router;