const http = require('http');
const fs = require('fs');

// let mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
const multer = require('multer');
const csv=require('csvtojson')

const axios = require('axios');

const Router = express.Router;
const csvFile = require('./api/model/csvModel');

const upload = multer({ dest: './tmp/csv/' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;


//use morgan logging
app.use(morgan('dev'));

// Connect to Mongoose and set connection variable
// mongoose.connect('mongodb+srv://inmobi:' + 'h911bqe2BvfrwLXM' + '@webshrinkerapi-app-cluster-jatze.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
// var db = mongoose.connection;

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
      // URL = URL.replace(/(^\w+:|^)\/\//, '');

      console.log("URL IS " + URL);
      // REQUEST=URL+"?key="+WS_ACCESS_KEY;
      // HASH= WS_SECRET_KEY + ":" + REQUEST;


    //   axios.get('https://api.webshrinker.com/categories/v3/'+URL, {}, {
    //     auth: {
    //       username: 'DDL9l5B3pTtQMsGOaPVB',
    //       password: 'bhvQhfbvorx2LlkSGlz7'
    //     }
    //   })
      
    //     .then(response => {
    //       console.log(response.data.url);
    //       console.log(response.data.explanation);
    //     })
    //     .catch(error => {
    //       console.log(error.response);
    //     });
    //     // console.log(csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
    // })
    });

    //push webshrunker data to webshrunkermodel

    
    res.status(200).json({});
      
});

// router.get('/filestatus', (req, res, next) => {
//   csvFile.find()
//       .exec()
//       .then(docs => {
//           console.log(docs);
//           res.status(200).json(docs);
//       })
//       .catch(err => {
//           console.log(err);
//           res.status(500).json({
//               error: err
//           });
//       });
// })
app.use('/upload-csv', router);

function startServer() {
    server.listen(port, function () {
      console.log('Express server listening on ', port);
    });
  }
  
  setImmediate(startServer);