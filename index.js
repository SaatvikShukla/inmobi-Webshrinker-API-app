// Import express
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const morgan = require('morgan');

// init app
let app = express();

// Import routes
let apiRoutes = require("./api/routes/api-routes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('WebshrinkerAPI-App is online'));

// Use Api routes in the App
app.use('/api', apiRoutes);


// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running on port " + port + "\n");
});