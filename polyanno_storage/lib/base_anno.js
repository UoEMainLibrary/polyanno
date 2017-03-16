
exports.options = {
    "_id": {
      type: Number
    },
    "@context": {
      type: [], 
      default: [
        setting_vars.contexts.default
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
  };