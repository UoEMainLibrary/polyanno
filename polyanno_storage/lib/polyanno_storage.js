
var express    = require('express');
var bodyParser = require('body-parser');

var psetup = require('./setup');
var pcommon = require('./common');
var pannotations = require('./annotations');
var pvectors = require('./vectors');
var ptranscriptions = require('./transcriptions');
var ptranslations = require('./translations');
var pusers = require('./users');

exports.setup = psetup;
exports.common = pcommon;
exports.annotations = pannotations;
exports.vectors = pvectors;
exports.transcriptions = ptranscriptions;
exports.translations = ptranslations;
exports.users = pusers;

/////////////////API ROUTES

var annoRouter = express.Router();

annoRouter.use(function(req, res, next) {
  ///logging here
    console.log("the url is "+req.originalUrl+" and the body is "+JSON.stringify(req.body)+" and params "+JSON.stringify(req.params));
    next(); 
});

//ANNOTATIONS API

annoRouter.post('/annotations', pannotations.addNew );
annoRouter.put( '/annotations/:anno_id', pannotations.updateOne ); 

annoRouter.get('/annotations', pannotations.getAll);
annoRouter.get('/annotations/vectors', pannotations.getAllVectorAnnos);
annoRouter.get('/annotations/transcriptions', pannotations.getAllTranscriptionAnnos);
annoRouter.get('/annotations/translations', pannotations.getAllTranslationAnnos);
annoRouter.get('/annotations/:anno_id', pannotations.getByID);
annoRouter.get('/annotations/target/:target_id', pannotations.getByTarget);
annoRouter.get('/annotations/body/:body_id', pannotations.getByBody);
annoRouter.delete('/annotations', pannotations.deleteAll);
annoRouter.delete('/annotations/:anno_id', pannotations.deleteOne);

//VECTOR API

annoRouter.post('/vectors', pvectors.addNew); ///polyanno.annotations.addNew
annoRouter.put('/vectors/:vector_id', pvectors.updateOne); //polyanno.annotations.addNew

annoRouter.delete('/vectors', pvectors.deleteAll);
annoRouter.delete('/vectors/:vector_id', pvectors.deleteOne);

annoRouter.get('/vectors', pvectors.findAll);
annoRouter.get('/vectors/:vector_id', pvectors.getByID);
annoRouter.get('/vectors/parent/:parent_id', pvectors.searchByParent);
annoRouter.get('/vectors/transcription/:frag_id', pvectors.searchByTranscription);
annoRouter.get('/vectors/translation/:frag_id', pvectors.searchByTranslation);

annoRouter.get('/vectors/targets/:target', pannotations.getVectorsByTarget);
annoRouter.get('/vectors/ids/:_ids', pvectors.searchByIds);

//TRANSCRIPTION API


annoRouter.post('/transcriptions', ptranscriptions.addNew);
annoRouter.put('/transcriptions/:transcription_id', ptranscriptions.updateOne);

annoRouter.get('/transcriptions/:transcription_id', ptranscriptions.getByID);
annoRouter.get('/transcriptions', ptranscriptions.findAll);
annoRouter.delete('/transcriptions/:transcription_id', ptranscriptions.deleteOne);
annoRouter.delete('/transcriptions', ptranscriptions.deleteAll);
annoRouter.get('/transcriptions/parent/:parent_id', ptranscriptions.searchByParent);

annoRouter.get('/transcriptions/targets/:target', pannotations.getTranscriptionsByTarget);
annoRouter.get('/transcriptions/ids/:_ids', ptranscriptions.searchByIds);

//TRANSLATION API

annoRouter.post('/translations', ptranslations.addNew);
annoRouter.put('/translations/:transcription_id', ptranslations.updateOne);

annoRouter.get('/translations/:transcription_id', ptranslations.getByID);
annoRouter.get('/translations', ptranslations.findAll);
annoRouter.delete('/translations/:transcription_id', ptranslations.deleteOne);
annoRouter.delete('/translations', ptranslations.deleteAll);
annoRouter.get('/translations/parent/:parent_id', ptranslations.searchByParent);

annoRouter.get('/translations/targets/:target', pannotations.getTranslationsByTarget);
annoRouter.get('/translations/ids/:_ids', ptranslations.searchByIds);

///

module.exports.router = annoRouter;

