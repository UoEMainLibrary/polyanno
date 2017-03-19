var mongoose     = require('mongoose');
var util = require('util');
var setup = require('./setup');
var base = require('./newBase');
var BaseSchema = base.schema;

var text_opts = {

    "text": String,
    "language": [{
    	type: String
    }],
    "voting": {
        "up": {
            type: Number,
            default: 0
        },
        "down": {
            type: Number,
            default: 0
        }        
    },
    "vector": {
        type: Number,
        ref: 'newVector'
    }

};

var transcriptionSchema = new BaseSchema(text_opts);
var translationSchema = new BaseSchema(text_opts);

transcriptionSchema.add({
  "parent": {
    type: Number,
    ref: 'newTranscription'
  },
  "translation": {
    type: Number,
    ref: 'newTranslation'
  }
});

transcriptionSchema.add({
  "parent": {
    type: Number,
    ref: 'newTranslation'
  },
  "transcription": {
    type: Number,
    ref: 'newTranscription'
  }
});

module.exports.Transcription = base.model.discriminator('newTranscription', transcriptionSchema);
module.exports.Translation = base.model.discriminator('newTranslation', translationSchema);
