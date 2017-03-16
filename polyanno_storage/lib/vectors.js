// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

//ROUTE FUNCTIONS

exports.findAll = function(req, res) {
      
    setup.vector_model
    .find()
    .populate('parent')
    .populate('children')
    .populate('transcription_fragment')
    .populate('translation_fragment')
    .populate('creator')
    .exec(function(err, vectors) {
        if (err) {res.send(err)};
        res.json(vectors);
    }); 
};

exports.deleteAll = function(req, res) {
      
    setup.vector_model.find(function(err, vectors) {
        if (err) {res.send(err)};

        vectors.forEach(function(vector){
            setup.vector_model.remove({_id: vector._id},
            function(err){
                if (err) {res.send(err)};
            })
        });

        res.send("all gone");
    }); 
};

exports.addNew = function(req, res) {
    
    var vector = new setup.vector_model(); 

    var jsonFieldPush = function(bodyDoc, theField) {
        if ( !setup.isUseless(bodyDoc[theField])) {
            bodyDoc[theField].forEach(function(subdoc){    vector[theField].addToSet(subdoc);    });
        };
    };

    ////Coordinates
    ATCarray = 0;
    req.body.geometry.coordinates[0].forEach(function(coordinatesPair){
        vector.notFeature.notGeometry.notCoordinates.push([]);
        var coordsNumbers = [];
        coordinatesPair.forEach(function(number){
            converted = Number(number);
            coordsNumbers.push(converted);
        });
        vector.notFeature.notGeometry.notCoordinates[ATCarray] = coordsNumbers;
        ATCarray += 1;      
    });

    var theCoordinates = vector.notFeature.notGeometry.notCoordinates;
    var vector_modelURL = setup.vectorURL.concat(vector._id);

    vector.id = vector_modelURL;
    jsonFieldPush(req.body, "metadata");
    jsonFieldPush(req.body, "children");
    vector.parent = setup.jsonFieldEqual(vector.parent, req.body, "parent");
    vector.translation_fragment = setup.jsonFieldEqual(vector.translation_fragment, req.body, "translation_fragment");
    vector.transcription_fragment = setup.jsonFieldEqual(vector.transcription_fragment, req.body, "transcription_fragment");
    vector.OCD = setup.jsonFieldEqual(vector.OCD, req.body, "OCD");
    vector.creator = setup.jsonFieldEqual(vector.creator, req.body, "creator");

    vector.save(function(err, vector) {
        if (err) {
            console.log(err);
            res.send(err)
        }
        else {
            res.json({ "url": vector_modelURL})
        };
    });

};

exports.getByID = function(req, res) {
    setup.vector_model
    .findById(req.params.vector_id)
    .populate('parent')
    .populate('children')
    .populate('transcription_fragment')
    .populate('translation_fragment')
    .populate('creator')
    .lean() ///will this work after populates??
    .exec( function(err, vector) {
        if (err) {
            res.send(err);     
        }
        else {
            res.json(vector);
        };
        
    });

};

exports.updateOne = function(req, res) {

    var newInfo = req.body;

    console.dir(newInfo);

    var updateDoc = setup.vector_model.findById(req.params.vector_id); 
    updateDoc.exec(function(err, vector) {
        if (err) {res.send(err)};

        jsonFieldPush(req.body, "metadata");
        jsonFieldPush(req.body, "children");
        vector.parent = setup.jsonFieldEqual(vector.parent, req.body, "parent");
        vector.translation_fragment = setup.jsonFieldEqual(vector.translation_fragment, req.body, "translation_fragment");
        vector.transcription_fragment = setup.jsonFieldEqual(vector.transcription_fragment, req.body, "transcription_fragment");
        vector.OCD = setup.jsonFieldEqual(vector.OCD, req.body, "OCD");
        vector.creator = setup.jsonFieldEqual(vector.creator, req.body, "creator");

        if (typeof newInfo.geometry != 'undefined' || newInfo.geometry != null) {
            if (typeof newInfo.geometry.coordinates != 'undefined' || newInfo.geometry.coordinates != null) {

                ATCarray = 0;
                newInfo.geometry.coordinates[0].forEach(function(coordinatesPair){
                    var coordsNumbers = [];
                    coordinatesPair.forEach(function(number){
                        converted = Number(number);
                        coordsNumbers.push(converted);
                    });
                    vector.notFeature.notGeometry.notCoordinates[ATCarray] = coordsNumbers;
                    ATCarray += 1;      
                });
                var theCoordinates = vector.notFeature.notGeometry.notCoordinates;

            };
        };
        
        vector.save(function(err, vector) {
            if (err) {res.send(err)};
            res.json(vector);
        })
    });
};

exports.deleteOne = function(req, res) {
        setup.vector_model.remove({
            _id: req.params.vector_id
        }, 
        function(err, vector) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
};

exports.searchByIds = function(req, res) {

    var theArray = req.params._ids.split(",");

    var otherSearch = setup.vector_model
    .find()
    .where('id').in( theArray )
    .populate('parent')
    .populate('children')
    .populate('transcription_fragment')
    .populate('translation_fragment')
    .populate('creator');

    otherSearch.exec(function(err, texts){

        if (err) {
            console.log("the vectors searchByIds error is "+err);
            res.json({list: false});
        }
        else {
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({list: ids});
        };
    });
};

exports.searchByParent = function(req,res) {
    var the_parent = req.params.parent_id;

    var theSearch = setup.vector_model
    .find()
    .populate('parent')
    .where('parent.id').equals(the_parent)
    .populate('children')
    .populate('transcription_fragment')
    .populate('translation_fragment')
    .populate('creator');

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

exports.searchByTranscription = function(req,res) {
    var the_frag = req.params.frag_id;

    var theSearch = setup.vector_model
    .find()
    .populate('transcription_fragment')
    .where('transcription_fragment.id').equals(the_frag)
    .populate('parent')
    .populate('children')
    .populate('translation_fragment')
    .populate('creator');

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

exports.searchByTranslation = function(req,res) {
    var the_frag = req.params.frag_id;

    var theSearch = setup.vector_model
    .find()
    .populate('translation_fragment')
    .where('translation_fragment.id').equals(the_frag)
    .populate('parent')
    .populate('children')
    .populate('transcription_fragment')
    .populate('creator');

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


