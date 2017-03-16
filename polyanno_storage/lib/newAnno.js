var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

/////If further information is required about the subjects involved then LOOKUPs are completed on the subject
var subdoc = new Schema({
    "id": {
    	type: String
    },
    "format": {
    	type: String
    },
    "language": [{}],
    "processingLanguage": {
    	type: String
    },
    "textDirection": {
      type: String,
      match: /^(ltr|rtl|auto)$/
    },
    "type": {
    	type: []
    }
});

var annoSchema   = new Schema({

	"_id": {
		type: Number
	},

	"@context": {
		type: [], 
		default: [
		"http://www.w3.org/ns/anno.jsonld"
		]},
	"id": {
		type: String,
	},
	"body": subdoc,
	"target": [subdoc],
	"type": {
		type: String,
		default: "Annotation"
	},
	"created": { type: Date, default: Date.now },
	"creator": {
		"id": {
		  type:  String, 
		  ref: 'newUser'
		},
		"motivation": {
		  type: String,
		  default: "identifying"
		}
	}

},

{ autoIndex: false }

);

exports.schema = annoSchema;
