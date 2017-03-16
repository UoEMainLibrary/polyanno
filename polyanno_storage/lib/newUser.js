
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
	"_id": {
		type: Number
	},

	"username": String,

	"profile": {
		"icon": {
			type: String
		}
	},

	"favourites" : [{
		"image_id" : String,
		"the_image" : {
			"type": Boolean,
			"default": false
		},
		"transcriptions" : [{
			    type: Number,
			    ref: 'newTranscription'
			  }],
		"translations" : [{
			    type: Number,
			    ref: 'newTranslation'
			  }],
		"vectors" : [{
		        type: Number,
		        ref: 'newVector'
		    }]
	}]

},

{ autoIndex: false }

);

exports.schema = userSchema;
