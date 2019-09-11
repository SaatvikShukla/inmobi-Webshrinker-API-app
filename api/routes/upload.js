const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const multer  = require('multer');
const upload = multer();
const shell = require('shelljs')

const webShrinkerData = require("../models/webShrinkerModel") 

router.post('/',upload.single('uploadCsv'), function(req, res, next) {
    let originalname = req.file.originalname;
    console.log("Processing "+originalname)

    let csv=req.file.buffer.toString('utf8');
    csv = csv.split('\n')
    csv = csv.filter(Boolean)
    console.log(csv)
    let totalData = {
        "domains" : []
    }
    for(i= 0; i< csv.length; i++){
        let URL = csv[i].toString();
        if(URL.length>0){
            const { stdout, stderr, code } = shell.exec('bash auth.sh '+URL, { silent: true });
            targetURL = ((stdout.toString()).trim());

            child = {
              "url" : URL,
              "targetURL" : targetURL
            };
            totalData.domains.push(child)
        }
    }
    preCache(totalData)

    if(!updateDb(originalname, totalData)){
        console.log("Added to db successfully")
        res.json({"Success": "True"})
    } else {
        console.log("An error has occoured")
        res.json({"Success": "False"})
    }
    
});

function updateDb(originalname, totalData){
    const payload = new webShrinkerData({
      _id: new mongoose.Types.ObjectId(),
      filename: originalname,
      domains: JSON.stringify(totalData.domains)
    });
  
    payload
        .save()
        .then(result => {
            console.log("Successfully stored to db")
            return 1;
        })
        .catch(err => {
            console.log(err);
            return 0;
        });
  
}

function preCache(totalData){
    console.log("precaching")
}

module.exports = router;