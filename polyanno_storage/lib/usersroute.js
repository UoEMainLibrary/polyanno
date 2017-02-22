
// SETUP

var express    = require('express');
var bodyParser = require('body-parser');
var setup = require('./routes_setup');

////EXPORTED FUNCTIONS

///is this appropriate??
exports.findAll = function(req, res) {
    setup.user_model.find(function(err, allusers) {
        if (err) {res.send(err)}
        else { res.json(allusers); };
    });
};

///just for dev purposes, probably don't want to deploy with unless caching
exports.deleteAll = function(req, res) {
      
    setup.user_modelfind(function(err, allusers) {
        if (err) {res.send(err)};

        allusers.forEach(function(theuser){
            theuser.remove({_id: theuser._id},
            function(err){
                if (err) {res.send(err)};
            });
        });
        if (allusers.length == 0) {
            res.send("all gone");
        };
    }); 
};

exports.addNew = function(req, res) {
    
    var theuser = new setup.user_model(); 

    theuser.username = req.body.username;

    theuser.save(function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(theuser);
        }
    });

};

exports.getByID = function(req, res) {
    setup.user_model.findById(req.params.user_id, function(err, theuser) {
        if (err) {res.send(err) }
        else { res.json(theuser) };  
    });
};

exports.getByUsername = function(req, res) {
    setup.user_model.findOne({ "username" : req.params.username }, function(err, theuser) { /////
        if (err) {res.send(err) }
        else { res.json(theuser) };  
    });
};


////unlike annos, the users are expecting to be updated one piece of info at a time - no arrays
exports.updateOne = function(req, res) {

    var updateDoc = setup.user_model.findOne({ "username" : req.params.username }); ///////
    updateDoc.exec(function(err, theuser) {

        if (err) {res.send(err)};

        var updateDocs = function(annoType, editType) {
        	if ( !setup.isUseless(req.body.docs_edited[annoType][editType]) ) { 
        		theuser.docs_edited[annoType][editType].addToSet(req.body.docs_edited[annoType][editType]);
        	};
        };

        var updateAllEdits = function(annoType) {
        	if (!setup.isUseless(req.body.docs_edited[annoType])) {
	        	updateDocs(annoType, "created");
	        	updateDocs(annoType, "edited");
	        	updateDocs(annoType, "deleted");
        	};
        };

        if (!setup.isUseless(req.body.docs_edited)) {
        	updateAllEdits("vectors");
        	updateAllEdits("transcriptions");
        	updateAllEdits("translations");
        };

        var updateFavourite = function(theFavourite) {
        	if (!setup.isUseless(req.body.favourites.the_image)) { theFavourite.the_image = req.body.favourites.the_image };
        	if (!setup.isUseless(req.body.favourites.translations)) { theFavourite.translations = [req.body.favourites.translations] };
        	if (!setup.isUseless(req.body.favourites.transcriptions)) { theFavourite.transcriptions = [req.body.favourites.transcriptions] };
        	return theFavourite;
        };

        var createNewFavourite = function() {
        	var theNew = { "image_id" : req.body.favourites.image_id };
        	var newFavourite = updateFavourite(theNew);
        	theuser.favourites.addToSet(newFavourite);
        };

        if (!setup.isUseless(req.body.favourites)) {
        	var existingFav = false;
        	theuser.favourites.forEach(function(userFavourite) {
        		if (userFavourite.image_id == req.body.favourites.image_id) {
        			userFavourite = updateFavourite(userFavourite);
        			existingFav = true;
        		};
        	});
        	if (existingFav == false) {	createNewFavourite(); };
        };

        if (!setup.isUseless(req.body.removefavourite)) {
        	var thefavourite;
        	theuser.favourites.forEach(function(userFavourite) {
        		if (theuser.favourites.image_id == req.body.removefavourite.image_id) {	thefavourite = userFavourite;	};
        	});
        	if (!setup.isUseless(req.body.removefavourite.the_image)) { thefavourite.the_image = false; };
        	if (!setup.isUseless(req.body.removefavourite.transcriptions)) { thefavourite.transcriptions.pull(req.body.removefavourite.transcriptions); };
        	if (!setup.isUseless(req.body.removefavourite.translations)) { thefavourite.translations.pull(req.body.removefavourite.translations); };
        };

        theuser.save(function(err) {
            if (err) {res.send(err)}
            else {res.json(theuser)};
        });

    });
};

/////necessary?
exports.deleteOne = function(req, res) {
    setup.user_model.remove({
        _id: req.body.user_id
    }, 
    function(err, theuser) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
};



