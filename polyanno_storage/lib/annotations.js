
///// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./setup');
var common = require('./common');

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
      
    common.anno_model.find(function(err, annos) {
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
        common.anno_model.remove({
            _id: req.params.anno_id
        }, 
        function(err, anno) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
};

exports.addNew = function(req, res) {
    
    var annotation = new common.anno_model(); 
    var newID = annotation._id;
    var theURL = setup.annotationURL.concat(newID);
    annotation.id = theURL;

    annotation.body.push(req.body.body);     

    if (!common.isUseless(req.body.target)) {
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

    var updateDoc = common.anno_model.findOne({'id': req.params.anno_id});
    updateDoc.exec(function(err, anno) {

        if (err) {res.send(err)};

        if (!common.isUseless(req.body.body)) {
            anno.body[0].format = common.jsonFieldEqual(anno.body[0].format, req.body.body, "format"); 
            anno.body[0].language = common.jsonFieldEqual(anno.body[0].language, req.body.body, "language"); 
            anno.body[0].processingLanguage = common.jsonFieldEqual(anno.body[0].processingLanguage, req.body.body, "processingLanguage"); 
            anno.body[0].type = common.jsonFieldEqual(anno.body[0].type, req.body.body, "type"); 
            anno.body[0].textDirection = common.jsonFieldEqual(anno.body[0].textDirection, req.body.body, "textDirection");       
        };
        if (!common.isUseless(req.body.target)) {
            for (var i=0; i < req.body.target.length; i++) {
                var this_target = req.body.target[i];
                var inArray = false;
                for (var i=0; i < anno.target.length; i++) {
                    if (anno.target[i].id == this_target.id) {
                        inArray = true;
                        anno.target[i].format = common.jsonFieldEqual(anno.target[i].format, this_target, "format"); 
                        anno.target[i].language = common.jsonFieldEqual(anno.target[i].language, this_target, "language"); 
                        anno.target[i].processingLanguage = common.jsonFieldEqual(anno.target[i].processingLanguage, this_target, "processingLanguage"); 
                        anno.target[i].type = common.jsonFieldEqual(anno.target[i].type, this_target, "type"); 
                        anno.target[i].textDirection = common.jsonFieldEqual(anno.target[i].textDirection, this_target, "textDirection");         
                    };
                };
                if (!inArray) {
                    anno.target.push(this_target);
                };
            };     
        };       
        anno.save(function(err) {
            if (err) {res.send(err)}
            else {
                res.json({"url": anno}); ///for now
            };
        }); 

    });
};

////FUNCTIONS THAT DO NOT RETURN THE SUBDOC

exports.getAll = function(req, res) {

    common.anno_model.find({}, function(err, annotations) {
        if (err) {
            console.log(err);
            res.send(err);
        };
        
        console.log("the annos found "+JSON.stringify(annotations));
        res.send(annotations); 

    });
};

exports.getAllVectorAnnos = function(req, res) {
    common.anno_model
    .where({ 'body.id' : '/.*vector.*/' })
    //.populate('creator.id', 'id')
    .exec( function(err, vectorAnnos) {
        if (err) {res.send(err)}
        else { res.json(vectorAnnos); };
    });
};

exports.getAllTranscriptionAnnos = function(req, res) {
    common.anno_model
    .where({ 'body.id' : '/.*transcription.*/' })
    .populate('creator.id', 'id')
    .exec( function(err, transcriptionAnnos) {
        if (err) {res.send(err)}
        else { res.json(transcriptionAnnos); };
    });
};

exports.getAllTranslationAnnos = function(req, res) {
    common.anno_model
    .where({ 'body.id' : '/.*translation.*/' })
    .populate('creator.id', 'id')
    .exec( function(err, translationAnnos) {
        if (err) {res.send(err)}
        else { res.json(translationAnnos); };
    });
};

///////FUNCTIONS INCLUDING LOOKUPS

exports.getByID = function(req, res) {
    var the_anno_search = common.anno_model
    .findById(req.params.anno_id)
    .populate('creator.id', 'id');

    if (!common.isUseless(req.body.withAnnos)) {
        var the_basics_search = common.basic_model
        .find();

        the_anno_search
        .aggregate([
            /*
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
           */
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
    var theSearch = common.anno_model
    .where('body.id', bodyID)
    .populate('creator.id', 'id');

    if (!common.isUseless(req.body.withAnnos)) {
        var the_basics_search = common.basic_model
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
    var theSearch = common.anno_model
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
    var theSearch = common.anno_model
    //.where({ 'body.id' : '/.*vector.*/' })
    .where('target.id', targetID);
    //.populate('creator.id', 'id');

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
    var theSearch = common.anno_model
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
    var theSearch = common.anno_model
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




