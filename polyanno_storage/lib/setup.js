
//SETUP

var mongoose = require('mongoose');

//ENVIRONMENT VARIABLES

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
    default: "./context.json",
    annotation: "http://www.w3.org/ns/anno.jsonld",
    //add geoJSON??
  }
};

var mongo_address = setting_vars.db.hostname.concat(setting_vars.db.port.toString(),"/",setting_vars.db.folder);
var website_address = setting_vars.app.hostname + setting_vars.app.port.toString(); 

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);

var this_database = mongoose.createConnection(mongo_address, { config: { autoIndex: false } });

///

exports.config = setting_vars;

exports.polyanno_db = this_database;

exports.database_url = mongo_address;
exports.application_url = website_address;

exports.vectorURL = website_address.concat(setting_vars.urls.vectors);
exports.transcriptionURL = website_address.concat(setting_vars.urls.transcriptions);
exports.translationURL = website_address.concat(setting_vars.urls.translations);
exports.annotationURL = website_address.concat(setting_vars.urls.annotations);
exports.userURL = website_address.concat(setting_vars.urls.users);

