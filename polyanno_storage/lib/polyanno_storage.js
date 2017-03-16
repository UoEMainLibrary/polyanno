
exports.setup = require('./routes_setup');
exports.annotations = require('./annotations');
exports.vectors = require('./vectors');
exports.transcriptions = require('./transcriptions');
exports.translations = require('./translations');
exports.users = require('./usersroute');

/*
var psetup = require('./routes_setup');
var pannotations = require('./annotations');
var pvectors = require('./vectors');
var ptranscriptions = require('./transcriptions');
var ptranslations = require('./translations');
var pusers = require('./usersroute');

exports.setup = psetup;
exports.annotations = pannotations;
exports.vectors = pvectors;
exports.transcriptions = ptranscriptions;
exports.translations = ptranslations;
exports.users = pusers;

/////////////////API ROUTES
var express    = require('express'); ///need to remember to include in package.json

exports.annoRouter = express.Router();

//ANNOTATIONS API

annoRouter.post('/annotations', pannotations.addNew );
annoRouter.put( '/annotations/:anno_id' pannotations.updateOne ); 

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


annoRouter.post('/transcriptions', polyanno.transcriptions.addNew);
annoRouter.put('/transcriptions/:transcription_id', polyanno.transcriptions.updateOne);

annoRouter.get('/transcriptions/:transcription_id', polyanno.transcriptions.getByID);
annoRouter.get('/transcriptions', polyanno.transcriptions.findAll);
annoRouter.delete('/transcriptions/:transcription_id', polyanno.transcriptions.deleteOne);
annoRouter.delete('/transcriptions', polyanno.transcriptions.deleteAll);
annoRouter.get('/transcriptions/parent/:parent_id', polyanno.transcriptions.searchByParent);

annoRouter.get('/transcriptions/targets/:target', polyanno.annotations.getTranscriptionsByTarget);
annoRouter.get('/transcriptions/ids/:_ids', polyanno.transcriptions.searchByIds);

//TRANSLATION API

annoRouter.post('/translations', polyanno.translations.addNew);
annoRouter.put('/translations/:transcription_id', polyanno.translations.updateOne);

annoRouter.get('/translations/:transcription_id', polyanno.translations.getByID);
annoRouter.get('/translations', polyanno.translations.findAll);
annoRouter.delete('/translations/:transcription_id', polyanno.translations.deleteOne);
annoRouter.delete('/translations', polyanno.translations.deleteAll);
annoRouter.get('/translations/parent/:parent_id', polyanno.translations.searchByParent);

annoRouter.get('/translations/targets/:target', polyanno.annotations.getTranslationsByTarget);
annoRouter.get('/translations/ids/:_ids', polyanno.translations.searchByIds);

///

*/
