
# Contents

Generic Polyanno Objects

  image
  urls
  colours
  HTML
  map
  intEffects



# Introduction


# Generic Polyanno Objects

These are objects that are unlikely to be used directly when working with the original intended use cases of Polyanno, however they may be used by those wishing to adapt the package for more experimental applications. They define the shared features of the other Polyanno objects that inherit from them.


## Polyanno.image
 
It MUST be defined as using the IIIF image API as outlined here --> .....

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 



### Methods

None.

### Events

None.



## Polyanno.urls

These are the important urls used if using any of the in-built AJAX REST API support to connect a Polyanno application to a REST back end, with defaults defined to support basic default usage of the Polyanno Storage Node package.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
**vector** | `String` | window.location.host + "/api/vectors/" | 
**transcription** | `String` | window.location.host + "/api/transcriptions/" | 
**translation** | `String` | window.location.host + "/api/translations/" | 
**annotation** | `String` | window.location.host + "/api/annotations/" | 


### Methods

None.

### Events

None.



## Polyanno.map

The object defining the map used in the Polyanno implementation, to pass through to the Leaflet and associated plugins like Leaflet-IIIF.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 


### Methods

None.

### Events

None.


## Polyanno.colours

Because there are various situations where the colours change throughout use of the package, rather than leaving users to manually override the defaults in each situation, the colours used are defined in one object, Polyanno.colours, which can be redefined for more effective adaption.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 


Property | Type | Default | Description
--- | --- | --- | --- 


Property | Type | Default | Description
--- | --- | --- | --- 

  highlight: {
    editor: "#EC0028",
    vector: "#EC0028",
    span: "#EC0028"
  },
  default: {
    editor: "buttonface",
    vector: "#03f",
    span: "transparent"
  },
  processing: {
    editor: "yellow",
    vector: "yellow",
    span: "yellow"
  }

### Methods

Method | Returns | Description
--- | --- | --- 

.connectColours


.highlightThis.vector

.highlightThis.editor

.highlightThis.span



### Events

None.


## Polyanno.HTML

These are the objects containing the variables that contain the HTML (as strings) used to dynamically generate the DOM.

### Properties

  symbols: {},
  popups: {},
  connectingEquals: {},
  buildingParents: {}

Property | Type | Default | Description
--- | --- | --- | --- 



### Methods

None.

### Events

None.


## Polyanno.intEffects

The properties of this object are used to define the JS and CSS effects used to animate the DOM during default Polyanno behaviour.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 

.buildingParents = {
  transcription: null,
  translation: null,
  vector: {
    mouseover: {},
    mouseout: {}
  }
};


### Methods

Method | Returns | Description
--- | --- | --- 

.buildingParents.span_mouseover



### Events

None.




## Polyanno.collections

This defines the behaviour of groups of Polyanno objects to ensure consistency and checks, especially if importing objects from an external source rather than those generated within the package.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
.type

.array



### Methods

Method | Returns | Description
--- | --- | --- 
.on

.trigger

.unbind


.add


.replaceOne

.getById


.deleteAll

.getAll


### Events






# Annotations

These objects are the annotations as outlined and defined by the W3C definition for the Web Annotation Model.

For more information, please see the Web Annotation Model... http://www.w3.org/TR/annotation-model/

## Polyanno.annotation

...

### Properties 

Property | Type | Default | Description
--- | --- | --- | --- 

Property | Type | Default | Description
--- | --- | --- | --- 


...    if (prop == "format") {
      this.format = value.format;
    };
    if ((prop == "language") && (typeof value.language == Array)) {
      this.language = value.language;
    };
    if (prop == "processingLanguage") {
      this.processingLanguage = value.processingLanguage;
    };
    if ((prop == "type") && (typeof value.type == Array)) {
      this.type = value.type;
    };
    if ((prop == "textDirection") && ["auto", "ltr", "rtl"].includes(value.textDirection)) {
      this.textDirection = value.textDirection;

.id


._id


.body


.target


.creator





### Methods (Singular)

Method | Returns | Description
--- | --- | --- 
.update

.delete

.getBody


.getTargets

.addTargets




### Events (Singular)



## Polyanno.annotations

### Properties 

* Methods inherited from Polyanno.collections with the **type** property set to **Polyanno.annotation**.

### Methods (Plural)

* Methods inherited from Polyanno.collections

Method | Returns | Description
--- | --- | --- 

Polyanno.getAnnotationsByTarget

Polyanno.getAnnotationByBody


### Events (Plural)

* Events inherited from Polyanno.collections


## Polyanno.baseAnnotationObject

This defines the shared characteristics of objects 


### Properties

Property | Type | Default | Description
--- | --- | --- | --- 

.@context.

 [ "http://www.w3.org/ns/anno.jsonld" ];

.type 


.metadata 


.format 

"auto", "ltr", "rtl"


.language 

.processingLanguage


.creator = 
{
    name: polyanno_current_username,
    motivation: "identifying"
  };


### Methods

Method | Returns | Description
--- | --- | --- 
.on

.trigger

.unbind



### Events




# Vectors

## Polyanno.vector

### Properties 

Property | Type | Default | Description
--- | --- | --- | --- 

### Methods (Singular)

Method | Returns | Description
--- | --- | --- 

### Events (Singular)


##Polyanno.vectors

### Methods (Plural)

* Methods inherited from Polyanno.collections

### Events (Plural)

* Events inherited from Polyanno.collections


# Images


# Editors



## Polyanno.editor



### Properties

Property | Type | Default | Description
--- | --- | --- | --- 

  this.DOM 
  this.id 
  this.docs = {
    vectors: Polyanno.selected.vectors.array,
    transcriptions: Polyanno.selected.transcriptions.array,
    translations: Polyanno.selected.translations.array
  };
  this.targets = Polyanno.selected.targets;
  this.type = textType;



### Methods (Singular)

Method | Returns | Description
--- | --- | --- 
.update

.closeEditor

.setSelected

.checkDocs



### Events (Singular)


## Polyanno.editors

### Methods (Plural)

Method | Returns | Description
--- | --- | --- 

* Methods inherited from Polyanno.collections

.removeEditor

.closeAll

.openEditor

.ifOpen

.findAllByDoc

.findOneByDoc



### Events (Plural)

* Methods inherited from Polyanno.collections



# Currently Selected

## Polyanno.selected




