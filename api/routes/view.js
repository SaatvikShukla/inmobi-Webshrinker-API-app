const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const webShrinkerData = require("../models/webShrinkerModel") 
const preCacheModel = require("../models/preCacheModel") 
const shell = require('shelljs')
// var request = require('request');
// const fetch = require("node-fetch");
const https = require("https");

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
            
            body = webShrinkerRequest(targetURL)

            setTimeout(() => {
                res.status(200).json({"targetURL": targetURL, "response" : body})
            }, 3000);

        } else {
            let targetURL = (docs[0].targetURL)
            let body = "";

            https.get(targetURL, res => {
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    body = JSON.parse(body);
                    
                    setTimeout(() => {
                        console.log(body)
                    }, 3000);

                });
            });
            setTimeout(() => {
                res.status(200).json({"targetURL": targetURL, "response" : body})
            }, 3000);

        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


function webShrinkerRequest(targetURL) {
    request(targetURL, function(error, response, body) {
        console.log("in")
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode); 
        if(response && response.statusCode==200){
            var data= JSON.parse(JSON.stringify(body));
            // console.log(data);
            return data;
        }
    });
}

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