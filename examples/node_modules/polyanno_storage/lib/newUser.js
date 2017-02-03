
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({

	"username": String,

	"docs_edited": {
		"vectors" : {
			"created" : [],
			"edited" : [],
			"deleted" : []
		},
		"transcriptions" : {
			"created" : [],
			"edited" : [],
			"deleted" : []
		},
		"translations" : {
			"created" : [],
			"edited" : [],
			"deleted" : []
		}
	},

	"favourites" : [{
		"image_id" : String,
		"the_image" : {
			"type": Boolean,
			"default": false
		},
		"transcriptions" : [],
		"translations" : [],
		"vectors" : []
	}]

},

{ autoIndex: false }

);

module.exports = mongoose.model('newUser', userSchema);
