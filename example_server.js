
// SETUP REQUIREMENTS

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cors = require('cors');
var polyanno = require('./polyanno_storage');

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

//////MIDDLEWARE

var annoRouter = express.Router();

annoRouter.use(function(req, res, next) {
  ///logging here
    console.log("the body is "+JSON.stringify(req.body)+" and params "+JSON.stringify(req.params));
    next(); 
});

/////////////////API ROUTES

//ANNOTATIONS API

annoRouter.post('/annotations', polyanno.annotations.addNew );
annoRouter.put( polyanno.annotations.updateOne ); ///
annoRouter.get('/annotations', polyanno.annotations.getAll);
annoRouter.get('/annotations/vectors', polyanno.annotations.getAllVectorAnnos);
annoRouter.get('/annotations/transcriptions', polyanno.annotations.getAllTranscriptionAnnos);
annoRouter.get('/annotations/translations', polyanno.annotations.getAllTranslationAnnos);
annoRouter.get('/annotations/:anno_id', polyanno.annotations.getByID);
annoRouter.get('/annotations/target/:target_id', polyanno.annotations.getByTarget);
/////This function doesn't exist yet!
//annoRouter.get('/annotations/body/:body_id', polyanno.annotations.getByBody);
annoRouter.delete('/annotations', polyanno.annotations.deleteAll);
annoRouter.delete('/annotations/:anno_id', polyanno.annotations.deleteOne);

//VECTOR API

annoRouter.get('/vectors', polyanno.vectors.findAll);
annoRouter.post('/vectors', polyanno.vectors.addNew);
annoRouter.delete('/vectors', polyanno.vectors.deleteAll);

annoRouter.get('/vectors/:vector_id', polyanno.vectors.getByID);
annoRouter.put('/vectors/:vector_id', polyanno.vectors.updateOne);
annoRouter.delete('/vectors/:vector_id', polyanno.vectors.deleteOne);

annoRouter.get('/vectors/targets/:target', polyanno.annotations.getVectorsByTarget);
annoRouter.get('/vectors/ids/:_ids/target/:target_id', polyanno.vectors.searchByIds);

//TRANSCRIPTION API

annoRouter.get('/transcriptions', polyanno.transcriptions.findAll);
annoRouter.post('/transcriptions', polyanno.transcriptions.addNew);
annoRouter.get('/transcriptions/:transcription_id', polyanno.transcriptions.getByID);
annoRouter.put('/transcriptions/:transcription_id', polyanno.transcriptions.updateOne);
annoRouter.put('/transcriptions/voting/:voteType', polyanno.transcriptions.voting);
annoRouter.delete('/transcriptions/:transcription_id', polyanno.transcriptions.deleteOne);
annoRouter.delete('/transcriptions', polyanno.transcriptions.deleteAll);

annoRouter.get('/transcriptions/targets/:target', polyanno.annotations.getTranscriptionsByTarget);
annoRouter.get('/transcriptions/ids/:_ids/target/:target_id', polyanno.transcriptions.searchByIds);

//TRANSLATION API

annoRouter.get('/translations', polyanno.translations.findAll);
annoRouter.post('/translations', polyanno.translations.addNew);
annoRouter.get('/translations/:transcription_id', polyanno.translations.getByID);
annoRouter.put('/translations/:transcription_id', polyanno.translations.updateOne);
annoRouter.put('/translations/voting/:voteType', polyanno.translations.voting);
annoRouter.delete('/translations/:transcription_id', polyanno.translations.deleteOne);
annoRouter.delete('/translations', polyanno.translations.deleteAll);

annoRouter.get('/translations/targets/:target', polyanno.annotations.getTranslationsByTarget);
annoRouter.get('/translations/ids/:_ids/target/:target_id', polyanno.translations.searchByIds);

/////////GET STARTED

app.use('/api', annoRouter);

app.listen(thisWebsitePort);

