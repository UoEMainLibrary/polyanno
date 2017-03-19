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

Each of the functions can be accessed individually if wanted, but the whole Express router (except the users routes for now) can be imported using **polyanno.router** allowing you to simply include the following in your server.js (or equivalent) file:

```
	var polyanno = require('polyanno_storage');
	app.use('/api', polyanno.router);

```


