// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

//ROUTE FUNCTIONS

exports.findAll = function(req, res) {
      
    setup.vector_model.find(function(err, vectors) {
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
    vector.parent = setup.jsonFieldEqual(vector.parent, req.body, "parent");
    vector.translation = setup.jsonFieldEqual(vector.translation, req.body, "translation");
    vector.transcription = setup.jsonFieldEqual(vector.transcription, req.body, "transcription");

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
    setup.vector_model.findById(req.params.vector_id).lean().exec( function(err, vector) {
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

        if (typeof newInfo.target != 'undefined' || newInfo.target != null) {

            vector.target.push({
                "id": req.body.target.id,
                "language": req.body.target.language,
                "format": req.body.target.format
            });

        };
        if (typeof newInfo.transcription != 'undefined' || newInfo.transcription != null) {
            vector.transcription = req.body.transcription;
        };

        if (typeof newInfo.transcription != 'undefined' || newInfo.transcription != null) {
            vector.translation = req.body.translation;
        };

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

                //the image fragment is always pushed in after the json target
                var imageID = vector.target[0].id;
                var imageFormats = vector.target[1].format;
                var newIIIFsection = getIIIFsectionURL(imageID, theCoordinates, imageFormats);

                vector.target[1].id = newIIIFsection;
            };
        };

        if (typeof req.body.metadata != 'undefined' || req.body.metadata != null) {
            vector.metadata.push(req.body.metadata);
        };

        if (typeof req.body.children != 'undefined' || req.body.children != null) {
            vector.children.push(req.body.children);
        };

        if (typeof req.body.creator != 'undefined' || req.body.creator != null) {
            vector.creator = req.body.creator;
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

    //console.log("searching for vectors with ids "+JSON.stringify(theArray));

    var otherSearch = setup.vector_model
    .where('id').in( theArray );
    //.find( { 'id' : { $in : theArray } } );

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
            //console.log(JSON.stringify(ids));
            res.json({list: ids});
        };
    });
};
