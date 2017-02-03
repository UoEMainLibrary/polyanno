var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var translationSchema   = new Schema({
	"@context": {
		type: [], 
		default: [
		"http://127.0.0.1:8080/context.json"
		]},
	"id": {
		type: String,
	},
    "type": {
    	type: []
    },
    "parent": {
    	type: String
    },
    "children": [{

    	"id": {
    		type: String
    	},
    	"fragments": [{
    		"id": {
    			type: String
    		},
    		"votesUp": {
    			type: Number
    		},
    		"rank": {
    			type: Number
    		}
    	}]

    }],
    "transcription": {
    	type: String
    },
	"created": { type: Date, default: Date.now },
	"creator": {
		"id": {
			type: String
		},
		"name": {
			type: String
		},
		"motivation": {
			type: String,
			default: "identifying"
		}
	},
	"metadata":[]

});

module.exports = mongoose.model('newTranslation', translationSchema);