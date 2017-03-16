// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

//ROUTE FUNCTIONS

exports.findAll = function(req, res) {
    setup.translation_model.find(function(err, translations) {
        if (err) {res.send(err)}
        else { res.json(translations); };
    });
};

exports.deleteAll = function(req, res) {
      
    setup.translation_model.find(function(err, translations) {
        if (err) {res.send(err)};

        translations.forEach(function(translation){
            translation.remove({_id: translation._id},
            function(err){
                if (err) {res.send(err)};
            });
        });
        if (translations.length == 0) {
            res.send("all gone");
        };
    }); 
};


/////////merge as part of idmatching???
var theIDCheck = function(theArray, doc) {
    if ( typeof setup.fieldMatching(theArray, "id", doc.id) != ('undefined' || null)) {
        return setup.fieldMatching(theArray, "id", doc.id); 
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
        if (setup.isUseless(theIDCheck(arrayB, doc) )) { i += 1; }
        else {
            i += 1;
            returnArray.push([doc, theIDCheck(arrayB, doc)]); ////push a pair of matching docs
        };
    });

    if ( (i == arrayA.length) && ( setup.isUseless(returnArray[0]) ) ) {    return null;    }
    else if ( (i == arrayA.length) && (setup.isUseless(returnArray[0]) == false ) ) {    return returnArray;    };
};

exports.addNew = function(req, res) {
    
    var translation = new setup.translation_model(); 

    var jsonFieldPush = function(bodyDoc, theField) {
        if ( !setup.isUseless(bodyDoc[theField]) ) {
            bodyDoc[theField].forEach(function(subdoc){    translation[theField].addToSet(subdoc);    });
        };
    };
    var transURL = setup.translationURL.concat(translation._id);
    translation.id = transURL; 
    translation.text = setup.jsonFieldEqual(translation.text, req.body, "text");
    translation.language = setup.jsonFieldEqual(translation.language, req.body, "language");    
    translation.parent = setup.jsonFieldEqual(translation.parent, req.body, "parent");
    translation.transcription = setup.jsonFieldEqual(translation.transcription, req.body, "transcription");
    translation.vector = setup.jsonFieldEqual(translation.vector, req.body, "vector");

    translation.creator = setup.jsonFieldEqual(translation.creator, req.body, "creator");

    jsonFieldPush(req.body, "metadata");

    translation.save(function(err) {
        if (err) {    res.send(err);    }
        else {    res.json({ "url": transURL });    };
    });

};

exports.getByID = function(req, res) {
    setup.translation_model.findById(req.params.translation_id, function(err, translation) {
        if (err) {res.send(err) }
        else { res.json(translation) };  
    });
};

exports.updateOne = function(req, res) {

    var updateDoc = setup.translation_model.findById(req.params.translation_id);
    updateDoc.exec(function(err, translation) {

        if (err) {res.send(err)};

        var jsonFieldPush = function(bodyDoc, theField) {
            if (!setup.isUseless(bodyDoc[theField])) {
                bodyDoc[theField].forEach(function(subdoc){
                    translation[theField].addToSet(subdoc);
                });
            };
        };

        translation.text = setup.jsonFieldEqual(translation.text, req.body, "text");
        translation.language = setup.jsonFieldEqual(translation.language, req.body, "language");
        translation.parent = setup.jsonFieldEqual(translation.parent, req.body, "parent");
        translation.transcription = setup.jsonFieldEqual(translation.transcription, req.body, "transcription");
        translation.vector = setup.jsonFieldEqual(translation.vector, req.body, "vector");
        if (!setup.isUseless(req.body.voting)) {
            translation.voting.up = setup.jsonFieldEqual(translation.voting.up, req.body.voting, "up");
            translation.voting.down = setup.jsonFieldEqual(translation.voting.down, req.body.voting, "down");
        };        
        jsonFieldPush(req.body, "metadata");

        translation.save(function(err) {
            if (err) {res.send(err)}
            else {res.json(translation)};
        });

    });
};


exports.deleteOne = function(req, res) {
    setup.translation_model.remove({
        _id: req.params.translation_id
    }, 
    function(err, translation) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
};

exports.searchByIds = function(req, res) {
    var theArray = req.params._ids.split(",");
    var otherSearch = setup.translation_model
    .where('id').in( theArray );

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

    var theSearch = setup.translation_model
    .where('parent').equals(the_parent);

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
