var mongoose     = require('mongoose');
var util = require('util');
var setup = require('./setup');
var base = require('./newBase');
var BaseSchema = base.schema;

var vectorSchema = new BaseSchema({

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
    "OCD": [],
    "parent": {
        type: Number,
        ref: 'newVector'
    },
    "children": [{
        type: Number,
        ref: 'newVector'
    }],
    "transcription_fragment": {
        type: Number,
        ref: 'newTranscription'
    },
    "translation_fragment": {
        type: Number,
        ref: 'newTranslation'
    }

});

module.exports = base.model.discriminator('newVector', vectorSchema);

