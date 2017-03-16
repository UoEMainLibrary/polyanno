
///// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

////INTERNAL FUNCTIONS

///Need to setup a lookup for bodies and targets so they can optionally include other data, or simply the JSON object actually sent if it does not actually exist locally

var makeArray = function(anArray) {
    if (Array.isArray(anArray) == false) {
        return [anArray];
    }
    else { return anArray };
};

//
/*
{
    "id": {},
    "format": {},
    "language": [{}],
    "processingLanguage": {},
    "textDirection": {},
    "type": {}
}
*/

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

    annotation.body.body = setup.jsonFieldEqual(annotation.body, req.body, "body");     

    if (!setup.isUseless(req.body.target)) {
        for (var i=0; i < req.body.target.length; i++) {
            var this_target = req.body.target[i];
            annotation.target.push(this_target);
        };     
    };       
    annotation.save(function(err) {
        if (err) {res.send(err)}
        else {
            res.json({"url": theURL})
        }
    }); 

};

exports.updateOne = function(req, res) {

    var updateDoc = setup.anno_model.findOne({'id': req.params.anno_id});
    updateDoc.exec(function(err, anno) {

        if (err) {res.send(err)};

        if (!setup.isUseless(req.body.body)) {
            annotation.body.body.id = setup.jsonFieldEqual(annotation.body.id, req.body.body, "id");  
            annotation.body.body.format = setup.jsonFieldEqual(annotation.body.format, req.body.body, "format"); 
            annotation.body.body.language = setup.jsonFieldEqual(annotation.body.language, req.body.body, "language"); 
            annotation.body.body.processingLanguage = setup.jsonFieldEqual(annotation.body.processingLanguage, req.body.body, "processingLanguage"); 
            annotation.body.body.type = setup.jsonFieldEqual(annotation.body.type, req.body.body, "type"); 
            annotation.body.body.textDirection = setup.jsonFieldEqual(annotation.body.textDirection, req.body.body, "textDirection");       
        };
        if (!setup.isUseless(req.body.target)) {
            for (var i=0; i < req.body.target.length; i++) {
                var this_target = req.body.target[i];
                ///
                anno.target.push(isAnno);
            };     
        };       
        anno.save(function(err) {
            if (err) {res.send(err)}
            else {
                next();
            }
        }); 

    });
};

////FUNCTIONS THAT DO NOT RETURN THE SUBDOC

exports.getAll = function(req, res) {
    setup.anno_model
    .find()
    .populate('creator.id', 'id')
    .exec(function(err, annotations) {
        if (err) {res.send(err)}
        else { 
            res.json(annotations); 
        };
    });
};

exports.getAllVectorAnnos = function(req, res) {
    setup.anno_model
    .where({ 'body.id' : '/.*vector.*/' })
    .populate('creator.id', 'id')
    .exec( function(err, vectorAnnos) {
        if (err) {res.send(err)}
        else { res.json(vectorAnnos); };
    });
};

exports.getAllTranscriptionAnnos = function(req, res) {
    setup.anno_model
    .where({ 'body.id' : '/.*transcription.*/' })
    .populate('creator.id', 'id')
    .exec( function(err, transcriptionAnnos) {
        if (err) {res.send(err)}
        else { res.json(transcriptionAnnos); };
    });
};

exports.getAllTranslationAnnos = function(req, res) {
    setup.anno_model
    .where({ 'body.id' : '/.*translation.*/' })
    .populate('creator.id', 'id')
    .exec( function(err, translationAnnos) {
        if (err) {res.send(err)}
        else { res.json(translationAnnos); };
    });
};

///////FUNCTIONS INCLUDING LOOKUPS

exports.getByID = function(req, res) {
    var the_anno_search = setup.anno_model
    .findById(req.params.anno_id)
    .populate('creator.id', 'id');

    if (!setup.isUseless(req.body.withAnnos)) {
        var the_basics_search = setup.basic_model
        .find();

        the_anno_search
        .aggregate([
           {
              $unwind: "$target"
           },
           {
              $lookup:
                 {
                    from: "the_basics_search",
                    localField: "target.id",
                    foreignField: "id",
                    as: "target_docs"
                }
           },
           {
              $lookup:
                 {
                    from: "the_basics_search",
                    localField: "body.id",
                    foreignField: "id",
                    as: "body_docs"
                }
           }           
        ])
        .exec( function(err, anno) {
            if (err) {res.send(err) }
            else {     
                console.log("get by id has found"+JSON.stringify(anno));
                res.json(anno)     
            };  
        });

    }
    else {
        the_anno_search
        .exec( function(err, anno) {
            if (err) {res.send(err) }
            else {     res.json(anno)     };  
        });
    };

};

exports.getByBody = function(req, res) {

    var bodyID = req.params.body_id;
    var theSearch = setup.anno_model
    .where('body.id', bodyID)
    .populate('creator.id', 'id');

    if (!setup.isUseless(req.body.withAnnos)) {
        var the_basics_search = setup.basic_model
        .find();

        theSearch
        .aggregate([
           {
              $unwind: "$target"
           },
           {
              $lookup:
                 {
                    from: "the_basics_search",
                    localField: "target.id",
                    foreignField: "id",
                    as: "target_docs"
                }
           },
           {
              $lookup:
                 {
                    from: "the_basics_search",
                    localField: "body.id",
                    foreignField: "id",
                    as: "body_docs"
                }
           }           
        ])
        .exec(function(err, text){

            if (err) {
                console.log(err);
                res.json({error: false});
            }
            else {
                res.json(text[0]); 
            };
        });

    }
    else {
        theSearch.exec(function(err, text){

            if (err) {
                console.log(err);
                res.json({error: false});
            }
            else {
                res.json(text[0]); 
            };
        });
    };

};

exports.getByTarget = function(req, res) {

    var targetID = req.params.target_id;
    var theSearch = setup.anno_model
    .where('target.id', targetID)
    .populate('creator.id', 'id');

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
    var theSearch = setup.anno_model
    .where({ 'body.id' : '/.*vector.*/' })
    .where('target.id', targetID)
    .populate('creator.id', 'id');

    theSearch.exec(function(err, texts){

        if (err) {
            console.log("in getVectorsByTarget - "+err);
            res.json({"list": false});
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

exports.getTranscriptionsByTarget = function(req, res) {

    var targetID = req.params.target;
    var theSearch = setup.anno_model
    .where('body.id', '/.*transcription.*/' )
    .where('target.id', targetID)
    .populate('creator.id', 'id');

    theSearch.exec(function(err, texts){
        if (err) {    res.json({"list": false});    }
        else {	
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
    .where('body.id', '/.*translation.*/' )
    .where('target.id', targetID)
    .populate('creator.id', 'id');

    theSearch.exec(function(err, texts){
        if (err) {    res.json({"list": false});    }
        else {	
            console.log(texts);
            var ids = [];
            texts.forEach(function(doc){
                ids.push(doc);
            });
            res.json({"list": ids});    
        };
    });
};




