
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
polyanno_deleting |  | Triggered before the object is deleted.
polyanno_deleted |  | Triggered after the object has been deleted.
polyanno_updating |  | Triggered before the object's properties have been updated.
polyanno_updated |  | Triggered after the object's properties have been updated.

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

This defines the shared characteristics of objects that are text based annotation bodies.

### Properties

* Properties inherited from Polyanno.baseAnnotationObject

Property | Type | Default | Description
--- | --- | --- | --- 
**text** | `String` |  | The textual body.
**vector** | `String` | undefined | The id property of a Polyanno.vector that identifies the same area of an image as the text.
**parent** | `String` | undefined | The id property of another object of the same type that contains this text.
**voting.up** | `Number` | 0 | The number of up votes given to this object.
**voting.up** | `Number` | 0 | The number of up votes given to this object.


### Methods

* Methods inherited from Polyanno.baseAnnotationObject

Method | Returns | Description
--- | --- | --- 


.....voting functions....

### Events

* Events inherited from Polyanno.baseAnnotationObject
.....voting events?....









# Transcriptions

## Polyanno.transcription

### Properties 

* Properties inherited from Polyanno.baseAnnotationObject
* Properties inherited from Polyanno.baseTextObject

Property | Type | Default | Description
--- | --- | --- | --- 
**translation** | `String` | undefined | The id property of the Polyanno object of "the" translation into English of this transcription.
**voting.rank** | `Number` | 0 | The number of up votes given to this object.

### Methods (Singular)

* Methods inherited from Polyanno.baseAnnotationObject
* Methods inherited from Polyanno.baseTextObject

Method | Returns | Description
--- | --- | --- 
**update(** options **)** | `this` | Updates the values of the Polyanno.transcription object.
**delete()** | `this` | Deletes the Polyanno.transcription object.

### Events (Singular)

* Events inherited from Polyanno.baseAnnotationObject
* Events inherited from Polyanno.baseTextObject

Event | Data | Description
--- | --- | --- 
polyanno_deleting |  | Triggered before the object is deleted.
polyanno_deleted |  | Triggered after the object has been deleted.
polyanno_updating |  | Triggered before the object's properties have been updated.
polyanno_updated |  | Triggered after the object's properties have been updated.

##Polyanno.transcriptions

### Methods (Plural)

* Methods inherited from Polyanno.collections

### Events (Plural)

* Events inherited from Polyanno.collections











# Translations

## Polyanno.translation

### Properties 

* Properties inherited from Polyanno.baseAnnotationObject
* Properties inherited from Polyanno.baseTextObject

Property | Type | Default | Description
--- | --- | --- | --- 
**transcription** | `String` | undefined | The id property of the Polyanno object of the transcription of the image.
**voting.rank** | `Number` | 0 | The number of up votes given to this object.

### Methods (Singular)

* Methods inherited from Polyanno.baseAnnotationObject
* Methods inherited from Polyanno.baseTextObject

Method | Returns | Description
--- | --- | --- 
**update(** options **)** | `this` | Updates the values of the Polyanno.translation object.
**delete()** | `this` | Deletes the Polyanno.translation object.

### Events (Singular)

* Events inherited from Polyanno.baseAnnotationObject
* Events inherited from Polyanno.baseTextObject

Event | Data | Description
--- | --- | --- 
polyanno_deleting |  | Triggered before the object is deleted.
polyanno_deleted |  | Triggered after the object has been deleted.
polyanno_updating |  | Triggered before the object's properties have been updated.
polyanno_updated |  | Triggered after the object's properties have been updated.

##Polyanno.translations

### Methods (Plural)

* Methods inherited from Polyanno.collections

### Events (Plural)

* Events inherited from Polyanno.collections






# Vectors

The vectors are the shapes that select the region of the image containing the text. They are created and defined through the Leaflet Draw package but for the purposes of linking them consistently in the annotation models they can be handled as Polyanno objects, that are "notGeoJSONs" (the basic GeoJSON structure but with the term "not" appended to the beginning of the fields due to the lack of support for GeoJSONs using a simple coordinate system) with additional properties added.

## Polyanno.vector

### Properties 

* Properties inherited from Polyanno.baseAnnotationObject

Property | Type | Default | Description
--- | --- | --- | --- 
notFeature | `notFeature Object` | | See the properties of the notFeature Object below.
coordinates | `Array` | [] | The coordinates of the polygon as defined in the GeoJSON format.
OCD | `Array` | [] | An array of the coordinate arrays of the polygons that make up the Optimal Convex Decomposition breakdown of the vector shape if it is not fully convex.
parent | `String` | undefined | The id property of the next largest shape vector to contain this one inside, if it exists.
transcription_fragment | `String` | undefined | The id property of the transcription of the area of the image covered by this vector, if it exists.
translation_fragment | `String` | undefined | The id property of "the" translation into English of the area of the image covered by this vector, if it exists.
layer | `String` | undefined | The id of the Leaflet layer defining the vector shape.
coordinates | `Array` | undefined | Alternative method of accessing the coordinate information.

