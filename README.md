# polyanno
Package to develop crowd sourced transcription and translations of images!

##Contents

 - [Introduction](#)
 -- [Basic Examples](#)
 -- [Get In Touch!](#)

 - [10 Really Easy Steps from Nothing to Your Own Polyanno Demo](#)

 - [The Longer Guide - Setup Options](#)
 -- [Dependencies](#)
 -- [Page Structure](#)
 -- [The Image](#)
 -- [Setup Function](#)

 - [The Longer Guide - The Polyanno Code](#)
 -- [Framework and Model Structures](#)
 -- [Contributions](#)

##Introduction

The Polyanno package is designed to allow anyone to develop a lightweight, modular web design for easy crowd sourcing of transcriptions and translations of digitised images, with support for input across a large variety of languages and formats.

###Basic Examples


####Get In Touch!


##10 Really Easy Steps from Nothing to Your Own Polyanno Demo

###1. Install NodeJS

###2. Install NPM

###3. Install MongoDB
Now you have NPM installed you easily install the software recommended for the basic storage of the 

```
 npm install mongodb
```

###4. Get Your MongoDB Database Working

```
./mongod --dbpath 
```

###5. Download Polyanno

You will need your own local copy of the Polyanno package and this is easily done using the Github repo right here!

```
 git clone ""
```

###7. 


###7. Get Polyanno Setup

You will need to make sure that your device has all the necessary software packages to work with Polyanno and this is easily done through the example folder by going inside it on your command line window, and simply typing "npm install".

```
 npm install
```

###8. Get Polyanno Running

```
npm start
```

###9. 


###10. Choose Your Options!
If you open up the **example.js** file then you will see a basic example of a Polyanno application. For more information about the different options available to setup Polyanno to your needs, see the [Setup Function](#) section of the longer guide, but if you want to you can just leave the options given in the example provided.

One thing you might want to do though is change the image displayed to your own one.

Polyanno uses the IIIF API framework so all you have to do is change the variable **imageViewing** to your own IIIF info.json URL.

```
 imageViewing = ""
```

Don't have a clue what IIIF is? 
See here for more information about it. It is the standard format for loading the large, high resolution images commonly used by museums, libraries, and other collections around the world.

If you don't have any IIIF images of your own then don't worry! You can go find your favourites from amongst the collections of others who are kind enough to share them online, for example ...

So there you go! Hope that has been helpful (and not too patronising for the more advanced technical users)! Happy annotating!


##The Longer Guide - Setup Options

###Dependencies

This package is dependent on:
 - JQuery
 - JQueryUI
 - Bootstrap
 - Leaflet
 - Leaflet Draw
 - Leaflet IIIF
 - Dragon Drop
 - All The Unicode

So these need to be included into your HTML document in the relevant places.

In the head:
```

<!-- Meta data -->

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

<!-- Stylesheets -->

	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">

    <link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
	<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/Leaflet/Leaflet.draw/master/dist/leaflet.draw.css" />

	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">

	<link rel="stylesheet" type="text/css" href="https://rawgit.com/BluePigeons/dragon_drop/master/dragondrop.css" />
	<link rel="stylesheet" type="text/css" href="https://rawgit.com/BluePigeons/alltheunicode/master/alltheunicode.css" />

	<link rel="stylesheet" type="text/css" href="polyanno.css" />


<!-- Javascript libraries -->

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	<script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script>
    <script src="javascripts/leaflet-iiif.js"></script>
	<script src="https://cdn.rawgit.com/Leaflet/Leaflet.draw/master/dist/leaflet.draw.js"></script>

```

At the bottom of the body:

```

	<script src="https://rawgit.com/BluePigeons/dragon_drop/master/dragondrop.js"></script>
	<script src="https://rawgit.com/BluePigeons/alltheunicode/master/alltheunicode.js"></script>

	<script src="polyanno.js"></script>
	<script src="example1.js"></script>

```

###Page Structure

For the components to lad into, you need to have certain HTML objects on the page:

```
	<div data-role="main" class="ui-content">
		<div id="main page" class="container polyanno-page-body">

			<div class="row" id="polyanno-top-bar">

				<!-- The minimising bar with keyboard buttons go here-->

			</div>

			<div class="row" id="polyanno-page-body">

				<!-- Image Viewer Panel -->

				<!-- Editor Boxes go here -->

			</div>

		</div>

	</div>
```

###The Image

Firstly you need to define the **imageSelected** variable. These needs to be the URL for the image in the IIIF info.json format.

For example:
```
imageSelected = "http://images.is.ed.ac.uk/luna/servlet/iiif/UoEwmm~2~2~77099~164515/info.json";
```

In the application for the University of Edinburgh Polyglot website, this definition is dynamic using the website URL to change it.

###Setup Function

To get started you need to run **polyanno_setup** function.
```
polyanno_setup(opts);
```

The function that takes one input, *opts*,  a JSON object of the following format :
```
{
  "highlighting": Boolean,
  "minimising": Boolean,
  "users": Object,
  "storage": Object
}
```

###highlighting

Type: Boolean
Default: False

If false then this disables the highlighting functionality that enables any annotation targets present on the page to be 'highlighted' whenever a cursor hovers over an annotation.

The default, non-highlighted colours of objects can be defined by setting the variable **polyanno_default_colours_array** before running the setup. This is an array of three HTML colours in the format [editor_box, vector, span]. The default values are:
```
//[editor_box, vector, span]
polyanno_default_colours_array = ["buttonface","#03f","transparent"]; 
```

The highlighted colours that the objects change to are similarly defined by **polyanno_highlight_colours_array** with the defaults as follows:
```
//[editor_box, vector, span]
polyanno_highlight_colours_array = ["#EC0028","#EC0028","#EC0028"];
```

###minimising

Type: Boolean
Default: True

If false then the editor boxes displaying the annotations and the image cannot be minimised, only opened and closed.

###users (Optional)

Type: JSON object
Default: no users implemented and therefore the **favourite** functionality of Polyanno is disabled.

The **users** field of the setup options takes the following format:

```
{
  "favourites": Boolean,
  "users_url": String
}
```

This assumes that if you GET the **users_url** URL with "/username/" and a specific username, or "/id/" and specific id number, then it will recieve the user info in a JSON format. 
So for example, if **users_url** is "www.example.com/users" then Polyanno can send a GET request to "www.example.com/users/username/user_one" to recieve user_one's info as JSON.

Similarly if you PUT the **users_url** URL with the specific username added to the end and the fields to be updated as body parameters then it can be updated. 
So for example, if *users_url** is also "www.example.com/users" then Polyanno can send a PUT request to "www.example.com/users/user_one" to update user_one's info.

It also requires that the user info has at least the following fields in the following format:
```
{

  "username": String,

  "docs_edited": {
    "vectors" : {
      "created" : [],
      "edited" : [],
      "deleted" : []
    },
    "transcriptions" : {
      "created" : [],
      "edited" : [],
      "deleted" : []
    },
    "translations" : {
      "created" : [],
      "edited" : [],
      "deleted" : []
    }
  },

  "favourites" : [{
    "image_id" : String,
    "the_image" : {
      "type": Boolean,
      "default": false
    },
    "transcriptions" : [],
    "translations" : [],
    "vectors" : []
  }]
}
```

###storage

Type: JSON object
Default: the **base_url** is set to the current host address of the web page running.

The **storage field** takes format:
```
{
  "base_url": String,
  "transcription": String,
  "translation": String,
  "vector": String,
  "annotation": String
}
```

If nothing is specified other than base_url then it simply assumes base_url + "/transcriptions", "/translations", "/vectors", and "/annotations".

##Polyanno + Polyanno Storage

The storage assumes you are using [polyanno_storage](https://github.com/BluePigeons/polyanno_storage) and so the request mapping to function is assumed to be:

![Table](https://pigeonsblue.files.wordpress.com/2017/01/polyannourltable.gif?w=648)

If it is easier to use, then you can just copy the following code into your server.js (or equivalent) file:

```

	var annoRouter = express.Router();
	var editorRouter = express.Router();

	/////////////////USER ROUTES

	userRouter.get('/username/:username', polyanno.users.getByUsername);
	userRouter.get('/id/:user_id', polyanno.users.getByID);
	userRouter.post('/', polyanno.users.addNew);
	userRouter.put('/:username', polyanno.users.updateOne);

	/////////////////API ROUTES

	//ANNOTATIONS API

	annoRouter.post('/annotations', polyanno.annotations.addNew );
	annoRouter.put( polyanno.annotations.updateOne ); ///
	annoRouter.get('/annotations', polyanno.annotations.getAll);
	annoRouter.get('/annotations/vectors', polyanno.annotations.getAllVectorAnnos);
	annoRouter.get('/annotations/transcriptions', polyanno.annotations.getAllTranscriptionAnnos);
	annoRouter.get('/annotations/translations', polyanno.annotations.getAllTranslationAnnos);
	annoRouter.get('/annotations/:anno_id', polyanno.annotations.getByID);
	annoRouter.get('/annotations/target/:target_id', polyanno.annotations.getByTarget);
	annoRouter.get('/annotations/body/:body_id', polyanno.annotations.getByBody);
	annoRouter.delete('/annotations', polyanno.annotations.deleteAll);
	annoRouter.delete('/annotations/:anno_id', polyanno.annotations.deleteOne);

	//VECTOR API

	annoRouter.get('/vectors', polyanno.vectors.findAll);
	annoRouter.post('/vectors', polyanno.vectors.addNew);
	annoRouter.delete('/vectors', polyanno.vectors.deleteAll);

	annoRouter.get('/vectors/:vector_id', polyanno.vectors.getByID);
	annoRouter.put('/vectors/:vector_id', polyanno.vectors.updateOne);
	annoRouter.delete('/vectors/:vector_id', polyanno.vectors.deleteOne);

	annoRouter.get('/vectors/targets/:target', polyanno.annotations.getVectorsByTarget);
	annoRouter.get('/vectors/ids/:_ids/target/:target_id', polyanno.vectors.searchByIds);

	//TRANSCRIPTION API

	annoRouter.get('/transcriptions', polyanno.transcriptions.findAll);
	annoRouter.post('/transcriptions', polyanno.transcriptions.addNew);
	annoRouter.get('/transcriptions/:transcription_id', polyanno.transcriptions.getByID);
	annoRouter.put('/transcriptions/:transcription_id', polyanno.transcriptions.updateOne);
	annoRouter.put('/transcriptions/voting/:voteType', polyanno.transcriptions.voting);
	annoRouter.delete('/transcriptions/:transcription_id', polyanno.transcriptions.deleteOne);
	annoRouter.delete('/transcriptions', polyanno.transcriptions.deleteAll);

	annoRouter.get('/transcriptions/targets/:target', polyanno.annotations.getTranscriptionsByTarget);
	annoRouter.get('/transcriptions/ids/:_ids/target/:target_id', polyanno.transcriptions.searchByIds);

	//TRANSLATION API

	annoRouter.get('/translations', polyanno.translations.findAll);
	annoRouter.post('/translations', polyanno.translations.addNew);
	annoRouter.get('/translations/:transcription_id', polyanno.translations.getByID);
	annoRouter.put('/translations/:transcription_id', polyanno.translations.updateOne);
	annoRouter.put('/translations/voting/:voteType', polyanno.translations.voting);
	annoRouter.delete('/translations/:transcription_id', polyanno.translations.deleteOne);
	annoRouter.delete('/translations', polyanno.translations.deleteAll);

	annoRouter.get('/translations/targets/:target', polyanno.annotations.getTranslationsByTarget);
	annoRouter.get('/translations/ids/:_ids/target/:target_id', polyanno.translations.searchByIds);

	/////////GET STARTED

	app.use('/api', annoRouter);
	app.use('/user', userRouter);

```

I am currently investigating the use of Docker or similar for simply downloading a whole basic framework to edit. Similarly, looking into building in compatibility with existing annotation storage solutions such as MangoServer and Simple Annotation Server.


