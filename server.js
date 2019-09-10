const http = require('http');
const https = require('https');
const fs = require('fs');
var shell = require('shelljs');
let mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
const multer = require('multer');
const csv=require('csvtojson')

const axios = require('axios');

const Router = express.Router;
const csvFile = require('./api/model/csvModel');
const webShrinkerData = require('./api/model/webShrinkerModel') 

const upload = multer({ dest: './tmp/csv/' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;


//use morgan logging
app.use(morgan('dev'));

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb+srv://inmobi:' + 'h911bqe2BvfrwLXM' + '@webshrinkerapi-app-cluster-jatze.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection;

//cors headers 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Authorization");
  if (req.method === 'OPTIONS'){
      res.header("Access-Control-Allow-Headers", "PUT, POST, PATCH, DELETE, GET");
      res.status(200).json({});
  }
  next();
});

router.post('/', upload.single('csvFile'), function (req, res) {
    const fileRows = [];
    const csvFilePath=req.file.path;
    console.log(csvFilePath);
    csv({
        noheader:true,
        output: "csv"
    })
    .fromFile(csvFilePath)
    .then((csvRow)=>{ 
      
      let URL = csvRow[0].toString();
    });

    key="DDL9l5B3pTtQMsGOaPVB"
    secret="bhvQhfbvorx2LlkSGlz7"
    const { stdout, stderr, code } = shell.exec('bash auth.sh', { silent: true });

    targetURL = ((stdout.toString()).trim());
    console.log(targetURL);
    const request = require('request');

    request(targetURL, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      updateDb("1", "www.google.com", JSON.stringify(res))
    });    
});


function updateDb(vid, url, data){
  const payload = new webShrinkerData({
    viedId: vid,
    url: url,
    responseFromWS: data 
  });
  payload
      .save()
      .then(result => {
          console.log(result);
          console.log("Successfully stored to db")
      })
      .catch(err => {
          console.log(err);
      });

}

app.use('/upload-csv', router);

function startServer() {
    server.listen(port, function () {
      console.log('Express server listening on ', port);
    });
  }
  
  setImmediate(startServer);