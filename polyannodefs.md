
# Contents


* [Generic Polyanno Objects](#)

*  [image](## Polyanno.image)
*  [urls]()
*  [colours]()
*  [HTML]()
*  [map]()
*  [intEffects]()

* [Annotation Model Objects]()

*  [collections]()
*  [Annotations]()
*  [BaseAnnotationObject]()
*  [Vectors]()
*  [BaseTextObject]()
*  [Transcriptions]()
*  [Translations]()

* [UI Objects]()

*  [Editors]()
*  [Selected]()

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



## Polyanno.colours

Because there are various situations where the colours change throughout use of the package, rather than leaving users to manually override the defaults in each situation, the colours used are defined in one object, Polyanno.colours, which can be redefined for more effective adaption.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
**highlight** | `Object` | NA | 
**default** | `Object` | NA | 
**processing** | `Object` | NA | 

**Polyanno.colours.highlight Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "#EC0028" | HTML colour
**vector** | `String` | "#EC0028" | HTML colour
**span** | `String` | "#EC0028" | HTML colour

**Polyanno.colours.default Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "buttonface" | HTML colour
**vector** | `String` | "#03f" | HTML colour
**span** | `String` | "transparent" | HTML colour

**Polyanno.colours.processing Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "yellow" | HTML colour
**vector** | `String` | "yellow" | HTML colour
**span** | `String` | "yellow" | HTML colour


### Methods

Method | Returns | Description
--- | --- | --- 
**connectColours(** object, type, action **)** | `this` | 
**highlightThis.vector(** chosenVector, colourChange **)** | `this` | 
**highlightThis.editor(** chosenEditor, colourChange **)** | `this` | 
**highlightThis.span(** chosenSpan, colourChange **)** | `this` | 


### Events

None.


## Polyanno.HTML

These are the objects containing the variables that contain the HTML (as strings) used to dynamically generate the DOM.

### Properties

**Polyanno.HTML.symbols Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "" | HTML stored as String

**Polyanno.HTML.popups Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "" | HTML stored as String

**Polyanno.HTML.connectingEquals Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "" | HTML stored as String

**Polyanno.HTML.buildingParents Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "" | HTML stored as String


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


## Polyanno.intEffects

The properties of this object are used to define the JS and CSS effects used to animate the DOM during default Polyanno behaviour.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
**editor** | `String` | "" | HTML stored as String

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
**connectColours(** object, type, action **)** | `this` | 

.buildingParents.span_mouseover



### Events

None.




## Polyanno.collections

This defines the behaviour of groups of Polyanno objects to ensure consistency and checks, especially if importing objects from an external source rather than those generated within the package.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
**type** | `Object` | Generic Javascript Object | The type of object that is to be stored in this collection, so that it can be checked.
**array** | `Array` | [] | The array that the objects are stored in.

### Methods

Method | Returns | Description
--- | --- | --- 
**on(** event **)** | `this` | Use to add event listeners for the Polyanno object
**trigger(** event **)** | `this` | Use to trigger Polyanno events from this object
**unbind()** | `this` | Removes all event listeners for this object
**add(** anno **)** | `this` | 
**replaceOne(** anno **)** | `this` | 
**getById(** the_id **)** | `Object` | 
**deleteAll()** | `this` | 
**getAll(** object, type, action **)** | `Array` | Returns array property for this Polyanno.collection


### Events






# Annotations

These objects are the annotations as outlined and defined by the W3C definition for the Web Annotation Model.

For more information, please see the Web Annotation Model... http://www.w3.org/TR/annotation-model/

## Polyanno.annotation

...

### Properties 

**Basic Annotation Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**id** | `String` | Random Number String | The unique id property used to identify annotation.
**_id** | `String` | Random Number String | The unique id property used to identify annotation.
**body** | `Object` | null | The content of the the annotation, e.g. the transcription text. MUST be defined as an Annotation SubObject as defined below.
**target** | `Array` | null | The thing(s) that the annotation is annotating e.g. the image. Each object contained MUST be defined as an Annotation SubObject as defined below.
**creator** | `Object` |  | See the Creator Annotation Object Properties below for more information.

**Annotation Creator Object Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**name** | `String` |  | The unique id property used to identify annotation.
**motivation** | `String` | "identifying" | 

**Annotation SubObject Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**format** | `String` |  | 
**language** | `Array` |  | 
**processingLanguage** | `String` |  | 
**type** | `Array` |  | An array of the types, as defined by the Web Annotation Model framework here...
**textDirection** | `String` |  | MUST be one of : "auto", "ltr", "rtl".

### Methods (Singular)

Method | Returns | Description
--- | --- | --- 
**update(** options **)** | `this` | Updates the values of the Polyanno.annotation object.
**delete()** | `this` | Deletes the Polyanno.annotation object.
**getBody()** | `Object` | Returns the Polyanno object that the body property of this Polyanno.annotation is referring to.
**getTargets()** | `Array` | Returns array of the Polyanno objects that the target property of this Polyanno.annotation are referring to.
**addTargets(** targets **)** | `this` | Accepts an array of Polyanno objects and updates the target property of the annotation, automatically completing the Annotation SubObject.

### Events (Singular)

Event | Data | Description
--- | --- | --- 
polyanno_deleting |  |  
polyanno_deleted |  |  
polyanno_updating |  |  
polyanno_updated |  |  

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
**@context** | `Array` | [ "http://www.w3.org/ns/anno.jsonld" ] | Context property required for JSON-LD
**type** | `Array` |  | An array of the types, as defined by the Web Annotation Model framework here...
**metadata** | `Array` |  | 
**format** | `String` |  | 
**language** | `Array` |  | 
**processingLanguage** | `String` |  | 
**textDirection** | `String` |  | MUST be one of : "auto", "ltr", "rtl".
**creator** | `Object` |  | See the Creator Annotation Object Properties below for more information.

**Annotation Creator Object Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
**name** | `String` |  | The unique id property used to identify annotation.
**motivation** | `String` | "identifying" | 

### Methods

Method | Returns | Description
--- | --- | --- 
**on(** event **)** | `this` | Use to add event listeners for the Polyanno object
**trigger(** event **)** | `this` | Use to trigger Polyanno events from this object
**unbind()** | `this` | Removes all event listeners for this object
**isAnnotationBody()** | `Object` | 
**isAnnotationTarget(** type **)** | `Array` | 
**getAnnosTargetingThis(** type **)** | `Array` | 


### Events


## Polyanno.baseTextObject

This defines the shared characteristics of objects 


### Properties

* Properties inherited from Polyanno.baseAnnotationObject

Property | Type | Default | Description
--- | --- | --- | --- 
**@context** | `Array` | [ "http://www.w3.org/ns/anno.jsonld" ] | Context property required for JSON-LD
**type** | `Array` |  | An array of the types, as defined by the Web Annotation Model framework here...


 

### Methods

* Methods inherited from Polyanno.baseAnnotationObject

Method | Returns | Description
--- | --- | --- 
**on(** event **)** | `this` | Use to add event listeners for the Polyanno object



### Events

* Events inherited from Polyanno.baseAnnotationObject


# Vectors

## Polyanno.vector

### Properties 

* Properties inherited from Polyanno.baseAnnotationObject

Property | Type | Default | Description
--- | --- | --- | --- 

### Methods (Singular)

* Methods inherited from Polyanno.baseAnnotationObject

Method | Returns | Description
--- | --- | --- 

### Events (Singular)

* Events inherited from Polyanno.baseAnnotationObject




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