**Properties of the notFeature Object**

Property | Type | Default | Description
--- | --- | --- | --- 
notType | `String` | "Feature" | The type of GeoJSON format.
notGeometry | `Object` | {  notType: "Polygon" } | The Geometry object as defined by the GeoJSON format.
notCrs | `Object` | {  notType: "name",  notProperties: "L.CRS.Simple" } | The Coordinate reference system used by Leaflet to define the location of the vectors relative to the IIIF image.


### Methods (Singular)

* Methods inherited from Polyanno.baseAnnotationObject

### Events (Singular)

* Events inherited from Polyanno.baseAnnotationObject

Event | Data | Description
--- | --- | --- 
polyanno_deleting |  | Triggered before the object is deleted.
polyanno_deleted |  | Triggered after the object has been deleted.
polyanno_updating |  | Triggered before the object's properties have been updated.
polyanno_updated |  | Triggered after the object's properties have been updated.


##Polyanno.vectors

### Methods (Plural)

* Methods inherited from Polyanno.collections

### Events (Plural)

* Events inherited from Polyanno.collections





# Images





# Selected

## Polyanno.selected

This is used to temporarily gather the different "equivalent" objects (that share a common annotation relationship e.g. are all bodies of one) that are being handled simultaneously to prevent unecessary repeated lookups through the annotation models properties.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
vectors | `Polyanno.collections Object` | | Polyanno collection of Polyanno.vector objects that are currently being handled
transcriptions | `Polyanno.collections Object` | | Polyanno collection of Polyanno.transcription objects that are currently being handled
translations | `Polyanno.collections Object` | | Polyanno collection of Polyanno.translation objects that are currently being handled
targets | `Polyanno.collections Object` | | Polyanno collection of any valid JavaScript objects that are currently being handled
currentlyEditing | Boolean | false | If true then 
currentlyDeleting | Boolean | false | If true then 

### Methods (Singular)

Method | Returns | Description
--- | --- | --- 
**getAll()** | `Object` | Returns all the arrays of the currently handled objects in a dictionary object structure.
**reset()** | `this` | Empties all the arrays of the selected object.
**setSelected(** docs **)** | `this` | Accepts an object with the same properties as Polyanno.selected to update their values.
**setVector(** vector **)** | `this` | 



# Editors



## Polyanno.editor



### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
DOM | `DOM` | undefined | 
id | `String` | Random | 
docs.vectors | `Array` | Polyanno.selected.vectors.array | 
docs.transcriptions | `Array` | Polyanno.selected.transcriptions.array | 
docs.translations | `Array` | Polyanno.selected.translations.array | 
targets | `Array` | Polyanno.selected.targets | 
type | `String` | undefined | 



### Methods (Singular)

Method | Returns | Description
--- | --- | --- 
**update(** options **)** | `this` | Updates the properties of this editor to the include the options.
**closeEditor()** | `this` | Closes this editor and updates the relevant variables in the process.
**setSelected()** | `this` | Resets the Polyanno.selected property values to those of the Polyanno.editor.docs.
**checkDocs(** document_id, type **)** | `Boolean` | Returns true if the docs are included in those of this editor.


### Events (Singular)


## Polyanno.editors

### Methods (Plural)

* Methods inherited from Polyanno.collections

Method | Returns | Description
--- | --- | --- 
**removeEditor()** | `` | 
**closeAll()** | `` | 
**openEditor()** | `` | 
**ifOpen()** | `` | 
**findAllByDoc()** | `` | 
**findOneByDoc()** | `` | 



### Events (Plural)

* Methods inherited from Polyanno.collections








## Polyanno.connectingEquals


### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
DOM | `DOM` | undefined | 









## Polyanno.buildingParents

This handles the process of linking vectors to identify or create a common parent and annotation model target. In the UI this is normally done by selecting the shapes in order of the text reading, then the common parent shape and text annotations are automatically generated by the Polyanno package.

### Properties

Property | Type | Default | Description
--- | --- | --- | --- 
status | `Boolean` | false | If true then the process is live.
vectors | `Array` | [] | The vectors being linked together in order.
transcriptions | `Array` | [] | The transcriptions being linked together in order.
translations | `Array` | [] | The translations being linked together in order.
parent | `Object` |  | See the parent object properties below.

**Parent Object Properties**

Property | Type | Default | Description
--- | --- | --- | --- 
vectors | `` | false | The new vector parent generated.
transcriptions | `` | false | The new transcription parent generated.
translations | `` | false | The new translation parent generated.

### Methods

Method | Returns | Description
--- | --- | --- 
**clicked(** vector **)** | `this` | Function to implement result of a shape being selected whilst the buildingParents process is undergoing.





