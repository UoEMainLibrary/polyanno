
///// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

////INTERNAL FUNCTIONS

var makeArray = function(anArray) {
    if (Array.isArray(anArray) == false) {
        return [anArray];
    }
    else { return anArray };
};

// ROUTE FUNCTIONS

exports.deleteAll = function(req, res) {
      
    setup.anno_model.find(function(err, annos) {
        if (err) {res.send(err)};

        annos.forEach(function(anno){
            anno.remove({_id: anno._id},
            function(err){
                if (err) {res.send(err)};
            })
        });

        res.send("all gone");
    }); 
};

exports.deleteOne = function(req, res) {
        setup.anno_model.remove({
            _id: req.params.anno_id
        }, 
        function(err, anno) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
};

exports.addNew = function(req, res) {
    
    var annotation = new setup.anno_model(); 
    var newID = annotation._id;
    var theURL = setup.annotationURL.concat(newID);
    annotation.id = theURL;

    var jsonFieldPush = function(bodyDoc, theField) {
        if ( !setup.isUseless(bodyDoc[theField]) ) {
            bodyDoc[theField].forEach(function(subdoc){    annotation[theField].addToSet(subdoc);    });
        };
    };

    annotation.body.id = req.body.body.id; 

    jsonFieldPush(req.body, "target");  

    annotation.save(function(err) {
        if (err) {    res.send(err);    }
        else {    res.json({"url": theURL});    };
    });

};

exports.updateOne = function(req, res) {

    console.log("to be updated "+JSON.stringify(req.body));

    var updateDoc = newUser.findOne({'body.id': req.body.target_id});
    updateDoc.exec(function(err, anno) {

        var jsonFieldPush = function(bodyDoc, theField) {
            if (!setup.isUseless(bodyDoc[theField])) {
                bodyDoc[theField].forEach(function(subdoc){
                    anno[theField].addToSet(subdoc);
                });
            };
        };

        if (err) {res.send(err)};

        jsonFieldPush(req.body, "target"); 

        anno.save(function(err) {
            if (err) {res.send(err)}
            else next();
        });

    });
};


exports.getAll = function(req, res) {
    setup.anno_model.find(function(err, annotations) {
        if (err) {res.send(err)}
        else { res.json(annotations); };
    });
};

exports.getAllVectorAnnos = function(req, res) {
    setup.anno_model.find({ 'body.id' : '/.*vector.*/' }, function(err, vectorAnnos) {
        if (err) {res.send(err)}
        else { res.json(vectorAnnos); };
    });
};

exports.getAllTranscriptionAnnos = function(req, res) {
    setup.anno_model.find({ 'body.id' : '/.*transcription.*/' }, function(err, transcriptionAnnos) {
        if (err) {res.send(err)}
        else { res.json(transcriptionAnnos); };
    });
};

exports.getAllTranslationAnnos = function(req, res) {
    setup.anno_model.find({ 'body.id' : '/.*translation.*/' }, function(err, translationAnnos) {
        if (err) {res.send(err)}
        else { res.json(translationAnnos); };
    });
};

exports.getByID = function(req, res) {
    setup.anno_model.findById(req.params.anno_id, function(err, anno) {
        if (err) {res.send(err) }
        else { res.json(anno) };  
    });
};

exports.getByBody = function(req, res) {

    var bodyID = req.params.body_id;
    var theSearch = setup.anno_model.findOne({'body.id': bodyID});

    theSearch.exec(function(err, text){

        if (err) {
            console.log(err);
            res.json({error: false});
        }
        else {
            res.json(text); 
        };
    });
};

exports.getByTarget = function(req, res) {

    var targetID = req.params.target_id;
    var theSearch = setup.anno_model.find({'target.id': targetID});

    theSearch.exec(function(err, texts){

        if (err) {
            console.log(err);
            res.json({list: false});
        }
        else {
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({"list": ids}); 
        };
    });
};

exports.getVectorsByTarget = function(req, res) {

    var targetID = req.params.target;
    //console.log(targetID);
    /////change search
    var theSearch = setup.anno_model
    .where('target.id', targetID);
    //.where('body.id', '/.*vectors.*/' );

    theSearch.exec(function(err, texts){

        if (err) {
            console.log("in getVectorsByTarget - "+err);
            res.json({"list": false});
        }
        else {
        	//var ids = the_texts.map(function(el) { return el._id } );
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({"list": ids}); 
        };
    });
};

exports.getTranscriptionsByTarget = function(req, res) {

    var targetID = req.params.target;
    var theSearch = setup.anno_model
    .where('target.id', targetID);
    //.where('body.id', '/.*transcription.*/' );

    theSearch.exec(function(err, texts){
        if (err) {    res.json({"list": false});    }
        else {	
            //var ids = the_texts.map(function(el) { return el._id } );
            console.log(texts);
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({"list": ids});   
        };
    });
};

exports.getTranslationsByTarget = function(req, res) {

    var targetID = req.params.target;
    var theSearch = setup.anno_model
    .where('target.id', targetID)
    //.where('body.id', '/.*translation.*/' );

    theSearch.exec(function(err, texts){
        if (err) {    res.json({"list": false});    }
        else {	
            //var ids = the_texts.map(function(el) { return el._id } );
            console.log(texts);
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({"list": ids});    
        };
    });
};




