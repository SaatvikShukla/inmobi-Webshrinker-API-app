const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const webShrinkerData = require("../models/webShrinkerModel") 
const preCacheModel = require("../models/preCacheModel") 
const shell = require('shelljs')

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

router.get('/:id/:url', function (req, res) {
    const id = req.params.id;
    let url = req.params.url;
    url = (decodeURIComponent(url))

    preCacheModel.find( { "url" : { $eq : url } } )
    .exec()
    .then(docs => {
        if(!docs || docs.length<1){
            console.log("url doesnt exist in preCache db, generating the values")

            const { stdout, stderr, code } = shell.exec('bash auth.sh '+url);
            targetURL = ((stdout.toString()).trim());
            preCacheURLtoMongoDB(url, targetURL)
            res.status(200).json({"url": url, "targetURL": targetURL})

        } else {
            res.status(200).json(docs);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


function preCacheURLtoMongoDB(url, targetURL){
    const payload = new preCacheModel({
        url: url,
        targetURL: targetURL
      });
    
      payload
          .save()
          .then(result => {})
          .catch(err => {
              console.log(err);
              return 0;
          });
}


module.exports = router;