
// SETUP REQUIREMENTS

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cors = require('cors');
var polyanno = require('polyanno_storage');

var databaseURL = polyanno.setup.databaseport;
var thisWebsitePort = polyanno.setup.applicationport;

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
mongoose.connect(databaseURL, { config: { autoIndex: false } });

/////////////////API ROUTES

//ANNOTATIONS API

app.post('/annotations', polyanno.annotations.addNew );
app.put( polyanno.annotations.updateOne ); ///
app.get('/annotations', polyanno.annotations.getAll);
app.get('/annotations/vectors', polyanno.annotations.getAllVectorAnnos);
app.get('/annotations/transcriptions', polyanno.annotations.getAllTranscriptionAnnos);
app.get('/annotations/translations', polyanno.annotations.getAllTranslationAnnos);
app.get('/annotations/:anno_id', polyanno.annotations.getByID);
app.get('/annotations/target/:target_id', polyanno.annotations.getByTarget);
app.delete('/annotations', polyanno.annotations.deleteAll);
app.delete('/annotations/:anno_id', polyanno.annotations.deleteOne);

//VECTOR API

app.get('/vectors', polyanno.vectors.findAll);
app.post('/vectors', polyanno.vectors.addNew);
app.delete('/vectors', polyanno.vectors.deleteAll);

app.get('/vectors/:vector_id', polyanno.vectors.getByID);
app.put('/vectors/:vector_id', polyanno.vectors.updateOne);
app.delete('/vectors/:vector_id', polyanno.vectors.deleteOne);

app.get('/vectors/targets/:target', polyanno.annotations.getVectorsByTarget);
app.get('/vectors/ids/:_ids/target/:target_id', polyanno.vectors.searchByIds);

//TRANSCRIPTION API

app.get('/transcriptions', polyanno.transcriptions.findAll);
app.post('/transcriptions', polyanno.transcriptions.addNew);
app.get('/transcriptions/:transcription_id', polyanno.transcriptions.getByID);
app.put('/transcriptions/:transcription_id', polyanno.transcriptions.updateOne);
app.put('/transcriptions/voting/:voteType', polyanno.transcriptions.voting);
app.delete('/transcriptions/:transcription_id', polyanno.transcriptions.deleteOne);
app.delete('/transcriptions', polyanno.transcriptions.deleteAll);

app.get('/transcriptions/targets/:target', polyanno.annotations.getTranscriptionsByTarget);
app.get('/transcriptions/ids/:_ids/target/:target_id', polyanno.transcriptions.searchByIds);

//TRANSLATION API

app.get('/translations', polyanno.translations.findAll);
app.post('/translations', polyanno.translations.addNew);
app.get('/translations/:transcription_id', polyanno.translations.getByID);
app.put('/translations/:transcription_id', polyanno.translations.updateOne);
app.put('/translations/voting/:voteType', polyanno.translations.voting);
app.delete('/translations/:transcription_id', polyanno.translations.deleteOne);
app.delete('/translations', polyanno.translations.deleteAll);

app.get('/translations/targets/:target', polyanno.annotations.getTranslationsByTarget);
app.get('/translations/ids/:_ids/target/:target_id', polyanno.translations.searchByIds);

/////////GET STARTED

app.listen(thisWebsitePort);

