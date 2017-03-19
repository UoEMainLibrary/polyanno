var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var setup = require('./setup');

var annoSchema   = new Schema({

	"@context": {
		type: [], 
		default: [
		"http://www.w3.org/ns/anno.jsonld"
		]
	},
	"id": {
		type: String,
	},
	"body": [{
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
	}],
	"target": [{
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
	}],
	"type": {
		type: String,
		default: "Annotation"
	}

});

module.exports = setup.polyanno_db.model('newAnno', annoSchema);
