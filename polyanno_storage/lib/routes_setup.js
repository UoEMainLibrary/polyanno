// SETUP

exports.vector_model     = require('./newVector');
exports.translation_model    = require('./newTranslation');
exports.transcription_model    = require('./newTranscription');
exports.user_model = require('./newUser');
exports.anno_model    = require('./newAnno');

//////important to set these accordingly
var hostname = "http://localhost:";
var thisport = 8080;
exports.applicationport = thisport;
exports.databaseport = "mongodb://localhost:27017/testMongoDB";


var website_address = hostname + thisport.toString(); 
exports.vectorURL = website_address.concat("/api/vectors/");
exports.transcriptionURL = website_address.concat("/api/transcriptions/");
exports.translationURL = website_address.concat("/api/translations/");
exports.annotationURL = website_address.concat("/api/annotations/");
exports.userURL = website_address.concat("/user/");

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);

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

