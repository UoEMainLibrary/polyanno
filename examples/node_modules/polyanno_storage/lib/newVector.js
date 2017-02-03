var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var vectorSchema   = new Schema({

	"@context": {
		type: []
    },
	"id": {
		type: String
	},
    "notFeature": {
    	"notType": {
    		type: String,
    		default: "Feature"
    	},
    	"notProperties": {
    		"notName": String
    	},
	    "notGeometry": {
	    	"notType":{
	    		type: String,
	    		default: "Polygon"
	    	},
	    	"notCoordinates": {
	    		type:[]
	    	},
	    },

	    "notCrs": {
    		"notType": {
    			type: String,
    			default: "name"
    		},
    		"notProperties": {
    			type: String,
    			default: "L.CRS.Simple"
    		}
    	}
	},
	"metadata": [],
    "parent": {
    	type: String
    },
    "children": {
    	type: []
    },
    "translation": {
    	type: String,
    	default: ""
    },
    "transcription": {
    	type: String,
    	default: ""
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

},

{ autoIndex: false }

);

module.exports = mongoose.model('newVector', vectorSchema);
