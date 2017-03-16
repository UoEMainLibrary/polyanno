
exports.schema_opts = {

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
