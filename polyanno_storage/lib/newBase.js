var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var util = require('util');
var setup = require('./setup');

function BaseSchema() {
  Schema.apply(this, arguments);
  
  this.add({
    "@context": {
      type: [], 
      default: [
        setup.config.contexts.default
      ]},
    "id": {
      type: String,
    },
    "type": {
        type: []
      },
    "created": { type: Date, default: Date.now },
    "creator": {
      "id": {
        type:  Number, 
        ref: 'newUser'
      },
      "motivation": {
        type: String,
        default: "identifying"
      }
    },
    "metadata":[],
    "format": {
      type: String,
      default: "application/json"
    },
    "language": [{
      type: String
    }],
    "processingLanguage": {
      type: String
    },
    "textDirection": {
      type: String,
      match: /^(ltr|rtl|auto)$/
    }
  });
};
util.inherits(BaseSchema, Schema);

module.exports.schema = BaseSchema;

var this_baseSchema = new BaseSchema();

module.exports.model = setup.polyanno_db.model('theBasics', this_baseSchema);
