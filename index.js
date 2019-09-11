const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const http = require('http');

const app = express()
const PORT = 3000;


//import routes
const uploadRoute = require('./api/routes/upload')
const viewRoute = require('./api/routes/view')


//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Authorization");
    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Headers", "PUT, POST, PATCH, DELETE, GET");
        res.status(200).json({});
    }
    next();
});

// DB
mongoose.connect('mongodb+srv://inmobi:' + 'h911bqe2BvfrwLXM' + '@webshrinkerapi-app-cluster-jatze.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection;


app.use('/upload', uploadRoute );


// Import routes
app.get('/', function (req, res) {
  res.send('Hello, World!')
})

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404 ;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));