// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./setup');
var common = require('./common');

//ROUTE FUNCTIONS

exports.findAll = function(req, res) {
    common.transcription_model.find(function(err, transcriptions) {
        if (err) {res.send(err)}
        else { res.json(transcriptions); };
    });
};

exports.deleteAll = function(req, res) {
      
    common.transcription_model.find(function(err, transcriptions) {
        if (err) {res.send(err)};

        transcriptions.forEach(function(transcription){
            transcription.remove({_id: transcription._id},
            function(err){
                if (err) {res.send(err)};
            });
        });
        if (transcriptions.length == 0) {
            res.send("all gone");
        };
    }); 
};


/////////merge as part of idmatching???
var theIDCheck = function(theArray, doc) {
    if ( typeof common.fieldMatching(theArray, "id", doc.id) != ('undefined' || null)) {
        return common.fieldMatching(theArray, "id", doc.id); 
    }
    else {
        return null;
    };           
};

/////should return an array of arrays of matching pairs
var arrayIDCompare = function(arrayA, arrayB) {

    var returnArray =[];
    var i = 0;
    arrayA.forEach(function(doc){
        if (common.isUseless(theIDCheck(arrayB, doc) )) { i += 1; }
        else {
            i += 1;
            returnArray.push([doc, theIDCheck(arrayB, doc)]); ////push a pair of matching docs
        };
    });

    if ( (i == arrayA.length) && ( common.isUseless(returnArray[0]) ) ) {    return null;    }
    else if ( (i == arrayA.length) && (common.isUseless(returnArray[0]) == false ) ) {    return returnArray;    };
};

exports.addNew = function(req, res, next) {
    
    var transcription = new common.transcription_model(); 

    var jsonFieldPush = function(bodyDoc, theField) {
        if ( !common.isUseless(bodyDoc[theField]) ) {
            bodyDoc[theField].forEach(function(subdoc){    transcription[theField].addToSet(subdoc);    });
        };
    };
    var transURL = setup.transcriptionURL.concat(transcription._id);
    transcription.id = transURL; 
    transcription.text = common.jsonFieldEqual(transcription.text, req.body, "text");
    transcription.format = common.jsonFieldEqual(transcription.text, req.body, "format");
    transcription.processingLanguage = common.jsonFieldEqual(transcription.text, req.body, "processingLanguage");
    transcription.textDirection = common.jsonFieldEqual(transcription.text, req.body, "textDirection");

    jsonFieldPush(req.body, "language");
    jsonFieldPush(req.body, "metadata");
    jsonFieldPush(req.body, "type");

    var the_parent = common.jsonFieldEqual(transcription.parent, req.body, "parent");
    var the_translation = common.jsonFieldEqual(transcription.translation, req.body, "translation");
    var the_vector = common.jsonFieldEqual(transcription.vector, req.body, "vector");   

    transcription.parent = common.db_model_checks(the_parent);
    transcription.translation = common.db_model_checks(the_translation);
    transcription.vector = common.db_model_checks(the_vector);

    var the_creator = common.jsonFieldEqual(transcription.creator, req.body, "creator");
    transcription.creator = common.db_model_checks(the_creator);

    ///need to build and pass on
    var anno_body = {};
    var anno_targets = [];

    transcription.save(function(err) {
        if (err) {    res.send(err);    }
        else {   
            res.json({ "url": transURL }); 

        };
    });

};

exports.getByID = function(req, res) {
    common.transcription_model.findById(req.params.transcription_id, function(err, transcription) {
        if (err) {res.send(err) }
        else { res.json(transcription) };  
    });
};

exports.updateOne = function(req, res, next) {

    var updateDoc = common.transcription_model.findById(req.params.transcription_id);
    updateDoc.exec(function(err, transcription) {

        if (err) {res.send(err)};

        var jsonFieldPush = function(bodyDoc, theField) {
            if (!common.isUseless(bodyDoc[theField])) {
                bodyDoc[theField].forEach(function(subdoc){
                    transcription[theField].addToSet(subdoc);
                });
            };
        };

        transcription.text = common.jsonFieldEqual(transcription.text, req.body, "text");
        transcription.text = common.jsonFieldEqual(transcription.text, req.body, "format");
        transcription.text = common.jsonFieldEqual(transcription.text, req.body, "processingLanguage");
        transcription.text = common.jsonFieldEqual(transcription.text, req.body, "textDirection");

        jsonFieldPush(req.body, "language");
        jsonFieldPush(req.body, "metadata");
        jsonFieldPush(req.body, "type");       

        var the_parent = common.jsonFieldEqual(transcription.parent, req.body, "parent");
        var the_translation = common.jsonFieldEqual(transcription.translation, req.body, "translation");
        var the_vector = common.jsonFieldEqual(transcription.vector, req.body, "vector");   

        transcription.parent = common.db_model_checks(the_parent);
        transcription.translation = common.db_model_checks(the_translation);
        transcription.vector = common.db_model_checks(the_vector);

        if (!common.isUseless(req.body.voting)) {
            transcription.voting.up = common.jsonFieldEqual(transcription.voting.up, req.body.voting, "up");
            transcription.voting.down = common.jsonFieldEqual(transcription.voting.down, req.body.voting, "down");
        };        

        transcription.save(function(err) {
            if (err) {res.send(err)}
            else {res.json(transcription)};
        });

    });
};


exports.deleteOne = function(req, res) {
    common.transcription_model.remove({
        _id: req.params.transcription_id
    }, 
    function(err, transcription) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
};

exports.searchByIds = function(req, res) {
    var theArray = req.params._ids.split(",");
    var otherSearch = common.transcription_model
    .where('id').in( theArray )
    .populate('parent')
    .populate('vector')
    .populate('translation');

    otherSearch.exec(function(err, texts){

        if (err) {
            console.log(err);
            res.json({list: false});
        }
        else {
            res.json({list: texts});
        };
    });
};

exports.searchByParent = function(req,res) {
    var the_parent = req.params.parent_id;

    var theSearch = common.transcription_model
    .find()
    .populate('parent')
    .where('parent.id').equals(the_parent)
    .populate('vector')
    .populate('translation');

    theSearch.exec(function(err, annos) {
        if (err) {  res.json({list: false })    }
        else {
            var docs = [];
            texts.forEach(function(doc){
                docs.push(doc);
            });
            res.json({list: docs});
        };
    });
};

exports.searchByFragmentID = function(req,res) {
    var the_id = req.params.frag_id;

    var theSearch = common.transcription_model
    .$where(function() {
        return this.text.includes(the_id);
    })
    .populate('parent')
    .populate('vector')
    .populate('translation');

    theSearch.exec(function(err, annos) {
        if (err) {  res.json({list: false })    }
        else {
            var docs = [];
            texts.forEach(function(doc){
                docs.push(doc);
            });
            res.json({list: docs});
        };
    });
};

