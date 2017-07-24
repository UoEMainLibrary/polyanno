
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



### Methods

None.

### Events

None.



## Polyanno.urls

These are the important urls used if using any of the in-built AJAX REST API support to connect a Polyanno application to a REST back end, with defaults defined to support basic default usage of the Polyanno Storage Node package.

### Properties



### Methods

None.

### Events

None.



## Polyanno.map

The object defining the map used in the Polyanno implementation, to pass through to the Leaflet and associated plugins like Leaflet-IIIF.

### Properties



### Methods

None.

### Events

None.


## Polyanno.colours

Because there are various situations where the colours change throughout use of the package, rather than leaving users to manually override the defaults in each situation, the colours used are defined in one object, Polyanno.colours, which can be redefined for more effective adaption.

### Properties



### Methods

None.

### Events

None.


## Polyanno.HTML

These are the objects containing the variables that contain the HTML (as strings) used to dynamically generate the DOM.

### Properties



### Methods

None.

### Events

None.


## Polyanno.intEffects

The properties of this object are used to define the JS and CSS effects used to animate the DOM during default Polyanno behaviour.

### Properties



### Methods

None.

### Events

None.





## Polyanno Text Objects




### Properties



### Methods


### Events




## Polyanno Collections



### Properties



### Methods


### Events




# Transcriptions



# Translations



# Annotations

These objects are the annotations as outlined and defined by the W3C definition for the Web Annotation Model.

## Polyanno.annotation

### Properties 

id


body


target



For more information, please see the Web Annotation Model...



### Methods (Singular)


### Events (Singular)


## Polyanno.annotations

### Properties 

See Polyanno.collections for more info, with the **type** property set to **Polyanno.annotation**.

### Methods (Singular)


### Events (Singular)



# Vectors

## Polyanno.vector

### Properties 



### Methods (Singular)


### Events (Singular)


##Polyanno.vectors

### Methods (Plural)


### Events (Plural)




# Images


# Editors



## Polyanno.editor



### Properties

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

.update

.closeEditor

.setSelected

.checkDocs



### Events (Singular)


## Polyanno.editors

### Methods (Plural)

.removeEditor

.closeAll

.openEditor

.ifOpen

.findAllByDoc

.findOneByDoc



### Events (Plural)


# Currently Selected

## Polyanno.selected




