const express = require('express');
const router = express.Router();
const mongoogse = require('mongoose');
const webShrinkerData = require("../models/webShrinkerModel") 

router.get('/', (req, res, next) => {
    console.log("working on get on /view")
    // res.send("/Upload get ")
    
    webShrinkerData.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

router.get('/:id', function (req, res) {
    const id = req.params.id;
    webShrinkerData.findById( id )
    .exec()
    .then(docs => {
        res.status(200).json({
          message: 'Success',
          domains: JSON.parse(docs.domains)
      });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
  });

module.exports = router;