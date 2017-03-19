
//SETUP

var mongoose     = require('mongoose');
var setup = require('./setup');

//SCHEMA FUNCTIONS

var newBase = require('./newBase');
var newAnno = require('./newAnno');
var newUser = require('./newUser');
var newText = require('./newText');
var newVector = require('./newVector');

exports.base_model = newBase.model;
exports.anno_model = newAnno;
exports.user_model = newUser;
exports.vector_model = newVector;
exports.translation_model = newText.Transcription;
exports.transcription_model = newText.Translation;



var split_id_number = function(id, url) {
  var parts = id.split(url);
  return parts[0];
};

var convert_to_objID = function(id_string) {
  return mongoose.Types.ObjectId(id_string);
};

var url_split = function(this_id) {
    if (this_id.includes(setup.vectorURL)) {
      return split_id_number(this_id, setup.vectorURL); 
    }
    else if (this_id.includes(setup.transcriptionURL)) {
      return split_id_number(this_id, setup.transcriptionURL);
    }
    else if (this_id.includes(setup.translationURL)) {
      return split_id_number(this_id, setup.translationURL);
    }
    else if (this_id.includes(setup.userURL)) {
      return split_id_number(this_id, setup.userURL);
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

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

exports.isUseless = isUseless;

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

