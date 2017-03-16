exports.schema_opts = {

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

};

