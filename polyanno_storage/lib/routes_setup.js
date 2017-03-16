// SETUP
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var util = require('util');

//set to variables of process.env.npm_package_config_ ??

var setting_vars = {
  app: {
    hostname: "http://localhost:",
    port: 8080
  },
  db: {
    hostname: "mongodb://localhost:",
    port: 27017,
    folder: "testMongoDB"
  },
  urls: {
    vectors: "/api/vectors/",
    transcriptions: "/api/transcriptions/",
    translations: "/api/translations/",
    annotations: "/api/annotations/",
    users: "/user/"
  },
  contexts: {
    default: website_address.concat("./context.json"),
    annotation: "http://www.w3.org/ns/anno.jsonld",
    //add geoJSON??
  }
};

var mongo_address = setting_vars.db.hostname.concat(setting_vars.db.port.toString(),"/",setting_vars.dbfolder);
var website_address = setting_vars.app.hostname + setting_vars.app.port.toString(); 

exports.vectorURL = website_address.concat(setting_vars.urls.vectors);
exports.transcriptionURL = website_address.concat(setting_vars.urls.transcriptions);
exports.translationURL = website_address.concat(setting_vars.urls.translations);
exports.annotationURL = website_address.concat(setting_vars.urls.annotations);
exports.userURL = website_address.concat(setting_vars.urls.users);

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);

//SCHEMA FUNCTIONS

var base_options = require('./base_anno').options;

function BaseSchema() {
  Schema.apply(this, arguments);
  
  this.add(base_options);
};
util.inherits(BaseSchema, Schema);

var baseBodySchema = new BaseSchema();

var base_text_opts = require('./base_text').schema_opts;
var vector_opts = require('./newVector').schema_opts;

var vectorSchema = new BaseSchema(vector_opts);
var transcriptionSchema = new BaseSchema(base_text_opts);
var translationSchema = new BaseSchema(base_text_opts);

transcriptionSchema.add({
  "parent": {
    type: Number,
    ref: 'newTranscription'
  },
  "translation": {
    type: Number,
    ref: 'newTranslation'
  }
});

transcriptionSchema.add({
  "parent": {
    type: Number,
    ref: 'newTranslation'
  },
  "transcription": {
    type: Number,
    ref: 'newTranscription'
  }
});

var annoSchema = require('./newAnno').schema;
var userSchema = require('./newUser').schema;

var theBasics = mongoose.model('theBasics', baseBodySchema);
var newVector = theBasics.discriminator('newVector', vectorSchema);
var newTranscription = theBasics.discriminator('newTranscription', transcriptionSchema);
var newTranslation = theBasics.discriminator('newTranslation', translationSchema);
var newAnno = mongoose.model('newAnno', annoSchema);
var newUser = mongoose.model('newUser', userSchema);

exports.basic_model = theBasics;
exports.user_model = newUser;
exports.anno_model = newAnno;
exports.vector_model = newVector;
exports.translation_model = newTranscription;
exports.transcription_model = newTranslation;

var split_id_number = function(id, url) {
  var parts = id.split(url);
  return parts[0];
};

var convert_to_objID = function(id_string) {
  return mongoose.Types.ObjectId(id_string);
};

var url_split = function(this_id) {
    if (this_id.includes(exports.vectorURL)) {
      return split_id_number(this_id, exports.vectorURL); 
    }
    else if (this_id.includes(exports.transcriptionURL)) {
      return split_id_number(this_id, exports.transcriptionURL);
    }
    else if (this_id.includes(exports.translationURL)) {
      return split_id_number(this_id, exports.translationURL);
    }
    else if (this_id.includes(exports.userURL)) {
      return split_id_number(this_id, exports.userURL);
    }
    else {
      return false;
    };
};

exports.db_model_checks = function(this_id) {
    var number = url_split(this_id);
    console.log("the number is "+number);
    return Number(number);
};

//RESETTING VARIABLES FUNCTIONS

exports.set_address_var = function(field, subfield, value) {
  ////???? Need to implement this properly
  setting_vars[field][subfield] = value;
};

//ROUTE FUNCTIONS

exports.isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

exports.asyncPush = function(addArray, oldArray) {
    var theArray = oldArray;
    var mergedArray = function() {
        addArray.forEach(function(addDoc){
            theArray.push(addDoc);
        });
        if (theArray.length = (oldArray.length + addArray.length)) {
            return theArray;
        };
    };
    return mergedArray();
};

exports.fieldMatching = function(searchArray, field, fieldValue) {
  if (isUseless(searchArray) || isUseless(field) || isUseless(fieldValue)) {  return false  }
  else {
    var theMatch = false; 
    searchArray.forEach(function(childDoc){
      if (childDoc[field] == fieldValue) {
          theMatch = childDoc;
      };
    });
    return theMatch;
  };
};

exports.jsonFieldEqual = function(docField, bodyDoc, bodyField) {
    if (isUseless(bodyDoc[bodyField]) == false ) {    return bodyDoc[bodyField];    }
    else {    return docField;    };
};

///TEMPORARY STUFF

exports.applicationport = setting_vars.app.port;
exports.databaseport = setting_vars.db.port;
exports.database_url = mongo_address;
exports.application_url = website_address;
