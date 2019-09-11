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
const request = require('request');
var uuidv4 = require('uuid/v4');

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
  // if (req.method === 'OPTIONS'){
  //     res.header("Access-Control-Allow-Headers", "PUT, POST, PATCH, DELETE, GET");
  //     res.status(200).json({});
  // }
  next();
});

router.post('/', upload.single('csvFile'), function (req, res) {
    const fileRows = [];
    const csvFilePath=req.file.path;

    if(csvFilePath){
      // console.log(csvFilePath);
      csv({
          noheader:true,
          output: "csv"
      })
      .fromFile(csvFilePath)
      .then((csvRow)=>{ 
        let id = uuidv4();
        let totalData = {
          "domain" : []
        }

        for(i= 0; i< csvRow.length; i++){
          let URL = csvRow[i].toString();
          // let dbActionSuccess = 0;
          const { stdout, stderr, code } = shell.exec('bash auth.sh '+URL, { silent: true });
          targetURL = ((stdout.toString()).trim());
          // console.log(targetURL);
          // tempArr.id = "1";
          child = {
            "url" : URL,
            "targetURL" : targetURL
          };
          totalData.domain.push(child)
        }

        let dbActionResult = updateDb(id, totalData);
        // if (dbActionResult == 1) {
          // res.send("done");
        // } else {
          // res.send("Failed");
        // }
      });
      res.send("Done");
    }        
});


function updateDb(vid, datasetforViewId){
  // console.log("Total data passed is of type "+ typeof datasetforViewId)
  // console.log(datasetforViewId)
  const payload = new webShrinkerData({
    _id: new mongoose.Types.ObjectId(),
    viedId: vid,
    domains: JSON.stringify(datasetforViewId.domain)
  });
  // console.log(JSON.parse(payload.domains))
  // console.log( typeof payload)
  payload
      .save()
      .then(result => {
          // console.log(datasetforViewId.domain);
          console.log("Successfully stored to db")
          return 1;
      })
      .catch(err => {
          console.log(err);
          return 0;
      });

}

router.get('/files', function (req, res) {

  webShrinkerData.find()
  .exec()
  .then(docs => {
      // console.log(docs);
      // console.log(typeof (docs));

      res.status(200).json(docs);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

router.get('/files/:viewId', function (req, res) {
  const id = req.params.viewId;
  webShrinkerData.findById( id )
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
});

app.use('/upload-csv', router);

function startServer() {
    server.listen(port, function () {
      console.log('Express server listening on ', port);
    });
  }
  
  setImmediate(startServer);