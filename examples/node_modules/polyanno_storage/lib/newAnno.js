var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var annoSchema   = new Schema({

	"@context": {
		type: [], 
		default: [
		"http://www.w3.org/ns/anno.jsonld"
		]},
	"id": {
		type: String,
	},
	"body": {
		"id": {
			type: String,
		},
		"format": {
			type: String,
			default: "application/json"
		},
	},
	"target": 
		[{
			"id": {
				type: String
			},
			"format": {
				type: String,
				default: "application/json"
			},
			"language": {
				type: String
			}
		}]
	,
	"type": {
		type: "string",
		default: "Annotation"
	}

},

{ autoIndex: false }

);

module.exports = mongoose.model('newAnno', annoSchema);
