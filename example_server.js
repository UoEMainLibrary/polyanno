
// SETUP REQUIREMENTS

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cors = require('cors');
var polyanno = require('polyanno_storage');

var thisWebsitePort = polyanno.setup.config.app.port;

// GET APPLICATION RUNNING

var app        = express();  

////BASIC APP ROUTES & SETUP

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/example1.html"); 
});

app.use(express.static(__dirname + '/'));

app.use(cors());
//Currently using cors for all origins just for development but will need to be specific for actual deployment

///////SETUP

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || thisWebsitePort; 

app.use('/api', polyanno.router);

app.listen(thisWebsitePort);

