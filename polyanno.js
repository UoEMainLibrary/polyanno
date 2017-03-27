
////

/////GLOBAL VARIABLES


var websiteAddress;

var polyanno_minimising = true;

var polyanno_current_username;

var imageSelected; //info.json format URL
var imageSelectedMetadata = []; ////???


//URLs

var targetType; 



////leaflet

var polyanno_map;
var baseLayer;
var allDrawnItems = new L.FeatureGroup();
var temp_merge_shape = new L.FeatureGroup();
var controlOptions = {
    draw: {
        polyline: false,  //disables the polyline and marker feature as this is unnecessary for annotation of text as it cannot enclose it
        marker: false
    },
    edit: {
        featureGroup: allDrawnItems //passes draw controlOptions to the FeatureGroup of editable layers
    }
};

var popupVectorMenu;


////HTML VARIABLES

var polyanno_select_fragment_symbol = "<span class='glyphicon glyphicon-scissors'></span> <span class='glyphicon glyphicon-text-background'></span>";
var polyanno_discuss_symbol = "<span class='glyphicon glyphicon-comment'></span>";
var polyanno_new_anno_symbol = "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-plus'></span>";
var polyanno_fragment_alternatives_symbol = "<span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>";
var polyanno_merging_vectors_symbol = "<span class='glyphicon glyphicon-map-marker'></span> <span class='glyphicon glyphicon-stop'></span> <span class='glyphicon glyphicon-object-align-horizontal'></span>";
var polyanno_linking_transcription_to_vectors_symbol = "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-list-alt'></span> <span class='glyphicon glyphicon-stop'></span>";
var polyanno_linking_translation_to_vectors_symbol = "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-globe'></span></span> <span class='glyphicon glyphicon-stop'></span>";
var polyanno_show_alternatives_symbol = "<span class='glyphicon glyphicon-chevron-down'></span> <span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>";

var polyanno_top_bar_HTML = `
  <div class="col-md-6 polyanno-bar-buttons">

    <div class="row">

      <div class="btn-group polyanno-language-buttons" role="group" aria-label="...">

        <button class="btn btn-default polyanno-discussion-btn"><span class="glyphicon glyphicon-comment"></span></button>

        <button id="polyanno-merge-shapes-enable" class="btn btn-default polyanno-merge-shapes-btn">
          `+polyanno_merging_vectors_symbol+`
        </button>

        <div class="btn-group polyanno-merging-buttons" role="group" aria-label="polyanno-merging-buttons">

              <button class="btn btn-primary polyanno-merge-shapes-submit-btn">Submit</button>

              <button class="btn btn-primary polyanno-merge-shapes-cancel-btn">Cancel</button>

        </div>

        <!-- <button class="btn btn-default polyanno-image-open"><span class="glyphicon glyphicon-picture"></span></button> -->

        <button class="btn btn-default polyanno-add-keyboard" type="button">
          <span class="glyphicon glyphicon-plus"></span>
          <span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span>
        </button> <!--add keyboard characters-->

        <button class="btn btn-default polyanno-add-ime polyanno-IME-options-closed" type="button">
          <span class="glyphicon glyphicon-transfer"></span>
          <span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span>
        </button> <!--add IME options-->

      </div>

      <div class="polyanno-enable-IME">

      </div>

    </div>

  </div>

  <div class="col-md-6 dragondrop-min-bar">

  </div>

`;



var polyanno_image_viewer_HTML = `<div id='polyanno_map' class="row"></div>`;


var polyannoVoteOverlayHTML = `<div class='polyanno-voting-overlay' >
                        <button type='button' class='btn btn-default polyanno-standard-btn voteBtn polyannoVotingUpButton'>
                          <span class='glyphicon glyphicon-thumbs-up' aria-hidden='true' ></span>
                        </button>
                        <button type='button' class='btn btn-default polyanno-standard-btn polyannoVotesUpBadge'>
                          <span class='badge'></span>
                        </button>
                      </div>`;
var closeButtonHTML = `<span class='closePopoverMenuBtn glyphicon glyphicon-remove'></span>`;

var transcriptionIconHTML = `<span class='glyphicon glyphicon-list-alt'></span>
                            <span>Transcription</span>`;
var translationIconHTML = `<span class='glyphicon glyphicon-globe'></span>
                            <span>Translation</span>`;


var polyannoEditorHandlebarHTML = `
      <button class="btn polyanno-options-dropdown-toggle dragondrop-handlebar-obj polyanno-colour-change col-md-2" type="button" >
          <span class="glyphicon glyphicon-cog"></span>
          <span class="caret"></span>
      </button>
`;
var polyannoEditorHTML_partone = `

  <div class="textEditorMainBox row ui-content">
    <div class="col-md-12">

`;

////need to change to discussion and put tags into Polyglot alone
var polyannoEditorHTML_options_partone = `<div class="row polyanno-options-row">
                                            <div class="col-md-2 polyanno-options-buttons">
                                              <button class="btn btn-default polyanno-metadata-tags-btn"><span class="glyphicon glyphicon-tags"></span></button>
                                            </div>`;
var polyannoEditorHTML_options_parttwo = `</div>`;

var polyannoEditorHTML_options = polyannoEditorHTML_options_partone + polyannoEditorHTML_options_parttwo;

var polyannoEditorHTML_partfinal = `
      <div class="row polyanno-vector-link-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoLinkVectorBtn'>
          Draw a Shape For This Text On the Image!
        </button> 
      </div>

      <div class="row polyanno-top-voted polyanno-text-display">
      
        <div class='polyanno-voting-overlay' >
          <button type='button' class='btn btn-default voteBtn polyannoVotingUpButton'>
            <span class='glyphicon glyphicon-thumbs-up' aria-hidden='true' ></span>
          </button>
          <button type='button' class='btn btn-default polyannoVotesUpBadge'>
            <span class='badge'></span>
          </button>
        </div>
      </div>

      <div class="row polyanno-alternatives-toggle-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoToggleAlternatives '>
          `+polyanno_show_alternatives_symbol+`
        </button> 
      </div>

      <div class="row polyanno-list-alternatives-row">

      </div>

      <div class="row polyanno-add-new-toggle-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoAddAnnotationToggle'>
          `+polyanno_new_anno_symbol+`
        </button> 
      </div>

      <div class="row polyanno-add-new-row">
        <div class='polyannoAddNewContainer col-md-12'> 
          <textarea id='testingKeys' class='newAnnotation row' placeholder='Add new annotation text here'></textarea><br>
          <button type='button' class='btn addAnnotationSubmit polyannoEditorDropdownBtn row'><span class='glyphicon glyphicon-ok-circle'></span></button>  
        </div> 

      </div>

      <div class="row polyanno-add-new-cancel-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoAddAnnotationCancel'>
          Cancel 
        </button> 
      </div>

      <div class="row polyanno-metadata-tags-row">

      </div>

    </div>
  </div>
`;

atu_the_input = $("#polyanno-dummy-textarea");




////POLYANNO OBJECTS

var Polyanno =  {
  image : {},
  urls : {},
  colours : {},
  HTML : {}
};

var polyanno_obj_added = new Event("polyanno:added");
var polyanno_obj_created = new Event("polyanno:created");
var polyanno_obj_deleted = new Event("polyanno:removed");
var polyanno_obj_edited = new Event("polyanno:edited");

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined','']);
var findingcookies = document.cookie;
var $langSelector = false;
var $imeSelector = false;

/////GENERIC FUNCTIONS

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  }
};

var getTargetJSON = function(target, callback_function) {

  if ( isUseless(target) ) { return null;  }
  else if (target.includes(Polyanno.urls.annotation)) {
    return Polyanno.annotations.getById(target);
  }
  else if (target.includes(Polyanno.urls.vector)) {
    return Polyanno.vectors.getById(target);
  }
  else if (target.includes(Polyanno.urls.transcription)) {
    return Polyanno.transcriptions.getById(target);
  }
  else if (target.includes(Polyanno.urls.translation)) {
    return Polyanno.translations.getById(target);
  };  

};

var updateAnno = function(targetURL, targetData, callback_function) {

  var thisAnno = getTargetJSON(targetURL);
  thisAnno.update(targetData);
  if (!isUseless(callback_function)) {  callback_function();  };

};

var fieldMatching = function(searchArray, field, fieldValue) {
  if (isUseless(searchArray) || isUseless(field) || isUseless(fieldValue)) {  return false;  }
  else {
    var theMatch = false; 
    searchArray.forEach(function(childDoc){
      if ((childDoc[field] == fieldValue) || (new RegExp(fieldValue).test(childDoc[field])) ) {
          theMatch = childDoc;
      };
    });
    return theMatch;
  };
};

var asyncPush = function(addArray, oldArray) {
    var theArray = oldArray;
    var mergedArray = function() {
        addArray.forEach(function(addDoc){
            theArray.push(addDoc);
        });
        if (theArray.length = (oldArray.length + addArray.length)) {
            return theArray;
        };
    };
    return mergedArray();
};

var arrayIDCompare = function(arrayA, arrayB) {
  return arrayA.forEach(function(doc){
    var theCheck = fieldMatching(arrayB, "id", arrayA.id);
    if (  isUseless(theCheck) ) { return false }
    else {
      return [doc, theCheck];
    };
  });
};

var findField = function(target, field) {
  if ( isUseless(field) || isUseless(target) || isUseless(target[field])  ) {  return false  } 
  else {  return target[field] }; 
};

var checkFor = function(target, field) {
  var theChecking = getTargetJSON(target);
  return findField(theChecking, field);
};

var searchCookie = function(field) {
  var fieldIndex = findingcookies.lastIndexOf(field);
  if (fieldIndex == -1) {  return false;  }
  else {
    var postField = findingcookies.substring(fieldIndex+field.length);
    var theValueEncoded = postField.split(";", 1);
    var theValue = theValueEncoded[0];
    return theValue;
  };
};

var findByID = function(array, id) {
  if (isUseless(array[0])) {  return [];  }
  else {
    return $.grep(array, function(item){
      return item.id == id;
    });
  };
};

var arraySearchReplace = function(annoField, doc) {
  var existing = findByID(annoField, doc.id);
  if (existing.length > 0) {
    return annoField.splice(annoField.indexOf(existing[0]), 1, doc);
  }
  else {
    return false;
  };
};

var annoCheckType = function(anno, type) {
  if (anno instanceof type) {
    return true;
  }
  else {
    console.error("TypeError: Polyanno[annos] must contain Polyanno[anno] Objects.");
    return false;
  };
};

var searchingUnknownByID = function(id) {
  var type;
  for (url in Polyanno.urls) {  if (id.includes(Polyanno.urls[url])) { type = url; } };
  var coll = type.concat("s");
  var obj = Polyanno[coll].getById(id);
};

var replaceChildText = function(oldText, spanID, newInsert, oldInsert) {
    var idIndex = oldText.indexOf(spanID);
    var startIndex = oldText.indexOf(oldInsert, idIndex);
    var startHTML = oldText.slice(0, startIndex);
    var EndIndex = startIndex + oldInsert.length;
    var endHTML = oldText.substring(EndIndex);
    var newText = startHTML + newInsert+ endHTML;
    return newText;
};

var findClassID = function(classString, IDstring) {
  var IDindex = classString.search(IDstring) + IDstring.length;
  var IDstart = classString.substring(IDindex);
  var theID = IDstart.split(" ", 1);
  return theID[0];
};

var checkForVectorTarget = function(theText) {

  var theAnno = Polyanno.getAnnotationByBody(theText);
  var targetSearch =  fieldMatching(theAnno.target, "format", 'image/SVG');
  return targetSearch.id;  

};

var polyanno_annos_of_target = function(target, baseType, callback_function) {
  var data = Polyanno.getAnnotationsByTarget(target, baseType, true);
  var bodies = [];
  for (var i=0; i< data.length; i++) {  bodies.push(data[i].body);  };
  if (!isUseless(callback_function)) {    callback_function(bodies);  }; 
};




//////////////////URLS

Polyanno.urls = {
    "vector": window.location.host + "/api/vectors/",
    "transcription": window.location.host + "/api/transcriptions/",
    "translation": window.location.host + "/api/translations/",
    "annotation": window.location.host + "/api/annotations/"
};

/////Methods

//check for url

//if no DB then handle AJAX requests throughout Polyanno

///////////////////Colours

Polyanno.colours = {
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
  },
  highlightThis: {}
};

/////Methods

Polyanno.colours.highlightThis.vector = function(chosenVector, colourChange) {

  allDrawnItems.eachLayer(function(l){
    if (l._leaflet_id == chosenVector) {
      l.setStyle({color: colourChange});
    }
  });

};

Polyanno.colours.highlightThis.editor = function(chosenEditor, colourChange) {
  chosenEditor.DOM.find(".polyanno-colour-change").css("background-color", colourChange);
};

Polyanno.colours.highlightThis.span = function(chosenSpan, colourChange) {
  chosenSpan.css("background-color", colourChange);
};

Polyanno.colours.connectColours = function(object, type, action) {
  Polyanno.colours.highlightThis[type](object, Polyanno.colours[action][type]);
  switch (type) {
    case "editor": 

      var vec = object.docs.vectors[0];
      if (!isUseless(vec)) { Polyanno.colours.highlightThis.vector(vec.id, Polyanno.colours[action]["vector"]); };

      var transcriptionSpan = object.docs.transcriptions[0];
      if (!isUseless(transcriptionSpan)) { 
        var targets = check.getAnnosTargetingThis("translation");
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };

      var translationSpan = object.docs.translations[0];
      if (!isUseless(translationSpan)) { 
        var targets = check.getAnnosTargetingThis("transcription");
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };      
      break;

    case "vector":

      var ed = Polyanno.editors.findOneByDoc(object, "vectors");
      if (!isUseless(ed)) { Polyanno.colours.highlightThis.editor(ed, Polyanno.colours[action]["editor"]); };

      var targets = Polyanno.vectors.getById(object).getAnnosTargetingThis();
      for (var i=0; i < targets.length; i++) {
        var o = document.getElementById(targets[i]._id);
        if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
      };
      break;

    case "span":
      var base;
      var opp;
      if (object.closest(".polyanno-text-display").hasClass("transcription-text")) {  base = "transcription"; opp = "translation"; }
      else {  base = "translation";  opp = "transcription"; };
      var plural = base.concat("s");
      var id = Polyanno.urls[base].concat(object.attr("id"));

      var ed = Polyanno.editors.findOneByDoc(id, plural); 
      if (!isUseless(ed)) { Polyanno.colours.highlightThis.editor(ed, Polyanno.colours[action]["editor"]); }; 

      ////vectors

      var check = Polyanno[plural].getById(id);
      if (!isUseless(check)) {
        var targets = check.getAnnosTargetingThis(opp);
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };
      break;
    };
};


var resetVectorHighlight = function(thisEditor) {
  var thisVector = fieldMatching(Polyanno.editors.array, "editor", thisEditor).vector; 
  if(!isUseless(thisVector)){ Polyanno.colours.highlightThis.vector(thisVector, Polyanno.colours.default.vector); };
};





///////////////////HTML

Polyanno.HTML = {
  symbols: {},
  popups: {},
  connectingEquals: {},
  buildingParents: {}
};

Polyanno.HTML.symbols = {
    transcription: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-list-alt'></span>",
    translation: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-globe'></span>",
    discussion: "<span class='glyphicon glyphicon-comment'></span>",
    textHighlightingCut: "<span class='glyphicon glyphicon-scissors'></span> <span class='glyphicon glyphicon-text-background'></span>",
    textHighlightingOthers: "<span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>",
    newAnnotation: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-plus'></span>",
    buildingParents: "<span class='glyphicon glyphicon-map-marker'></span> <span class='glyphicon glyphicon-stop'></span> <span class='glyphicon glyphicon-object-align-horizontal'></span>",
    connectingEquals:{
      transcription: "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-list-alt'></span> <span class='glyphicon glyphicon-stop'></span>",
      translation: "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-globe'></span></span> <span class='glyphicon glyphicon-stop'></span>"
    },
    showAlternatives: "<span class='glyphicon glyphicon-chevron-down'></span> <span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>",
};

Polyanno.HTML.popups = {

    connectingEquals: `
      <div id="connectingEqualsMenu" class="popupAnnoMenu">
        <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_setting_selecting_vector(); polyanno_map.closePopup();">Submit</a>
        <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_reset_selecting_vector(); polyanno_map.closePopup();">Cancel</a>
      </div>
    `,

    textHighlighting: {
      transcription: `
        <div id="popupTranscriptionNewMenu" class="popupAnnoMenu">
           <div data-role="main" class="ui-content">
              <a class="openTranscriptionMenuNew transcriptionTarget editorPopover btn btn-default polyanno-standard-btn" onclick="Polyanno.selected.textHighlighting.DOM.popover("hide"); polyanno_new_anno_via_selection("transcription");">`+Polyanno.HTML.symbols.transcription+`</a></br>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
           </div>
        </div>
      `,

      translation: `
        <div id="popupTranslationNewMenu" class="popupAnnoMenu" >
            <div data-role="main" class="ui-content">
              <a class="openTranslationMenuNew translationTarget editorPopover ui-btn ui-corner-all polyanno-standard-btn" onclick="Polyanno.selected.textHighlighting.DOM.popover("hide"); polyanno_new_anno_via_selection("translation");">`+Polyanno.HTML.symbols.translation+`</a></br>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>  
      `
    },
    children: {
      transcription: `
        <div id="popupTranscriptionChildrenMenu" class="popupAnnoMenu">
            <div data-role="main" class="ui-content">
              <a class="openTranscriptionMenuOld editorPopover btn btn-default polyanno-standard-btn" onclick="polyanno_open_existing_text_transcription_menu();">`+polyanno_fragment_alternatives_symbol+`</a>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>
      `,
      translation: `
        <div id="popupTranslationChildrenMenu" class="popupAnnoMenu">
            <div data-role="main" class="ui-content">
              <a class="openTranslationMenuOld editorPopover btn btn-default polyanno-standard-btn" onclick="polyanno_open_existing_text_translation_menu();">`+polyanno_fragment_alternatives_symbol+`</a>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>
      `
    }

};

Polyanno.HTML.connectingEquals = {

};

Polyanno.HTML.buildingParents = {
    Transcriptions : `
                                      <div class="row">
                                        <h2>The New Transcription:</h2>
                                      </div>
                                      <div id="polyanno_merging_transcription" class="row"></div>`,
    Translations : `
                                      <div class="row">
                                        <h2>The New Translation:</h2>
                                      </div>
                                      <div id="polyanno_merging_translation" class="row"></div>`
};

///

var openHTML = "<div class='popupAnnoMenu'>";
var transcriptionOpenHTML = `<a class="openTranscriptionMenu polyanno-standard-btn btn btn-default" onclick="Polyanno.editors.ifOpen('transcription');
      polyanno_map.closePopup();">`+Polyanno.HTML.symbols.transcription+`</a><br>`;
var translationOpenHTML = `<a class="openTranslationMenu polyanno-standard-btn btn btn-default" onclick="Polyanno.editors.ifOpen('translation');
      polyanno_map.closePopup();">`+Polyanno.HTML.symbols.translation+`</a>`;
var endHTML = "</div>";
var popupVectorMenuHTML = openHTML + transcriptionOpenHTML + translationOpenHTML + endHTML;



/////Methods




////////////EventEmitterObject

var PolyannoEventEmitter = function(opts) {
  this.listeners = {};
};

PolyannoEventEmitter.prototype.listeners = null;
PolyannoEventEmitter.prototype.on = function(type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(callback);
};

PolyannoEventEmitter.prototype.unbind = function(type, callback) {
  if (!(type in this.listeners)) {
    return;
  }
  var stack = this.listeners[type];
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback){
      stack.splice(i, 1);
      return;
    }
  }
};

PolyannoEventEmitter.prototype.trigger = function(event) {
  if (!(event.type in this.listeners)) {
    return true;
  }
  var stack = this.listeners[event.type];
  event.target = this;
  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event);
  }
  return !event.defaultPrevented;
};






/////////////Collections (Plural)


Polyanno.collections = function(type) {
  this.type = type;
  this.array = [];
};

Polyanno.collections.prototype = new PolyannoEventEmitter();

///Methods

Polyanno.collections.prototype.add = function(anno) {
  var oldArr = [].concat(this.array);
  var type = this.type;
  if (annoCheckType(anno, type)) {  oldArr.push(anno);  };
  this.array = oldArr;
  this.trigger('polyanno:added');
};

Polyanno.collections.prototype.replaceOne = function(anno) {
  var oldArr = this.array;
  var newArr = arraySearchReplace(oldArr, anno);
  this.array = newArr;
};

Polyanno.collections.prototype.getById = function(the_id) {
  var arr = this.array;
  var thesearch = findByID(arr, the_id)[0];
  return thesearch;
};

Polyanno.collections.prototype.deleteAll = function() {
  this.array = [];
};

Polyanno.collections.prototype.getAll = function() {
  return this.array;
};


/////////////////Annotation (Singular)

var PAnnoSubDoc = function(value) {

  for (var prop in value) {
    if (prop == "format") {
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
    };
    if (prop == "id") { this.id = value.id };
  };
  if (isUseless(this.id)) {
    console.error("There should be a unique URI provided as the id field of all bodies and targets in annotations");
    this.id = Math.random().toString().substring(2);
  };

};

Polyanno.annotation = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };

  this["@context"] = [
    "http://www.w3.org/ns/anno.jsonld"
    ];
  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.annotation.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = this.id = opts.id;
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.annotation.concat(newNum);
  };

  this.type = "Annotation";
  this.body = subdocIDchecking(opts.body);
  if (opts.target instanceof Array) {  this.target = settingTargets(opts.target, []);  }
  else {  console.error("TypeError: Annotation.target must be of Type Array.");  };
  this.creator = {
    name: polyanno_current_username,
    motivation: "identifying"
  };

  this.trigger('polyanno:created');

};

Polyanno.annotation.prototype = new PolyannoEventEmitter();

///

Object.defineProperty(Polyanno.annotation.prototype, "type", {
  set: function(value) {
    if (!value.includes("Annotation")) {
      console.error("Annotations must include 'Annotation' in their Type string.");
    }
    else {
      type = value;
    };
  }
});

var subdocIDchecking = function(value) {
    if ((value instanceof PAnnoSubDoc) && (!isUseless(value.id))) {
      return value;
    }
    else if (!isUseless(value.id)){
      return new PAnnoSubDoc(value);
    }
    else {
      console.error("Annotation bodies and targets should have IDs");
      return false;
    };
};

var settingTargets = function(value, oldArr) {
  var arr = [];
  for (var i=0; i < value.length; i++) {
    var this_target = subdocIDchecking(value[i]);
    if (this_target == false) { break; };
    var existing = findByID(oldArr, this_target.id);
    if (existing.length > 0) {
      for (props in this_target) {
        existing[0][props] = this_target[props];
      };
      arraySearchReplace(arr, existing);
    }
    else {
      arr.push(this_target);
    };
  };
  if (!isUseless(oldArr[0])) {    arr.concat(oldArr);  };
  return arr;
};


/////Methods

//singular

Polyanno.annotation.prototype.update = function(opts) {
  for (var property in opts) {
    this[property] = opts[property];
  };
  this.dispatchEvent(polyanno_obj_edited);
  Polyanno.annotations.replaceOne(this);
};

Polyanno.annotation.prototype.delete = function() {
  var the_item = findByID(Polyanno.annotations.array, this.id)[0];
  Polyanno.annotations.array.splice(Polyanno.annotations.array.indexOf(the_item), 1);
  this.dispatchEvent(polyanno_obj_deleted);
};

Polyanno.annotation.prototype.getBody = function() {
  var id = this.body.id;
  return searchingUnknownByID(id);
};

Polyanno.annotation.prototype.getTargets = function() {
  var targets = this.target;
  var targetArr = [];
  for (var i=0; i < targets.length; i++) {
    var t = targets[i];
    targetArr.push(searchingUnknownByID(t.id));
  };
  return targetArr;
};

////Events

Polyanno.annotation.prototype.onupdated = function(func) {
  this.on('polyanno:edited', function(e) {
    func.call(this, this, e);
  });
};

Polyanno.annotation.prototype.ondeleted = function(func) {
  this.on('polyanno:deleted', function(e) {
    func.call(this, this, e);
  });
};

Polyanno.annotation.prototype.oncreated = function(func) {
  this.on('polyanno:created', function(e) {
    func.call(this, this, e);
  });
};

///////

/////////////////// Annotations (plural)

Polyanno.annotations = new Polyanno.collections(Polyanno.annotation);

var expandingAnnotation = function (obj) {
  var bodyObj = searchingUnknownByID(obj.body.id);
  var targetArr = [];
  for (var i=0; i < obj.target.length; i++) {
    var t = obj.target[i];
    targetArr.push(searchingUnknownByID(t.id));
  };
  return {"anno": obj, "body": bodyObj, "target": targetArr};
};

Polyanno.getAnnotationsByTarget = function(target, type, expanded) {
  var search = function(targets, aim) {
    var a = $.grep(targets, function(t){
      return t.id = aim;
    });
    if (a.length > 0) {  return true;  }
    else { return false };
  };
  var types = function(items) {
    return $.grep(items, function (thing) {
      return thing.body.id.includes(Polyanno.urls[type])
    });
  };
  var arr = $.grep(Polyanno.annotations.array, function(anno){
    return search(anno.target, target);
  });

  var type_arr = function() {
    if (isUseless(type)) { return arr; }
    else {   return types(arr);  }
  };

  if (expanded) {
    var ta = type_arr(type);
    var newA = [];
    for (var n=0; n <ta.length; n++) {
      newA.push(expandingAnnotation(ta[n]));
    };
    return {"array": newA};
  }
  else {
    return {"array": type_arr(type)};
  };
};

Polyanno.getAnnotationByBody = function(target, expanded) {
  var a = $.grep(Polyanno.annotations.array, function (anno) {
    return anno.body.id == target
  });
  if (expanded) {
    return expandingAnnotation(a[0]);
  }
  else {
    return {"anno": a[0] };
  };
};

///Events



////////////////////Base Annotations


Polyanno.baseAnnotationObject = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  this["@context"] = [
    "http://www.w3.org/ns/anno.jsonld"
    ];

  this.type = opts.type;
  this.metadata = opts.metadata;
  this.format = opts.format;
  if (["auto", "ltr", "rtl"].includes(opts.textDirection)) {
    this.textDirection = opts.textDirection;
  };
  this.language = opts.language;
  this.processingLanguage = opts.processingLanguage;

  this.creator = {
    name: polyanno_current_username,
    motivation: "identifying"
  };

  //this.trigger('polyanno:created');

};

Polyanno.baseAnnotationObject.prototype = new PolyannoEventEmitter();

Object.defineProperty(Polyanno.baseAnnotationObject.prototype, "format", {
  value: "application/json",
  writable: true,
  enumerable: true,
  configurable: false
});

/////Methods

Polyanno.baseAnnotationObject.prototype.isAnnotationBody = function() {
  var id = this.id;
  var theAnno = Polyanno.getAnnotationByBody(id);
  return theAnno;
};

Polyanno.baseAnnotationObject.prototype.isAnnotationTarget = function(type) {
  var id = this.id;
  var theAnnos = Polyanno.getAnnotationsByTarget(id, type, true);
  return theAnnos;
};

Polyanno.baseAnnotationObject.prototype.getAnnosTargetingThis = function(type) {
  var arr = this.isAnnotationTarget(type);
  var t=[];
  if (!isUseless(arr)) {
    for (var i=0; i < arr.length; i++) {
      t.push(arr[i].body);
    };
  };
  return t; 
};

////Events Setting Methods

Polyanno.baseAnnotationObject.prototype.onupdated = function(func) {
  this.on('polyanno:edited', function(e) {
    func.call(this, this, e);
  });
};

Polyanno.baseAnnotationObject.prototype.ondeleted = function(func) {
  this.on('polyanno:deleted', function(e) {
    func.call(this, this, e);
  });
};


//////////////////Base Texts

Polyanno.baseTextObject = function(value) {
  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  Polyanno.baseAnnotationObject.call(this, opts);
  this.text = opts.text;
  if (opts.vector instanceof Polyanno.vector) {  this.vector = opts.vector;  }
  else if (!isUseless(opts.vector)) { console.error("TypeError");  };
  if (!isUseless(opts.parent)) {  this.parent = opts.parent;  };
  this.voting = {
    up: 0,
    down: 0
  };
};

var sharedParentSearch = function(arr, item) {
  var array = $.grep(arr, function(a){
    return a.parent == item.parent;
  });
  return array.sort(function(x, y){
    return x.rank - y.rank;
  });
};

var setInitialRank = function(arr, item) {
  var all = sharedParentSearch(arr, item);
  var blank = $.grep(all, function(a){
    return (a.voting.up == 0) && (a.voting.down == 0);
  });
  if (all.length == 0) {  return 0; }
  else if (blank.length == 0) {
    return all[all.length -1].rank + 1;
  }
  else {
    return blank[0].rank + 1;
  };
};

var voteChangeRank = function(arr, item, vote) {
  ///vote = +1 or -1
  var arr = votingRankSearch(Polyanno.transcriptions, item);
  var index = arr.indexOf(item);
  if (index != 0) {
    var neighbour = index - vote;
    var diff = (arr[neighbour].voting.up - arr[neighbour].voting.down) - (item.voting.up - item.voting.down);
    while ((diff <= 0) && (neighbour >= 0) && (neighbour <= arr.length - 1)) {
      neighbour -= vote;
    };
    if ((neighbour < 0) && (neighbour > arr.length - 1)){
      return arr[(neighbour += vote)].rank;
    }
    else {
      return arr[neighbour].rank + vote;
    };
  };
};



/////

var polyanno_voting_reload_editors = function(updatedTranscription, editorID, targetID, textType) {
  if (updatedTranscription) {    
    Polyanno.selected.transcription.id = targetID;
    ///change HTML content of editors
  };
  if (updatedTranscription && (!isUseless(Polyanno.selected.vector.id))) {
    var updateTargetData = {};
    updateTargetData[textType] = targetID;
    updateAnno(Polyanno.selected.vector.id, updateTargetData);
  };

  ///////if the parent is open in an editor rebuild carousel with new transcription 
  Polyanno.editors.array.forEach(function(editorOpen){
    editorOpen.children.forEach(function(eachChild){
      if ( eachChild.id == Polyanno.selected.transcription.DOMid ){
        ////change HTML content of editors
      };
    });
  });

};


var votingFunction = function(vote, votedID, thisEditor) {
  var type = thisEditor.type;
  var plural = type.concat("s");
  var targetID = Polyanno.urls[type].concat(votedID); ///API URL of the annotation voted on
  var thisText = Polyanno[plural].getById(targetID);

  var votedTextBody = $("#"+votedID).html(); 

  thisText.voting[vote];

  ////if change in rank necessitates a reload in parent text is this done here or elsewhere???

};

var polyanno_find_highest_ranking_frag_child = function(location_json) {
  var the_child = fieldMatching(location_json.fragments, "rank", 0); 
  return findField(the_child, "id");
};

var findHighestRankingChild = function(the_parent_json_children, locationID) {
  var theLocation = fieldMatching(the_parent_json_children, "id", locationID);
  return polyanno_find_highest_ranking_frag_child(theLocation);
};

/////Methods



//////////////////Transcriptions

Polyanno.transcription = function(value) {
  Polyanno.baseTextObject.call(this, value);
  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  if (!isUseless(opts.translation)) {  this.translation = opts.translation; };

  this.voting.rank = setInitialRank(Polyanno.transcriptions, this);

  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.transcription.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = this.id = opts.id;
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.transcription.concat(newNum);
  };

};


Object.defineProperty(Polyanno.transcription.prototype, "parent", {
  set: function(value) {
    if (value instanceof Polyanno.transcription) {  parent = value;  }
    else { console.error("TypeError: Parents should be of same type as child.");  };
  }
});

Object.defineProperty(Polyanno.transcription.prototype, "translation", {
  set: function(value) {
    if (value instanceof Polyanno.translation) {  translation = value;  }
    else { console.error("TypeError");  };
  }
});

Object.defineProperty(Polyanno.transcription.prototype, "voting.up", {
  enumerable: true,
  set: function() {
    voting.up += 1;
    rank = voteChangeRank(Polyanno.transcriptions, this, 1);
  }
});

Object.defineProperty(Polyanno.transcription.prototype, "voting.down", {
  enumerable: true,
  set: function() {
    voting.up -= 1;
    rank = voteChangeRank(Polyanno.transcriptions, this, -1);
  }
});

/////Methods

//singular

Polyanno.transcription.prototype.update = function(opts) {
  for (var property in opts) {
    this[property] = opts[property];
  };
  Polyanno.transcriptions.replaceOne(this);
};

Polyanno.transcription.prototype.delete = function() {
  var the_item = findByID(Polyanno.transcriptions, this.id)[0];
  Polyanno.transcriptions.splice(Polyanno.transcriptions.indexOf(the_item), 1);
};

////Events Setting Methods


//////////Transcriptions (Plural)

Polyanno.transcriptions = new Polyanno.collections(Polyanno.transcription);


//////////////////Translations



/////Methods


////Events Setting Methods



///////////////////Vectors


Polyanno.vector = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };

  Polyanno.baseAnnotationObject.call(this, opts);

  ////Coordinates
  var new_coords = [];
  ATCarray = 0;
  opts.geometry.coordinates[0].forEach(function(coordinatesPair){
      new_coords.push([]);
      var coordsNumbers = [];
      coordinatesPair.forEach(function(number){
          converted = Number(number);
          coordsNumbers.push(converted);
      });
      new_coords[ATCarray] = coordsNumbers;
      ATCarray += 1;      
  });

  this.notFeature = {
    notType: "Feature",
    notGeometry: {
      notType: "Polygon",
      notCoordinates: new_coords
    },
    notCrs: {
      notType: "name",
      notProperties: "L.CRS.Simple"
    }
  };
  this.OCD = opts.OCD;
  this.parent = opts.parent;
  this.transcription_fragment = opts.transcription_fragment;
  this.translation_fragment = opts.translation_fragment;

  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.vector.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = this.id = opts.id;
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.vector.concat(newNum);
  };

  //Polyanno.vectors.add(this);
  //var anno = new Polyanno.annotation(opts);

};

Object.defineProperty(Polyanno.vector, "layer", {
  get: function() { return allDrawnItems.getLayer(this.id); }
});

/////Methods


//singular

Polyanno.vector.prototype.update = function(opts) {
  for (var property in opts) {
    this[property] = opts[property];
  };
  Polyanno.vectors.replaceOne(this);
};

Polyanno.vector.prototype.delete = function() {
  var the_item = findByID(Polyanno.vectors, this.id)[0];
  Polyanno.vectors.splice(Polyanno.vectors.indexOf(the_item), 1);
};


////////

Polyanno.vectors = new Polyanno.collections(Polyanno.vector);

///////////////////Image



/////Methods



///////////////////Selected


Polyanno.selected = {
  vectors: new Polyanno.collections(Polyanno.vector),
  transcriptions: new Polyanno.collections(Polyanno.transcription),
  translations: new Polyanno.collections(Polyanno.translation),
  targets: new Polyanno.collections(Object)
};

Object.defineProperty(Polyanno.selected, "vector", {
  get: function() { return Polyanno.selected.vectors[0] },
  set: function(value) {
    if (value instanceof Polyanno.vector) {  Polyanno.selected.vectors[0] = value;  }
    else {  Polyanno.selected.vectors[0] = new Polyanno.vector(value);  };
  }
});

Object.defineProperty(Polyanno.selected, "transcription", {
  get: function() { return Polyanno.selected.transcriptions[0] },
  set: function(value) {
    if (value instanceof Polyanno.transcription) {  Polyanno.selected.transcriptions[0] = value;     }
    else { Polyanno.selected.transcriptions[0] = new Polyanno.transcription(value); };
  }
});
Object.defineProperty(Polyanno.selected, "translation", {
  get: function() { return Polyanno.selected.translations[0] },
  set: function(value) {
    if (value instanceof Polyanno.translation) {  Polyanno.selected.translations[0] = value;     }
    else { Polyanno.selected.translations[0] = new Polyanno.translation(value); };
  }
});


///Methods

Polyanno.selected.getAll = function() {
  return {
    vectors: Polyanno.selected.vectors.getAll(),
    transcriptions: Polyanno.selected.transcriptions.getAll(),
    translations: Polyanno.selected.translations.getAll(),
    targets: Polyanno.selected.targets.array,
  };
};

Polyanno.selected.reset = function () {
  Polyanno.selected.vectors.deleteAll();
  Polyanno.selected.transcriptions.deleteAll();
  Polyanno.selected.translations.deleteAll();
  Polyanno.selected.targets.array = [];
};

Polyanno.selected.setSelected = function (docs) {
  Polyanno.selected.reset();
  for (var property in docs) {
    Polyanno.selected[property] = docs[property];
  };
};

///////////////////connectingEquals

Polyanno.selected.connectingEquals = {};
Polyanno.selected.connectingEquals.status = false; //used to indicate if the user is currently searching for a vector to link or not
/*
{     siblings: Polyanno.selected.transcriptions,
      parent_anno : Polyanno.selected.transcriptions[0].parent,
      parent_vector : checkForVectorTarget(parent_anno)
}*/

var updateVectorSelection = function(the_vector_url) {

  var textData = {target: [{id: the_vector_url, format: "image/SVG"}]};
  Polyanno.selected.connectingEquals.siblings.forEach(function(child){
    updateAnno(child[0].body.id, textData);
  });
  Polyanno.selected.connectingEquals.status = false;

  //Polyanno.selected.connectingEquals.editor;
  //$().find(".polyanno-vector-link-row").css("display", "none");

  ///update Polyanno.editors to activate highlighting

};

var polyanno_setting_selecting_vector = function() {
  var this_layer = allDrawnItems.getLayer(Polyanno.selected.vector.id);
  var this_shape = this_layer.toGeoJSON();
  var this_parent = Polyanno.selected.connectingEquals.parent_vector._leaflet_id;
  polyanno_new_vector_made(this_layer, this_shape, this_parent);
};
var polyanno_reset_selecting_vector = function() {
  var this_layer = allDrawnItems.getLayer(Polyanno.selected.vector.id);
  allDrawnItems.removeLayer(this_layer);
};








//editing

Polyanno.selected.currentlyEditing = false;
Polyanno.selected.currentlyDeleting = false;








////buildingParents

Polyanno.selected.buildingParents = {
  status: false,
  vectors: [],
  transcriptions: [],
  translations: [],
  parent: {
    vector : false ///Leaflet layer not just GeoJSON
    //transcription
    //translation
  }
};

var polyanno_new_anno_for_child_of_merge = function(this_url, this_data, callback) {


};

var polyanno_new_annos_via_linking = function(merged_vector) {
  var linked_transcriptions = $("#polyanno_merging_transcription").html();
  var linked_translations = $("#polyanno_merging_translation").html();

  var transcription_data = {text: linked_transcriptions, children: Polyanno.selected.buildingParents.transcriptions, metadata: imageSelectedMetadata, 
    target: [
            {id: merged_vector,  format: "image/SVG"  },
            {id: imageSelected,  format: "application/json"  } ]
  };
  var translation_data = {text: linked_translations, children: Polyanno.selected.buildingParents.translations, metadata: imageSelectedMetadata,
    target: [
            {id: merged_vector,  format: "image/SVG"  },
            {id: imageSelected,  format: "application/json"  } ]
  };

  var createdTranslation;
  var createdTranscription;

  var vector_children_counter = 0;

  var polyanno_update_vector_children_iteratively = function () {

    /////////separate into two parts so the anno ids can be created and added

      var this_layer = Polyanno.selected.buildingParents.vectors[vector_children_counter];
      var this_layer_id = this_layer._leaflet_id;
      textTarget[0].id = this_layer_id;
      var these_properties = this_layer.toGeoJSON().properties;
      var the_data = { parent: merged_vector  };
      var new_text_data = {  text: "  ", target: textTarget, metadata: imageSelectedMetadata };

      if (isUseless(these_properties)) { 
        this_layer.toGeoJSON().properties = {}; 
        new_text_data.parent = createdTranscription;
      };

      the_data.transcription = these_properties.transcription;
      the_data.translation = these_properties.translation;

      if (isUseless(these_properties.transcription)) {
        new_text_data.parent = createdTranscription;
        ///need to set Polyanno.selected.transcription.DOMid

        polyanno_new_anno_for_child_of_merge(Polyanno.urls.transcription, new_text_data, polyanno_update_vector_children_iteratively); 
        //this will POST to t, then POST to anno, then leave PUT to parent whilst returning to this loop
      }
      else if (isUseless(these_properties.transcription)) {
        new_text_data.parent = createdTranslation;
        ///need to set Polyanno.selected.transcription.DOMid

        polyanno_new_anno_for_child_of_merge(Polyanno.urls.translation, new_text_data, polyanno_update_vector_children_iteratively);
        //this will POST to t, then POST to anno, then leave PUT to parent whilst returning to this loop
      }
      else if (vector_children_counter == (Polyanno.selected.buildingParents.vectors.length - 1)) {
        updateAnno(this_layer_id, the_data);
      }
      else {
        vector_children_counter += 1;

        updateAnno(this_layer_id, the_data, polyanno_update_vector_children_iteratively );
      };
  };  


};










///////////////////Editors

Polyanno.editor = function(textType) {

  var popupIDstring = createEditorPopupBox(textType);
  var plural = textType.concat("s");

  this.DOM = $(popupIDstring);
  this.id = $(popupIDstring).attr("id");
  this.docs = {
    vectors: Polyanno.selected.vectors.array,
    transcriptions: Polyanno.selected.transcriptions.array,
    translations: Polyanno.selected.translations.array
  };
  this.targets = Polyanno.selected.targets;
  this.type = textType;

  var thisEditor = this;

  if (Polyanno.selected.vectors.array.length == 0) {  
    $(popupIDstring).find(".polyanno-vector-link-row").css("display", "block");
  };

  if (Polyanno.selected[plural].array.length == 0) {
    $(popupIDstring).find(".polyanno-add-new-row")
    .css("display", "block")
    .attr("id", "addBox"+popupIDstring);
  }
  else {
    var mainText = Polyanno.selected[plural].array[0];
    alert("main text parent is "+JSON.stringify(mainText.parent));
    if (!isUseless(mainText.parent)) {

      $(popupIDstring).find(".polyanno-add-new-toggle-row").css("display", "block");

      //enable listening event for voting display   
      ////improve to hover because otherwise flickering for small text displays!!
      $(popupIDstring).on("mouseenter", ".polyanno-text-display", function(event){
        //$(event.target).find(".polyanno-voting-overlay").css("display", "block");
        $(event.target).find(".polyanno-voting-overlay").show("swing");
      });
      $(popupIDstring).on("mouseleave", ".polyanno-text-display", function(event){
        //$(event.target).find(".polyanno-voting-overlay").css("display", "none");
        $(event.target).find(".polyanno-voting-overlay").hide("swing");
      });      
    };

    polyanno_display_editor_texts(Polyanno.selected[plural].array, popupIDstring);

  }; 

};

Polyanno.editors = new Polyanno.collections(Polyanno.editor);

/////Methods

Polyanno.editor.prototype.update = function(opts) {
  var dom = this.DOM;
  for (var property in opts) {
    this[property] = opts[property];
  };
  Polyanno.editors.replaceOne(this);
};

Polyanno.editor.prototype.closeEditor = function() {
  var id = this.id;
  var the_editor_gone = dragondrop_remove_pop(id);
  resetVectorHighlight(id);
  Polyanno.editors.removeEditor(id);
  return the_editor_gone;
};

Polyanno.editor.prototype.setSelected = function() {

  Polyanno.selected.reset();

  Polyanno.selected.vectors.array = this.docs.vectors;
  Polyanno.selected.transcriptions.array = this.docs.transcriptions;
  Polyanno.selected.translations.array = this.docs.translations;

  Polyanno.selected.targets = this.targets;

};

Polyanno.editor.prototype.checkDocs = function(docID, type) {
  var arr = this.docs[type];
  var check = $.grep( arr, function(doc) {
      return doc.id == docID;
    });
  if (check.length == 0) { return false; }
  else { return true; };
};

//plural

Polyanno.editors.removeEditor = function(id) {
  var this_editor = findByID(Polyanno.editors.array, id)[0];
  Polyanno.editors.array.splice(Polyanno.editors.array.indexOf(this_editor), 1);
};

Polyanno.editors.closeAll = function() {
  for (var i=0; i < Polyanno.editors.array.length; i++) {
    var item = Polyanno.editors.array[i];
    item.closeEditor();
  };
};

Polyanno.editors.openEditor = function(textType) {

  var ed = new Polyanno.editor(textType);
  Polyanno.editors.add(ed);

};

Polyanno.editors.ifOpen = function(fromType) {

  var comparison = Polyanno.selected.getAll();
  if (isUseless(Polyanno.editors.array[0])) {    Polyanno.editors.openEditor(fromType);  }
  else {
    var opened = $.grep( Polyanno.editors.array, function(ed) {
      return ed.docs == comparison;
    });
    if (opened.length == 0) {
      Polyanno.editors.openEditor(fromType);
    }
    else {
      $(opened[0].id).effect("shake");
    };
  };
};

Polyanno.editors.findAllByDoc = function(docID, type) {
  return $.grep( Polyanno.editors.array, function(ed) {
      return ed.checkDocs(docID, type);
  });
};

Polyanno.editors.findOneByDoc = function(docID, type) {
  var arr = $.grep( Polyanno.editors.array, function(ed) {
      return ed.checkDocs(docID, type);
  });
  return arr[0];
};

///// VIEWER WINDOWS

var polyanno_shake_the_popups = function() {
  $(".annoPopup").effect("shake", {
    direction: "right",
    distance: 10,
    times: 2
  });
};

var createEditorPopupBox = function(textType) {

  var dragon_opts = {
    "minimise": polyanno_minimising,
    "initialise_min_bar": false,
    "beforeclose": preBtnClosing
  };
  var polyannoEditorHTML = polyannoEditorHTML_partone + polyannoEditorHTML_options + polyannoEditorHTML_partfinal;
  var popupIDstring = add_dragondrop_pop("textEditorPopup", polyannoEditorHTML, "polyanno-page-body", dragon_opts, polyannoEditorHandlebarHTML);
  $(popupIDstring).show("drop", null, null,polyanno_shake_the_popups)
  $(popupIDstring).find(".dragondrop-handlebar").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondrop-handlebar-obj").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondropbox").addClass("textEditorBox");
  $(popupIDstring).find(".dragondrop-title").html(returnTextIcon(textType));
  $(popupIDstring).find(".textEditorMainBox").find('*').addClass(textType+"-text");

  return popupIDstring;

};

var preBtnClosing = function(thisEditor) {
  resetVectorHighlight(thisEditor);
  Polyanno.editors.removeEditor(thisEditor);
};

var returnTextIcon = function(textType){
  if(textType == "transcription") {
    return transcriptionIconHTML;
  }
  else if (textType == "translation"){
    return translationIconHTML;
  };
};

var polyanno_build_text_display_row = function(polyannoTextAnno) {
  var paragraphHTML = " <p id='";
  var middleHTML = "' class='content-area' title=' '>";
  var closingHTML1 = "</p>"
  var itemText = polyannoTextAnno.text;
  var itemID = polyannoTextAnno._id;
  var itemHTML = paragraphHTML + itemID + middleHTML + itemText + closingHTML1; 
  return itemHTML;
};

var polyanno_build_alternatives_list = function(existingTextAnnos, popupIDstring) {

  $(popupIDstring).find(".polyanno-alternatives-toggle-row").css("display", "block");
  var openingHTML1 = "<div class='col-md-12'><div class='polyanno-text-display row  ";
  var openingHTML2 = "'>"
  var closingHTML2 = `</div></div>`;

  existingTextAnnos.forEach(function(subarray, index) {

    var theParagraphHTML = polyanno_build_text_display_row(subarray);
    var thisItemID = subarray._id;
    var thisItemURL = subarray.id;

    if (index == 0){
      $(popupIDstring).find(".polyanno-top-voted").append(theParagraphHTML);
    }
    else {
      var itemHTML = openingHTML1 + thisItemID + openingHTML2 + theParagraphHTML + polyannoVoteOverlayHTML + closingHTML2;
      $(popupIDstring).find(".polyanno-list-alternatives-row").append(itemHTML);
    };

    if ( !isUseless(subarray[1]) )  {
      var votesUp = subarray[1].votesUp;
      $("."+thisItemID).find(".polyanno-voting-overlay").find(".polyannoVotesUpBadge").find(".badge").html(votesUp); 
    }; 
 
  });
};

var polyanno_display_editor_texts = function(existingTextAnnos, popupIDstring) {

  $(popupIDstring).find(".polyanno-top-voted").css("display", "block");

  if (existingTextAnnos.length == 1) {
    var itemHTML = polyanno_build_text_display_row(existingTextAnnos[0]);
    $(popupIDstring).find(".polyanno-top-voted").append(itemHTML);
  }
  else {
    polyanno_build_alternatives_list(existingTextAnnos, popupIDstring);
  };

};

var polyanno_populate_tags = function(theAnno, popupIDstring) {
  var tagHTML1 = "<a class='polyanno-tag' >";
  var tagHTML2 = "</a>";
  if (!isUseless(theAnno.metadata)) {
    var polyanno_searching = $.grep(theAnno.metadata, function(e){ 
        if (!isUseless(e.label)) {  return e.label == "Tag";   };
    });
    polyanno_searching.forEach(function(theTagSpan){
      var polyannoTagHTML = tagHTML1 + theTagSpan + tagHTML2;
      $(popupIDstring).find(".polyanno-metadata-tags-row").append(polyannoTagHTML);
    });
  };
};

//////////////////////////////////////////////////////////////////

///// TEXT SELECTION

Polyanno.selected.textHighlighting = {
  selected: null,
  parentDOM: null,
  newDOM: null,
  newContent: null
};

function getSelected() {
  if(window.getSelection) { return window.getSelection() }
  else if(document.getSelection) { return document.getSelection(); }
  else {
    var selection = document.selection && document.selection.createRange();
    if(selection.text) { return selection.text; }
    return false;
  }
  return false;
};

var newSpanClass = function(startParentClass) {
  if (startParentClass.includes('transcription-text')) {
    return "transcription-text opentranscriptionChildrenPopup";
  }
  else if (startParentClass.includes('translation-text')) {
    return "translation-text opentranslationChildrenPopup";
  }
  else {
    return null;
  };
};

var strangeTrimmingFunction = function(thetext) {
  if(thetext && (thetext = new String(thetext).replace(/^\s+|\s+$/g,''))) {
    return thetext.toString();
  }; 
};

var newTextPopoverOpen = function() {
  $('#polyanno-page-body').on("click", function(event) {
    alert($(event.target).attr("class"));
    if ($(event.target).hasClass("popupAnnoMenu") == false) {
      Polyanno.selected.textHighlighting.DOM.popover("hide");
      Polyanno.selected.textHighlighting.parentDOM.html(Polyanno.selected.textHighlighting.oldContent); 
    }
  });

  $('.openTranscriptionMenuNew').on("click", function(event) {
    Polyanno.selected.textHighlighting.DOM.popover("hide");
    polyanno_new_anno_via_selection("transcription");   
  });

  $('.openTranslationMenuNew').on("click", function(event) {
    Polyanno.selected.textHighlighting.DOM.popover("hide");
    polyanno_new_anno_via_selection("translation");  
  });

  $('.closePopoverMenuBtn').on("click", function(event){
    Polyanno.selected.textHighlighting.DOM.popover("hide");
    Polyanno.selected.textHighlighting.parentDOM.html(Polyanno.selected.textHighlighting.oldContent); 
  });
};

var initialiseOldTextPopovers = function(base) {
  Polyanno.selected.textHighlighting.parentDOM.popover({ 
    trigger: 'manual', //////
    html : true,
    title: closeButtonHTML,
    placement: "auto top",
    viewport: "#polyanno-page-body",
    content: Polyanno.HTML.popups.children[base]
  });
  Polyanno.selected.textHighlighting.parentDOM.popover('show');
};

var setOESC = function(outerElementHTML, previousSpanContent, previousSpan) {
  var outerElementStartContent;
  if (previousSpan == "null" || previousSpan == null) {outerElementStartContent = previousSpanContent}
  else {
    var previousSpanAll = previousSpan.outerHTML;
    var StartIndex = outerElementHTML.indexOf(previousSpanAll) + previousSpanAll.length;
    outerElementStartContent = outerElementHTML.slice(0, StartIndex).concat(previousSpanContent);
  };
  return outerElementStartContent;
};

var setOEEC = function(outerElementHTML, nextSpanContent, nextSpan) {
    var outerElementEndContent;
    if (nextSpan == "null" || nextSpan == null) {outerElementEndContent = nextSpanContent}
    else {
      var EndIndex = outerElementHTML.indexOf(nextSpan.outerHTML);
      outerElementEndContent = nextSpanContent.concat(outerElementHTML.substring(EndIndex));
    };
    return outerElementEndContent;
};

var setNewTextVariables = function(selection, classCheck) {

  var startNode = selection.anchorNode; // the text type Node that the beginning of the selection was in

  var startNodeText = startNode.textContent; // the actual textual body of the startNode - removes all html element tags contained
  var startNodeTextEndIndex = startNodeText.toString().length;
  var startParentID = startNode.parentElement.id;
  var startParentClass = startNode.parentElement.parentElement.className;

  ////////***** Selections ends depend on which way aorund the text is selected NOT which way around in the text the positions are ******
  var nodeLocationStart = selection.anchorOffset; //index from within startNode text where selection starts
  var nodeLocationEnd = selection.focusOffset; //index from within endNode text where selection ends
  if (nodeLocationStart < nodeLocationEnd) {
    nodeLocationStart = selection.focusOffset;
    nodeLocationEnd = selection.anchorOffset;
  };

  var endNode = selection.focusNode; //the text type Node that end of the selection was in 

  var endNodeText = endNode.textContent;
  var endParentID = endNode.parentElement.id; //the ID of the element type Node that the text ends in

  var outerElementTextIDstring = "#" + startParentID; //will be encoded URI of API?
  Polyanno.selected.textHighlighting.parentDOM = $(outerElementTextIDstring);

  var edID = $(outerElementTextIDstring).closest(".textEditorPopup").attr("id");
  var ed = Polyanno.editors.getById(edID);
  var base = ed.type;
  var plural = base.concat("s");

  Polyanno.selected.textHighlighting.parent = ed.docs[plural][0].id;

  if (classCheck.includes('opentranscriptionChildrenPopup')) { 
    Polyanno.selected.textHighlighting.type = "transcription";
    initialiseOldTextPopovers("transcription");
  }
  else if (classCheck.includes('opentranslationChildrenPopup')) { 
    Polyanno.selected.textHighlighting.type = "translation";
    initialiseOldTextPopovers("translation");
  }    
  else if (startParentID != endParentID) {
  
  }
  else {

    var newNodeInsertID = Math.random().toString().substring(2);

    var newSpan = "<a class='" + newSpanClass(startParentClass) + " ' id='" + newNodeInsertID + "' >" + selection + "</a>";
    var outerElementHTML = Polyanno.selected.textHighlighting.parentDOM.html().toString(); 

    ///CONTENT BEFORE HIGHLIGHT IN THE TEXT TYPE NODE
    var previousSpanContent = startNodeText.slice(0, nodeLocationEnd); 
    /////this including to the end of the selected text???

    //CONTENT BEFORE HIGHLIGHT IN THE ELEMENT TYPE NODE
    var previousSpan = startNode.previousElementSibling; //returns null if none i.e. this text node is first node in element node
    var outerElementStartContent = setOESC(outerElementHTML, previousSpanContent, previousSpan);

    ///CONTENT AFTER HIGHLIGHT IN THE TEXT TYPE NODE
    var nextSpanContent;
    ////this is starting before the start of the selected text???
    if (endNode == startNode) { nextSpanContent = startNodeText.slice(nodeLocationStart, startNodeTextEndIndex)}
    else {nextSpanContent = endNodeText.slice(0, nodeLocationStart)};

    ///CONTENT AFTER HIGHLIGHT IN ELEMENT TYPE NODE
    var nextSpan = endNode.nextElementSibling; //returns null if none i.e. this text node is the last in the element node
    var outerElementEndContent = setOEEC(outerElementHTML, nextSpanContent, nextSpan );

    Polyanno.selected.textHighlighting.DOMid = newNodeInsertID;
    Polyanno.selected.textHighlighting.URI = Polyanno.selected.textHighlighting.parent.concat("#"+Polyanno.selected.textHighlighting.DOMid);
    Polyanno.selected.textHighlighting.oldContent = Polyanno.selected.textHighlighting.parentDOM.html();
    Polyanno.selected.textHighlighting.newContent = outerElementStartContent + newSpan + outerElementEndContent;
    Polyanno.selected.textHighlighting.fragment = strangeTrimmingFunction(selection);

    Polyanno.selected.textHighlighting.parentDOM.html(Polyanno.selected.textHighlighting.newContent); 
    Polyanno.selected.textHighlighting.DOM = $("#"+newNodeInsertID);

    Polyanno.selected.textHighlighting.DOM.css("background-color", "yellow");
    Polyanno.selected.textHighlighting.DOM.popover({ 
      trigger: 'manual',
      html : true,
      container: 'body',
      placement: "auto top",
      title: closeButtonHTML,
      viewport: "#polyanno-page-body",
      content: Polyanno.HTML.popups.textHighlighting[base]
    });
    Polyanno.selected.textHighlighting.DOM.popover('show');
    Polyanno.selected.textHighlighting.DOM.on("shown.bs.popover", function(ev) {
      newTextPopoverOpen();
    });

  };
};


//////////////////////////////////////////////////////////////////

var polyanno_new_anno_via_selection = function(base) {
  var plural = base.concat("s");
  var parent = Polyanno[plural].getById(Polyanno.selected.textHighlighting.parent);

  ///objects
  var targetData = {
    id: Polyanno.selected.textHighlighting.DOMid,
    text: Polyanno.selected.textHighlighting.fragment, 
    metadata: imageSelectedMetadata, 
    parent: parent,
    target: [
          {id: Polyanno.selected.textHighlighting.URI, format: "text/html"}, 
          {id: Polyanno.selected.textHighlighting.parent, format: "application/json"}, 
          {id: imageSelected,  format: "application/json"  } 
          ]
  };

  var data = new Polyanno[base](targetData);
  Polyanno[plural].add(data);

  targetData.body = data;
  var new_anno = new Polyanno.annotation(targetData);
  Polyanno.annotations.add(new_anno);

  parent.update({text: Polyanno.selected.textHighlighting.newContent});

  ///editors and selected

  Polyanno.selected.reset();
  Polyanno.selected[plural].add(data);
  Polyanno.selected.targets = targetData.target;

  Polyanno.editors.openEditor(base);

  ////polyanno storage loop



  Polyanno.selected.textHighlighting = {
    selected: null,
    parentDOM: null,
    newDOM: null,
    newContent: null
  };

};


//////////////////////////////////////////////////////////////////

////TEXT SUBMISSION


var polyanno_new_anno_via_text_box = function(thisEditor){

  //Objects 

  var newText = thisEditor.DOM.find(".newAnnotation").val();
  var theData = {text: newText, metadata: imageSelectedMetadata, target: thisEditor.targets };
  var type = thisEditor.type;
  var plural = type.concat("s");

  if (Polyanno.selected.vectors.array.length != 0) {  theData.vector =  Polyanno.selected.vector; };
  if (!isUseless(thisEditor.parent)) {  theData.parent = thisEditor.parent;  };

  var data = new Polyanno[type](theData);
  Polyanno[plural].add(data);

  theData.body = data;
  var new_anno = new Polyanno.annotation(theData);
  Polyanno.annotations.add(new_anno);

  Polyanno.selected[plural].add(data);
  thisEditor.docs[plural] = Polyanno.selected[plural].array;

  ///HTML

  thisEditor.DOM.find(".polyanno-add-new-row").css("display", "none");
  thisEditor.DOM.find(".polyanno-top-voted").css("display", "block");
  var itemHTML = polyanno_build_text_display_row(data);
  thisEditor.DOM.find(".polyanno-top-voted").append(itemHTML);

  ///polyanno storage loop

};


//////////////////////////////////////////////////////////////////








///////LEAFLET 

/////find anticlockwise angle from edge one to edge two for each vertex in clockwise order

var angle_from_zero = function(x,y) {
  var angle_radians = Math.atan2(y,x); //atan2 takes y first and deals with segments
  return angle_radians * (180/Math.PI);
};

var recentre_coordinates = function(vertex_to_change, new_centre) {
  var new_x = vertex_to_change[0] - new_centre[0];
  var new_y = vertex_to_change[1] - new_centre[1];
  return [new_x, new_y];
};

//vertex = [x,y]
var anticlockwise_vertex_angle = function(vertex1, vertex2, vertex3) {
  //reset the centre to be the second vertex (the actual vertex in question)
  var new_vertex1 = recentre_coordinates(vertex1, vertex2);
  var new_vertex3 = recentre_coordinates(vertex3, vertex2);
  var anticlockwise_angle_v1 = angle_from_zero(new_vertex1[0],new_vertex1[1]);
  var anticlockwise_angle_v3 = angle_from_zero(new_vertex3[0],new_vertex3[1]);
  return anticlockwise_angle_v3 - anticlockwise_angle_v1;
};

var find_concavity_angles = function(coordinates) {
  /////if angle is between 180 degrees and 360 degrees then add it to the notches array
  ////need to account for repeat coordinates at beginning and end of array
  var notches_array = [];
  for (var i=0; i< coordinates.length; i++) {
    var the_angle;
    if (i == (coordinates.length - 2)) {
      the_angle = anticlockwise_vertex_angle(coordinates[i],coordinates[i+1],coordinates[1]);
    }
    else if (i == (coordinates.length - 1)) {
      the_angle = anticlockwise_vertex_angle(coordinates[i],coordinates[1],coordinates[2]);
    }
    else {
      the_angle = anticlockwise_vertex_angle(coordinates[i],coordinates[i+1],coordinates[i+2]);
    };
    if ((the_angle > 180) && (the_angle < 360)) {
      ///[x,y, coordinates_array_position]
      var the_vertex_array = [coordinates[0],coordinates[1],i];
      notches_array.push(the_vertex_array);
    };
  };
  return notches_array;
};

//(Chazelle and Dobkin, 1985) Optimal Decomposition Algorithm
var chazelle_and_dobkin_polynomial_ocd = function(coordinates, notches_array) {
  var the_OCD_array = [];
  ////algorithm here!!
  var this_geometry = [];
  var this_id = Math.random().toString().substring(2);
  the_OCD_array.push({"_id": this_id, "coordinates": this_geometry});
  return the_OCD_array;
};

//if concave then apply optimal convex decomposition algorithm to vector and store corresponding convex geometry in arrays in notFeatures
var check_for_concavity = function(coordinates) {
  var the_notches_array = find_concavity_angles(coordinates);
  if (the_notches_array.length > 0) {
    return chazelle_and_dobkin_polynomial_ocd(coordinates, the_notches_array);
  }
  else {
    return false;
  };
};

/////properties: [
///// OCD: [
///////   { _id: unique_id,
///////     coordinates: []
///////   }
///// ], ....

//////Separating Axis Theorem

//anticlockwise between edges 1 and 2 is always the inside of the shape for all the convex polygons
//so 180 degrees clockwise of an edge is always the side of the edge overlapping inside the shape
//so if a vector axis is created along the edge then the perpendicular measurement taken from each vertex of the other shape to that axis
//if it is on the 180 degrees side interior to the shape then it is overlapping

var rotate_axes_coordinates = function(vertex, rotating_vertex) {
  var axes_rotation_angle = Math.atan2(rotating_vertex[1],rotating_vertex[0]); //atan2 takes (y,x), deals with segments, and output in radians
  var old_v_angle = Math.atan2(vertex[1],vertex[0]); 
  var new_angle = old_v_angle - axes_rotation_angle;
  var the_radius = Math.sqrt((vertex[0]*vertex[0])+(vertex[1]*vertex[1]));
  var new_y = the_radius * (Math.sin(new_angle));
  return new_y;
};

var find_y_dash_value = function(vertex, first_point, second_point) {
  var new_vertex2 = recentre_coordinates(second_point, first_point);
  var new_test_vertex = recentre_coordinates(vertex, first_point);
  if (rotate_axes_coordinates(new_test_vertex, new_vertex2) >= 0) {
    return true;
  }
  else {
    return false;
  };
};

var check_if_overlapping = function(vertex, coordinates) {
  var overlapping = true;
  for (var i = 0; i < coordinates.length; i++) {
    var is_y_positive;
    if (i == (coordinates.length - 1)) {
      is_y_positive = find_y_dash_value(vertex, coordinates[i], coordinates[0]);
    }
    else {
      is_y_positive = find_y_dash_value(vertex, coordinates[i], coordinates[i+1]);
    };
    if (is_y_positive) { overlapping = false; };
  };
  return overlapping;
};

var check_inside_another_shape = function(new_shape, old_shape) {
  var overlapping_coords = [];
  for (var a=0; a < new_shape.length; a++) {
    var this_vertex = new_shape[a];
    var is_overlapping = check_if_overlapping(this_vertex, old_shape);
    if (is_overlapping) {
      overlapping_coords.push(new_shape);
    };
  };
  return overlapping_coords;
};

var check_this_geoJSON = function(shape, drawnItem, justOverlap) {
  var overlapping_coords = [];
  if ((!isUseless(drawnItem.properties))&&(!isUseless(drawnItem.properties.OCD))) {
    for (var a = 0; a < drawnItem.properties.OCD.length; a++) {
      var convex_shape = drawnItem.properties.OCD[a];
      var is_new_inside = check_inside_another_shape(shape.geometry.coordinates[0], convex_shape);
      if ((is_new_inside.length > 0) && (justOverlap)) {
        return 1;
      }
      else if (is_new_inside.length > 0) {
        overlapping_coords.push(is_new_inside);
      };
    };
  }
  else {
    overlapping_coords = check_inside_another_shape(shape.geometry.coordinates[0], drawnItem.geometry.coordinates[0]);
  };
  if (overlapping_coords.length == shape.length) {
    return 2; //new shape is entirely inside old one
  }
  else if (overlapping_coords.length > 0) {
    return 1; //new shape overlaps with old one
  }
  else {
    return 0; //no overlap
  };
};

var check_this_shape_for_overlapping = function(shape, theItems, justOverlap, completeParent, completeChildren) {
  //[number, children_array, parent_array]
  //where number: 0 = no overlap, 1 = overlap, 2 = shape_array is parent, 3 = shape_array is children
  var children_vectors = [];
  var parent_vectors = [];
  theItems.eachLayer(function(layer){
      var drawnItem = layer.toGeoJSON();
      var checking_overlapping_inside = check_this_geoJSON(shape, drawnItem, justOverlap);
      if (checking_overlapping_inside == 1) {
        return [1, [layer]];
      }
      else if (completeParent && (checking_overlapping_inside == 2)) {
        parent_vectors.push(layer);
      }
      else if (checking_overlapping_inside == 2) {
        return [2, [layer]];
      }
      else {
        var checking_enclosing = check_this_geoJSON(drawnItem, shape);
        if (completeChildren && (checking_enclosing == 2)){
          children_vectors.push(layer);
        }
        else if (checking_enclosing == 2){
          return [3, [layer]];
        };
      };
  });
  if (children_vectors.length > 0) {
    return [3, children_vectors, parent_vectors];
  }
  else if (parent_vectors.length > 0) {
    return [2, children_vectors, parent_vectors];
  }
  else {
    return [0];
  };
  
};

/////Calculating Merge Shape

var polyanno_calculate_gap_length = function(vertex1, vertex2) {
  var x_gap = vertex1[0] - vertex2[0];
  var y_gap = vertex1[1] - vertex2[1];
  return Math.sqrt((x_gap * x_gap)+(y_gap * y_gap));
};

var polyanno_find_nearest_vectors = function(current_shortest_array, vertex, shape) {
  ///[gap_length_value, shape2_index]
  var shortest_gap = current_shortest_array;
  for (var a=0; a < shape.length; a++) {
    var the_gap = polyanno_calculate_gap_length(vertex, shape[a]);
    if (the_gap < shortest_gap[0]) {  shortest_gap = [the_gap, a];  };
  };
  return shortest_gap;
};

var polyanno_find_shortest_branch = function(shape1, shape2) {
  ///[gap_length_value, shape1_index, shape2_index]
  var shortest_gap_array = [polyanno_calculate_gap_length(shape1[0],shape2[0]), 0, 0];
  for (var a=0; a < shape1.length; a++) {
     ///[gap_length_value, shape2_index]
    var gap_array = polyanno_find_nearest_vectors([shortest_gap_array[0]], shape1[a], shape2);
    if (gap_array[0] < shortest_gap_array[0]) { shortest_gap_array = [gap_array[0], a, gap_array[1]]; };
  };  
  return shortest_gap_array;
};

var polyanno_form_neighbour_index_array = function(shape, main_index){
  var prev;
  var next;
  if (main_index==0) {  prev = shape.length -2; }
  else {  prev = main_index - 1 };
  if (main_index==(shape.length -1)){  next = 1 }
  else {  next = main_index +1 };
  return [shape[prev], shape[next]];
};

var sort_out_edge_direction = function(shortest, neighbour_value) {
  //the bridge shape needs to run in the opposite direction to the shape it has come from to be clockwise
  if (neighbour_value == 0) {   return [shortest, (shortest - 1)];    }
  else {    return [(shortest + 1), shortest];    };  
};

var polyanno_calculate_merge_shape_index = function(shape1, shape2) {
  ///[gap_length_value, shape1_index, shape2_index]
  var the_shortest_branch_array = polyanno_find_shortest_branch(shape1, shape2);
  var shape1_shortest_neighbours = polyanno_form_neighbour_index_array(shape1, the_shortest_branch_array[1]);
  var shape2_shortest_neighbours = polyanno_form_neighbour_index_array(shape2, the_shortest_branch_array[2]);
  ///[gap_length_value, shape1_index, shape2_index]
  var shortest_neighbour_branch_array = polyanno_find_shortest_branch(shape1_shortest_neighbours, shape2_shortest_neighbours);
  var shape1_edge = sort_out_edge_direction(the_shortest_branch_array[1], shortest_neighbour_branch_array[1]);
  var shape2_edge = sort_out_edge_direction(the_shortest_branch_array[2], shortest_neighbour_branch_array[2]);
  return [shape1_edge[0], shape1_edge[1], shape2_edge[0], shape2_edge[1]];
};

var find_edge_intersection = function(edge1_v1, edge1_v2, edge2_v1, edge2_v2) {

  var edge1_slope = (edge1_v2[1]-edge1_v1[1])/(edge1_v2[0]-edge1_v1[0]);
  var edge2_slope = (edge2_v2[1]-edge2_v1[1])/(edge2_v2[0]-edge2_v1[0]);
  var edge1_x_offset = edge1_v1[1] - (edge1_v1[0] * edge1_slope);
  var edge2_x_offset = edge2_v1[1] - (edge2_v1[0] * edge2_slope);
  var x_intersect = (edge2_x_offset - edge1_x_offset) / (edge1_slope - edge2_slope);

  //edge1 is assumed to be the "real" shape edge and so needs to be within shape boundary
  if ( ( (x_intersect <= edge1_v1[0]) && (x_intersect >= edge1_v2[0]) ) || (  (x_intersect >= edge1_v1[0]) && (x_intersect <= edge1_v2[0])  ) ) {
    var y_intersect = (edge1_slope * x_intersect) + edge1_x_offset;
    return [x_intersect, y_intersect];
  }
  else {  return false; };
};

var polyanno_redirect_shape_boundary = function(initial_geometry, convex_shape, conflict_vertex_index) {
  ///find where the conflict edge intersects with the initial_geometry_edge
  var vertex1_index = conflict_vertex_index - 1;
  var new_geometry = [];
  if (conflict_vertex_index == 0) { vertex1_index = convex_shape.length - 1;  };
  for (var i=0; i < initial_geometry.length; i++) {
    var second_v = i + 1;
    if (i == (initial_geometry.length - 1)) { second_v = 0  };
    var intersects = find_edge_intersection(initial_geometry[i], initial_geometry[second_v], convex_shape[vertex1_index], convex_shape[conflict_vertex_index]);
    if (intersects != false) {  new_geometry = initial_geometry.splice(second_v, 0, intersects);  };
  };
  return new_geometry;
};

var polyanno_overlap_looping = function(initial_geometry, convex_shape) {
  var new_geometry = false;
  for (var a=0; a < convex_shape.length; a++) {
    var this_vertex = convex_shape[a];
    var is_overlapping = check_if_overlapping(this_vertex, initial_geometry);
    if (is_overlapping) {
      return polyanno_redirect_shape_boundary(initial_geometry, convex_shape, a);
    };
  };
  return new_geometry;
};

var polyanno_find_and_fix_overlap = function(initial_geometry, convex_shape) {
  ///need to find fix if 
  var the_geometry = initial_geometry;
  var reiterate = true;
  while (reiterate) {
    var new_geometry = polyanno_overlap_looping(the_geometry, convex_shape);
    if (new_geometry == false) {
      return the_geometry;
    }
    else {
      the_geometry = new_geometry;
    };
  };
};

var polyanno_merge_overlap_iteration = function(initial_geometry, drawnItem) {
  var geometry_array = initial_geometry;
  if (!isUseless(drawnItem.properties.OCD)) {
      for (var a = 0; a < drawnItem.properties.OCD.length; a++) {
        var convex_shape = drawnItem.properties.OCD[a];
        geometry_array = polyanno_find_and_fix_overlap(geometry_array, convex_shape);
      };
      return geometry_array;
    }
    else {
      var convex_shape = drawnItem.geometry.coordinates[0];
      return polyanno_find_and_fix_overlap(geometry_array, convex_shape);
    };

};

var polyanno_merge_shape_avoid_overlap = function(initial_geometry, merge_array) {
  var geometry_array = initial_geometry;
  allDrawnItems.eachLayer(function(layer){
      if (merge_array.includes(layer)) {    } //unsure if this will work with the file types involved?
      else {
        var drawnItem = layer.toGeoJSON();
        geometry_array = polyanno_merge_overlap_iteration(geometry_array, drawnItem);
      };
  });
  return geometry_array;
};

var polyanno_find_shape_between = function(the_shape, point_a_index, point_b_index) {
  ///a is start of clockwise loop around shape, b is the end
  //need to account for the fact that the first and last coordinate have to be identical
  if (point_a_index == 0) { 
    return the_shape.slice(1, point_b_index); ///a is 0 AND last point, b is the penultimate point
  }
  else if (point_b_index == 0) {
    return the_shape.slice(2, (the_shape.length - 1)); //b is 0 AND last point, a is 1
  }
  else {
    var shape_start = the_shape.slice(1, point_b_index); // start not inlcuding ending, then up to, but not including, b
    var shape_end = the_shape.slice(point_a_index+1); // from (a + 1) to end
    return shape_end.concat(shape_start);
  };
};

var polyanno_calculate_new_merge_shape = function(shape1, shape2, merge_array) {
  //[v1_index_shape1, v2_index_shape1, v3_index_shape2, v4_index_shape2]
  var bridge_index_array = polyanno_calculate_merge_shape_index(shape1, shape2);
  //[v2, v3, v4, v1]
  var bridge_initial_geometry = [shape1[bridge_index_array[1]], shape2[bridge_index_array[2]], shape2[bridge_index_array[3]], shape1[bridge_index_array[0]]];
  //[shape1_2, ... v1, v2 .... , shape2_1, shape2_2, ...v1, v2 .... shape1_1]
  var bridge_final_geometry = polyanno_merge_shape_avoid_overlap(bridge_initial_geometry, merge_array);

  //the bridge shape is running clockwise too so the adjacent edges are in the reverse order
  var shape1_segment = polyanno_find_shape_between(shape1, bridge_index_array[0], bridge_index_array[1]); //shape1 between v1 to v2
  var shape2_segment = polyanno_find_shape_between(shape2, bridge_index_array[2], bridge_index_array[3]); //shape2 between v3 and v4
  var index_of_v4 = bridge_final_geometry.indexOf(bridge_initial_geometry[2]); 
  var bridge_shape_start = bridge_final_geometry.slice(0, index_of_v4); // v2 to v3
  var bridge_shape_end = bridge_final_geometry.slice(index_of_v4); // v4 to v1
  var final_coords = shape1_segment.slice(0,1);

  var final_merge_shape_coords = shape1_segment.concat(bridge_shape_start, shape2_segment, bridge_shape_end, final_coords); //the first and last coordinates need to be identical
  return final_merge_shape_coords;
};









var polyanno_update_merge_shape = function(temp_shape_layer, new_vec_layer, merge_array) {
  var old_shape_JSON = temp_shape_layer.toGeoJSON();
  var old_shape_coords = old_shape_JSON.geometry.coordinates[0];
  var new_vec_JSON = new_vec_layer.toGeoJSON();
  var new_vec_coords = new_vec_JSON.geometry.coordinates[0];
  var new_merge_coords = polyanno_calculate_new_merge_shape(old_shape_coords, new_vec_coords, merge_array);
  var concavity_check = check_for_concavity(new_merge_coords);

  var tempGeoJSON = old_shape_JSON;
  if (isUseless(tempGeoJSON.properties)) {  tempGeoJSON.properties = {};  };
  if (!isUseless(concavity_check)) {
    tempGeoJSON.properties.OCD = concavity_check;
  };
  tempGeoJSON.properties.transcription = Polyanno.selected.buildingParents.transcriptions;
  tempGeoJSON.properties.translation = Polyanno.selected.buildingParents.translations;
  tempGeoJSON.geometry.coordinates[0] = new_merge_coords;
  tempGeoJSON.properties.children.push(new_vec_layer._leaflet_id);

  temp_merge_shape.removeLayer(temp_shape_layer);

  L.geoJson(tempGeoJSON, 
        { style: {color: "yellow"},
          onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            Polyanno.selected.buildingParents.parent.vector = layer
          }
        }).addTo(polyanno_map);
  temp_merge_shape.bringToBack();
};

var polyanno_add_first_merge_shape = function(shape_to_copy) {

  var shapeGeoJSON = shape_to_copy.toGeoJSON();
  var tempGeoJSON = {  
    "type": "Feature",  
    "properties":{   
      "children": [shape_to_copy._leaflet_id],
      "transcription": Polyanno.selected.buildingParents.transcriptions,
      "translation": Polyanno.selected.buildingParents.translations    
    },  
    "geometry":{"type": "Polygon", "coordinates": shapeGeoJSON.geometry.coordinates}  
  };
  if ((!isUseless(shapeGeoJSON.properties))&&(!isUseless(shapeGeoJSON.properties.OCD)) ) {
    tempGeoJSON.properties.OCD = shapeGeoJSON.properties.OCD;
  };

  L.geoJson(tempGeoJSON, 
        { style: {color: "yellow"},
          onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            Polyanno.selected.buildingParents.parent.vector = layer
          }
        }).addTo(polyanno_map);
  temp_merge_shape.bringToBack();
};

var polyanno_submit_merge_shape = function() {
  var thisJSON = Polyanno.selected.buildingParents.parent.vector.toGeoJSON();
  var submitted_layer_id;
  L.geoJson(thisJSON, 
        { style: {color: Polyanno.colours.default.vector},
          onEachFeature: function (feature, layer) {
            allDrawnItems.addLayer(layer),
            submitted_layer_id = layer._leaflet_id,
            layer.bringToBack()
          }
        }).addTo(polyanno_map);
  temp_merge_shape.removeLayer(Polyanno.selected.buildingParents.parent.vector);  
  var submitted_layer = allDrawnItems.getLayer(submitted_layer_id);
  return submitted_layer;    
};

var polyanno_posted_merge_shape = function(vector_id) {
  polyanno_new_annos_via_linking(vector_id);
  polyanno_closing_merging();
};

var polyanno_remove_merge_shape = function(vec_removed, merge_shape) {
  var old_shape_JSON = merge_shape.toGeoJSON();
  var removing_shape_JSON = vec_removed.toGeoJSON();
  var old_coords = old_shape_JSON.geometry.coordinates[0];
  var removing_coords = removing_shape_JSON.geometry.coordinates[0];
  var new_coords = [];
  for (var i=0; i<old_coords.length; i++) {
    var this_vertex = old_coords[i];
    if (!removing_coords.includes(this_vertex)) {
      new_coords.push(this_vertex);
    };
  };
  if (removing_coords.includes(old_coords[0])) {
    var new_start = new_coords.splice(0,1);
    new_coords.push(new_start);
  };
  var new_shape = old_shape_JSON;
  new_shape.geometry.coordinates[0] = new_coords;

  ///replace with setLatLngs method??

  temp_merge_shape.removeLayer(merge_shape);

  L.geoJson(new_shape, 
        { style: {color: "yellow"},
          onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            Polyanno.selected.buildingParents.parent.vector = layer
          }
        }).addTo(polyanno_map);
  temp_merge_shape.bringToBack();

};

var polyanno_add_merge_numbers = function(new_vec, merge_array) {
  var the_number_label = "<span> "+merge_array.length+"</span>";
  var the_number_label_options = {
    direction: "center",
    permanent: true
  };

  new_vec.bindTooltip(the_number_label, the_number_label_options);
};

var polyanno_remove_merge_number = function(vec_removed, merge_array, array_index) {
  vec_removed.unbindTooltip();
  var affected_array = merge_array.splice(array_index+1);
  for (var i=0; i < affected_array.length; i++) {
    var this_vec = merge_array[i];
    var the_number_label = "<span> "+(i-1)+"</span>";
    this_vec.setTooltipContent(the_number_label);
  };
};

var polyanno_closing_merging = function() {
  for (var i=0; i < Polyanno.selected.buildingParents.vectors.length; i++) {
    Polyanno.selected.buildingParents.vectors[i].unbindTooltip();
  };
  Polyanno.selected.buildingParents.parent.vector = false;
  Polyanno.selected.buildingParents.transcriptions = [];
  Polyanno.selected.buildingParents.translations = [];
  Polyanno.selected.buildingParents.vectors = [];
  $(".leaflet-draw-toolbar-top").css("color", "#333");
  $(".annoPopup").css("opacity", 1.0);
  $(".polyanno-merging-buttons").toggle("swing");
  var transcription_id = $("#polyanno_merging_transcription").closest(".annoPopup").attr("id");
  var translation_id = $("#polyanno_merging_translation").closest(".annoPopup").attr("id");
  dragondrop_remove_pop(transcription_id);
  dragondrop_remove_pop(translation_id);

};





////merging annos





var polyanno_create_merging_anno_span = function(this_json, text_type) {
  var this_display_id = "#polyanno_merging_"+text_type;
  var old_text = $(this_display_id).html();
  var new_frag_id = Math.random().toString().substring(2);
  var this_class = text_type.concat("-text");
  var the_new_span = "<a class='" + newSpanClass(this_class) + " ' id='" + new_frag_id + "' >" + this_json.text + "</a>";
  var new_text = old_text.concat(the_new_span);
  $(this_display_id).html(new_text);
  alert("the new transcription to merge is "+new_text);
  return new_text; 
};

var polyanno_load_merging_anno = function(new_vec, text_type) {
  var this_id = new_vec.properties[text_type]; 
  var this_json = getTargetJSON(this_json);
  var new_fragment = polyanno_create_merging_anno_span(this_json, text_type);
  var new_json = this_json;
  new_json.text = new_fragment;
  return new_json;
};

var polyanno_add_merge_annos = function(new_vec) {
  if (isUseless(new_vec.feature.properties)) { 
    new_vec.feature.properties = {}; 
  };
  if (!isUseless(new_vec.feature.properties.transcription)) { 
    var new_frag = polyanno_load_merging_anno(new_vec.feature, "transcription");
    Polyanno.selected.buildingParents.transcriptions.push(new_frag);
  }
  else {

  };

  if (!isUseless(new_vec.feature.properties.translation)) { 
    var new_frag = polyanno_load_merging_anno(new_vec.feature, "translation");
    Polyanno.selected.buildingParents.translations.push(new_frag);
  }
  else {

  };
  return [Polyanno.selected.buildingParents.transcriptions, Polyanno.selected.buildingParents.translations];
};

var polyanno_extracting_merged_anno = function(text_type, children_array, this_id) {
  var this_child_array = $.grep(children_array, function(item, index){
    var this_fragment_obj = $.grep(item.fragments, function(this_frag, this_index){
      return this_frag.id == this_id;
    });
    return item.fragments == this_fragment_obj[0];
  });
  var this_child = this_child_array[0];
  var this_frag_dom = document.getElementById(this_child.id);
  var the_display_dom = document.getElementById("polyanno_merging_"+text_type);
  the_display_dom.removeChild(this_frag_dom);
  var the_array_index = children_array.indexOf(this_child);
  return the_array_index;
};

var polyanno_remove_merge_annos = function(vec_removed_layer) {
  var vec_removed = vec_removed_layer.toGeoJSON();
  if ((!isUseless(vec_removed.properties))&&(!isUseless(vec_removed.properties.transcription))) { 
    var the_index = polyanno_extracting_merged_anno("transcription", Polyanno.selected.buildingParents.transcriptions, vec_removed.properties.transcription);
    Polyanno.selected.buildingParents.transcriptions.slice(the_index, 1);
  };
  if ((!isUseless(vec_removed.properties))&&(!isUseless(vec_removed.properties.translation))) { 
    var the_index = polyanno_extracting_merged_anno("translation", Polyanno.selected.buildingParents.translations, vec_removed.properties.translation);
    Polyanno.selected.buildingParents.translations.slice(the_index, 1);
  };
};











//////IIIF

var generateIIIFregion = function(coordinates) {

  ///need to allow polygon encoding in IIIF regions

    /*

    NOTE ABOUT COORDINATES

    + Leaflet Simple CRS has (0,0) in top left corner 
    + GeoJSON coordinates go clockwise from bottom left
    + IIIF has downwards +y axis
    _____________________  
    |*-----> x          |           
    ||                  |           [2] ---> [3] 
    |v                  |            ^        |
    |-y                 |            |        v
    |                   |           [1] <--- [4]
    |    L.CRS.Simple   |
    |                   |        GeoJSON Coordinates
    |                   | 
    |                   | 
    ---------------------    

    */
    var xy1 = coordinates[0];
    var xy2 = coordinates[1];
    var xy3 = coordinates[3];

    var x = xy2[0];
    var y = -xy2[1];
    var w = xy3[0] - xy2[0];
    var h = xy2[1] - xy1[1];
    var paramURL = x.toString() + "," + y.toString() + "," + w.toString() + "," + h.toString() + "/full/0/default";

    return paramURL;
};

var polyanno_make_rectangular_outer = function(coordinates){
  var left = coordinates[0][0];
  var right = coordinates[0][0];
  var top = coordinates[0][1];
  var bottom = coordinates[0][1];
  for (var i=0; i <coordinates.length; i++) {
    var this_x = coordinates[i][0];
    var this_y = coordinates[i][1];
    if (this_x < left) {  left = this_x   }
    else if (this_x > right) {  right = this_x   }
    else if (this_y < bottom) {  bottom = this_y   }
    else if (this_y > top) {  top = this_y   };
  };
  return [[left, bottom],[left, top],[right, top],[right, bottom],[left, bottom]];
};

var getIIIFsectionURL = function (imageJSON, coordinates, format) {

    var imagewithoutinfo = imageJSON.split("info.json",1);
    var imagewithoutinfoURL = imagewithoutinfo[0];

    //use the IIIF Image Section API somehow??
    var rect = polyanno_make_rectangular_outer(coordinates);

    var regionParams = generateIIIFregion(rect);
    var theURL = imagewithoutinfoURL.concat(regionParams + "." + format);

    return theURL;
};

/////LUNA IIIF DATA

var polyanno_findLUNAimage_title = function(IIIFmetadata) {
  var polyanno_searchingIIIF = $.grep(IIIFmetadata, function(e){ 
      if (!isUseless(e.label)) {
        return e.label == "Repro Title"; 
      }
      else {
        return false;
      };
  });
    if (!isUseless(polyanno_searchingIIIF)) {
      return polyanno_searchingIIIF[0].value;
    }
    else {
      return " ";
    };
};
var polyanno_findLUNAimage_description = function(IIIFmetadata) {
  var polyanno_searchingIIIF = $.grep(IIIFmetadata, function(e){ 
      if (!isUseless(e.label)) {
        return e.label == "Description"; 
      }
      else {
        return false;
      };
  });
    if (!isUseless(polyanno_searchingIIIF)) {
      return polyanno_searchingIIIF[0].value;
    }
    else {
      return " ";
    };
};












////INITIALISING AND SETUPS

///text selection

var polyanno_open_existing_text_transcription_menu = function() {

  var selection = getSelected(); 

  ///////

  Polyanno.editors.ifOpen("transcription");
  Polyanno.selected.textHighlighting.parentDOM.popover('hide'); ////
};

var polyanno_open_existing_text_translation_menu = function() {

  ///not sure entirely about synchronicity of this but meh
  Polyanno.selected.reset();

  var selection = getSelected(); 
  var classCheck = selection.anchorNode.parentElement.className;

  Polyanno.selected.transcription.DOMid = Polyanno.selected.textHighlighting.parentDOM.attr("id");
  if (  !isUseless(Polyanno.selected.textHighlighting.parentDOM.parent().attr('id')) ){
    Polyanno.selected.transcription.parent = Polyanno.urls.translation + Polyanno.selected.textHighlighting.parentDOM.parent().attr('id'); 
  };
  Polyanno.selected.transcription.URI = Polyanno.selected.transcription.parent.concat("#"+Polyanno.selected.transcription.DOMid);
  Polyanno.editors.ifOpen("translation");
  Polyanno.selected.textHighlighting.parentDOM.popover('hide'); ////
};

$('#polyanno-page-body').on("mouseup", '.content-area', function(event) {

  var selection = getSelected(); 
  var classCheck;
  if (!isUseless(selection) || !isUseless(selection.anchorNode.parentElement) ) {
    classCheck = selection.anchorNode.parentElement.className;
  };

  if ((classCheck.includes('openTranscriptionMenuOld'))||(classCheck.includes('openTranslationMenuOld')) ) { 
  //if it is a popover within the selection rather than the text itself



  }    
  else if (classCheck.includes('popover-title')) { 
    Polyanno.selected.textHighlighting.parentDOM.popover('hide'); ///
  } 
  else if (classCheck.includes("polyanno-add-discuss")) {
    ////need to sort out Hypothesis code here
    if (Polyanno.selected.textHighlighting.parentDOM.hasClass("annotator-hl")) {

    }
    else {
      var thisSpanText = Polyanno.selected.textHighlighting.parentDOM.html().toString();
      new TextQuoteAnchor(Polyanno.selected.textHighlighting.parentDOM, thisSpanText);
    };
  }
  else {
    setNewTextVariables(selection, classCheck);
  };
});



/////////LEAFLET SETUP

var polyanno_leaflet_basic_setup = function() {
  popupVectorMenu = L.popup()
      .setContent(popupVectorMenuHTML); /////

  polyanno_map = L.map('polyanno_map');
  polyanno_map.options.crs = L.CRS.Simple;
  polyanno_map.setView(
    [0, 0], //centre coordinates
    0 //zoom needs to vary according to size of object in viewer but whatever
  );
  polyanno_map.options.crs = L.CRS.Simple;

  baseLayer = L.tileLayer.iiif(imageSelected);

  polyanno_map.addLayer(baseLayer);

  polyanno_map.addLayer(temp_merge_shape);

  polyanno_map.addLayer(allDrawnItems);

  new L.Control.Draw(controlOptions).addTo(polyanno_map); //

  polyanno_map.whenReady(function(){
    mapset = true;
    polyanno_annos_of_target(imageSelected, "vector", polyanno_load_existing_vectors);
    polyanno_creating_vec();
    polyanno_vec_select();
    polyanno_vector_edit_setup();
    //polyanno_leaflet_merge_toolbar_setup(); - until debugged properly this functionality is loading through a the polyanno toolbar instead
    polyanno_leaflet_merge_polyanno_button_setup();
  });
};

//load the existing vectors
var polyanno_load_existing_vectors = function(existingVectors) {

  var tempGeoJSON = {  "type": "Feature",  "properties":{},  "geometry":{}  };
  var currentVectorLayers = {};

  ///need to make sure that the layers load in the correct order so that the children are always on top of their parents

  if (!isUseless(existingVectors) && !isUseless(existingVectors[0])) {
    existingVectors.forEach(function(vector) {

      var oldData = tempGeoJSON;
      oldData.geometry.type = vector.notFeature.notGeometry.notType;
      oldData.geometry.coordinates = [vector.notFeature.notGeometry.notCoordinates];
      oldData.properties.transcription = findField(vector, "transcription");
      oldData.properties.translation = findField(vector, "translation");
      oldData.properties.parent = findField(vector, "parent");
      oldData.properties.children = findField(vector, "children");
      oldData.properties.OCD = findField(vector, "OCD");

      var existingVectorFeature = L.geoJson(oldData, 
        { style: {
            color: Polyanno.colours.default.vector
          },
          onEachFeature: function (feature, layer) {
            layer._leaflet_id = vector.id,
            allDrawnItems.addLayer(layer),
            layer.bindPopup(popupVectorMenu)
          }
        }).addTo(polyanno_map);

    });
  };
};

var polyanno_new_vector_made = function(layer, shape, vector_parent, vector_children, callback_function, fromMerge) {
  var annoData = {geometry: shape.geometry, metadata: imageSelectedMetadata, parent: vector_parent, children: vector_children };

  if (!isUseless(shape.properties)&&(!isUseless(shape.properties.OCD))) {  annoData.OCD = shape.properties.OCD;  };

  if (Polyanno.selected.connectingEquals.status) { 
    var theTopText = findHighestRankingChild(Polyanno.selected.connectingEquals.parent_anno, Polyanno.selected.transcription.DOMid);
    annoData[Polyanno.selected.connectingEquals.type] = theTopText;  
  }
  else if (fromMerge){
    annoData.transcription = shape.properties.transcription;
    annoData.translation = shape.properties.translation;
  }
  else {
    ///not sure entirely about synchronicity of this but meh
    Polyanno.selected.reset();
  };

  var targetData = {target: [], body: {}};
  var IIIFsection = getIIIFsectionURL(imageSelected, shape.geometry.coordinates[0], "jpg");
  targetData.target.push({
      "id": imageSelected,
      "format": "application/json"
  });
  targetData.target.push({
      "id": IIIFsection,
      "format": "image/jpg" 
  });

  //Objects

  var data = new Polyanno.vector(annoData);
  Polyanno.vectors.add(data);

  targetData.body = data;
  var new_anno = new Polyanno.annotation(targetData);
  Polyanno.annotations.add(new_anno);

  Polyanno.selected.vectors.add(data);
  Polyanno.selected.targets = targetData.target.concat([{"id": data.id, "format": "image/SVG"}]);

  //Leaflet

  layer._leaflet_id = data.id;

  if (!Polyanno.selected.connectingEquals.status) { layer.bindPopup(popupVectorMenu).openPopup(); }
  else {  updateVectorSelection(data); };

  if (!isUseless(callback_function)) {  callback_function(data.id);  };


};

var polyanno_linking_annos_to_vector_checks = function(layer) {
  var shape = layer.toGeoJSON();
  var checkingOverlapping = check_this_shape_for_overlapping(shape, allDrawnItems, false, true, false); //don't complete children array, do complete parent array
  allDrawnItems.addLayer(layer);
  if ((checkingOverlapping[0] == 2) && (checkingOverlapping[1].includes(Polyanno.selected.connectingEquals.parent_vector))) {  ///inside the correct vector
    layer.bindPopup(Polyanno.HTML.popups.connectingEquals).openPopup();
  }
  else { 
    alert("Please draw inside the correct larger shape!");
    polyanno_map.fitBounds(Polyanno.selected.connectingEquals.parent_vector.toGeoJSON().geometry.coordinates[0]);
  };
};

var polyanno_creating_vec = function() {
  polyanno_map.on(L.Draw.Event.CREATED, function(evt) {

    ////assuming not triggered event when the merge shape is added manually

    var layer = evt.layer;

    if (Polyanno.selected.connectingEquals.status)   {      ///drawing a new vector for a smaller text fragment
      polyanno_linking_annos_to_vector_checks(layer);
    }
    else {
      var shape = layer.toGeoJSON();
      //[number, shape_array]
      //where number: 0 = no overlap, 1 = overlap, 2 = shape_array is parent, 3 = shape_array is children
      var checkingOverlapping = check_this_shape_for_overlapping(shape, allDrawnItems, false, false, false);
      allDrawnItems.addLayer(layer);

      ///////just overlapping with shapes - never acceptable practice tsk!
      if (checkingOverlapping[0] == 1) {  
        alert("You cannot draw overlapping shapes.");
        allDrawnItems.removeLayer(layer);
      }
      ///////inside another shape but not whilst Polyanno.selected.connectingEquals
      else if (checkingOverlapping[0] == 2)  {   
        allDrawnItems.removeLayer(layer);
        Polyanno.selected.vector.id = checkingOverlapping[1][0];
        alert("Highlight the text first and then draw a smaller shape for it.");
        //open the relevant parent editor and make it glow??
      }
      ////containing other smaller shapes but not actually merging in order
      else if (checkingOverlapping[0] == 3)  {      
        allDrawnItems.removeLayer(layer);
        alert("Link these shapes in order please!");
        //make #polyanno-merge-shapes-enable glow
        $("#polyanno-merge-shapes-enable").effect("highlight");
      }

      else {
        var concavity_check = check_for_concavity(shape.geometry.coordinates[0]);
        if (concavity_check != false) {  layer.properties.OCD = concavity_check;  };
        polyanno_new_vector_made(layer, shape);
      };
    };

  });
};

var polyanno_vec_select = function() {

  polyanno_map.on('draw:deletestart', function(){

    Polyanno.selected.currentlyDeleting = true;
    ///check if vector has any annotations
    ///if it does then prevent deleting and alert that it has annotations and admin privileges needed to do that
    var theURL = Polyanno.urls.annotation +"/target/" + vector_url;
    /*
    $.ajax({
      type: "GET",
      dataType: "json",
      url: theURL,
      async: false,
      success: 
        function (data) {
          if (data) {
            alert("Sorry you need admin rights to delete vectors with annotations. Please discuss the deletion of this in the commentary box for further information.");
            ///prevent deleting
          }
          else {
            ///enable delete completion
          };
        }
    });
    */
  });
  polyanno_map.on('draw:deletestop', function(){
    Polyanno.selected.currentlyDeleting = false;
  });
  polyanno_map.on('draw:editstart', function(){
    Polyanno.selected.currentlyEditing = true;
  });
  polyanno_map.on('draw:editstop', function(){
    Polyanno.selected.currentlyEditing = false;
  });

  allDrawnItems.on('click', function(vec) {

    Polyanno.selected.vector.id = vec.layer._leaflet_id;
    if((!isUseless(vec.layer.properties)) && (!isUseless(vec.layer.properties.parent))){
      Polyanno.selected.vector.parent = vec.layer.properties.parent;
    };

    if (Polyanno.selected.currentlyEditing || Polyanno.selected.currentlyDeleting) {}
    else if (Polyanno.selected.connectingEquals.status) {  
      vec.layer.closePopup();
      alert("Draw a new shape around the text on the image!");
      polyanno_map.fitBounds(Polyanno.selected.connectingEquals.parent_vector.toGeoJSON().geometry.coordinates[0]);
      $(".leaflet-draw-toolbar-top").effect("highlight");
    }
    else if (Polyanno.selected.buildingParents.status) {
      ///need to introduce parents checks??
      vec.layer.closePopup();
      if (Polyanno.selected.buildingParents.vectors.includes(vec.layer)) {
        //unclick and remove this vector
        var the_index = Polyanno.selected.buildingParents.vectors.indexOf(vec.layer);
        polyanno_remove_merge_number(vec.layer, Polyanno.selected.buildingParents.vectors, the_index);
        Polyanno.selected.buildingParents.vectors.splice(the_index, 1);
        polyanno_remove_merge_annos(vec.layer);
        polyanno_remove_merge_shape(vec.layer, Polyanno.selected.buildingParents.parent.vector);
      }
      else if (Polyanno.selected.buildingParents.parent.vector != false) {
        //click and merge this vector
        Polyanno.selected.buildingParents.vectors.push(vec.layer);
        polyanno_add_merge_annos(vec.layer);
        polyanno_update_merge_shape(Polyanno.selected.buildingParents.parent.vector, vec.layer, Polyanno.selected.buildingParents.vectors);
        polyanno_add_merge_numbers(vec.layer, Polyanno.selected.buildingParents.vectors);
      }
      else {
        //click and start the new merge shape
        Polyanno.selected.buildingParents.vectors.push(vec.layer);
        polyanno_add_merge_annos(vec.layer);
        polyanno_add_first_merge_shape(vec.layer);
        polyanno_add_merge_numbers(vec.layer, Polyanno.selected.buildingParents.vectors);
      };
    }
    else {  vec.layer.openPopup();  };

  });

};

var polyanno_vector_edit_setup = function() {
  //////update DB whenever vector coordinates are changed
  allDrawnItems.on('edit', function(vec){
    var shape = vec.layer.toGeoJSON();
    /////
    updateAnno(Polyanno.selected.vector.id, shape); ////////////
    /////
  });
};


var polyanno_leaflet_merge_polyanno_button_setup = function() {

  $("#polyanno-merge-shapes-enable").on("click", function(event){
      Polyanno.selected.buildingParents.status = true;
      ///add class "active" to button to stay pressed??
      var this_transcription_display = add_dragondrop_pop("polyanno_merging_annos", Polyanno.HTML.buildingParents.Transcriptions, "polyanno-page-body", true, null, true);
      var this_translation_display = add_dragondrop_pop("polyanno_merging_annos", Polyanno.HTML.buildingParents.Translations, "polyanno-page-body", true, null, true);
      ///need to set highlighted display??
      $(".polyanno-merging-buttons").toggle("swing");
      $(".leaflet-draw-toolbar-top").css("color", "yellow");
      $(".annoPopup").css("opacity", 0.3);
      $("#imageViewer").css("opacity", 1.0).addClass("flex-first");
  });


  $(".polyanno-merge-shapes-submit-btn").on("click", function (event) {
    if (Polyanno.selected.buildingParents.vectors.length > 1) {
      var layer = polyanno_submit_merge_shape();
      var shape = layer.toGeoJSON(); 
      var the_children_array;
      for (var i=0; i < Polyanno.selected.buildingParents.vectors; i++) {
        var this_json = Polyanno.selected.buildingParents.vectors[i].toGeoJSON();
        the_children_array.push(this_json);
      };
      polyanno_new_vector_made(layer, shape, false, the_children_array, polyanno_posted_merge_shape, true); //layer, shape, parent, children, callback, fromMerge
    }
    else {
      temp_merge_shape.removeLayer(Polyanno.selected.buildingParents.parent.vector);
      polyanno_closing_merging();
    };
  }); 

  $(".polyanno-merge-shapes-cancel-btn").on("click", function(event){
      polyanno_closing_merging();
  });

};


////alltheunicode

$('#polyanno-page-body').on("click", '.newAnnotation', function(event) {

  atu_the_input = $(this);
  //change the text input area that the IME conversions are using to this one
  atu_initialise_IMEs($(this));

});

$("#polyanno-top-bar").on("click", ".polyanno-add-keyboard", function(event){
    var dragon_opts = {
      "minimise": true,
      "initialise_min_bar": false
    };
    addKeyboard(dragon_opts, false);
});

////HIGHLIGHTING
var polyanno_setup_highlighting = function() {

  $('#polyanno-page-body').on("mouseenter", ".textEditorBox", function(event){

    var thisEditorDOM = $(event.target).closest(".textEditorPopup");
    var id = thisEditorDOM.attr("id");
    var thisEditor = Polyanno.editors.getById(id);
    thisEditor.setSelected();

    Polyanno.colours.connectColours(thisEditor, "editor", "highlight");

    thisEditorDOM.on("mouseover", ".opentranscriptionChildrenPopup", function(event){
      var thisSpan = $(event.target);
      Polyanno.colours.connectColours(thisEditor, "editor", "default");
      Polyanno.colours.connectColours(thisSpan, "span", "highlight");
    });

    thisEditorDOM.on("mouseout", ".opentranscriptionChildrenPopup", function(event){
      var thisSpan = $(event.target);
      Polyanno.colours.connectColours(thisSpan, "span", "default");
      Polyanno.colours.connectColours(thisEditor, "editor", "highlight");
    });  

  });

  $('#polyanno-page-body').on("mouseleave", ".textEditorBox", function(event){

    Polyanno.selected.reset();
    var thisEditorDOM = $(event.target).closest(".textEditorPopup");
    var id = thisEditorDOM.attr("id");
    var thisEditor = Polyanno.editors.getById(id);

    Polyanno.colours.connectColours(thisEditor, "editor", "default");
  });

  allDrawnItems.on('mousenter', function(vec) {
    Polyanno.colours.connectColours(vec.layer._leaflet_id, "vector", "highlight");
  });
  allDrawnItems.on('mouseleave', function(vec) {
    Polyanno.colours.connectColours(vec.layer._leaflet_id, "vector", "default");
  });

};

/////////////

var polyanno_setup_storage_fields = function(opts) {
  Polyanno.urls = {
    "vector": websiteAddress.concat("/api/vectors/"),
    "transcription": websiteAddress.concat("/api/transcriptions/"),
    "translation": websiteAddress.concat("/api/translations/"),
    "annotation": websiteAddress.concat("/api/annotations/")
  };
  if (!isUseless(opts)) {
    if (!isUseless(opts.transcription)) { Polyanno.urls.transcription = opts.transcription; };
    if (!isUseless(opts.translation)) { Polyanno.urls.translation = opts.translation; };
    if (!isUseless(opts.vector)) { Polyanno.urls.vector = opts.vector; };
    if (!isUseless(opts.annotation)) { Polyanno.urls.annotation = opts.annotation; };
  };
};

var polyanno_setup_storage = function(opts) {
  
  if ( (!isUseless(opts)) && (!isUseless(opts.base_url)) ) {
    websiteAddress = opts.base_url;
    polyanno_setup_storage_fields(opts);
  }
  else {
    websiteAddress = "http://"+window.location.host;
    polyanno_setup_storage_fields(opts);
  };

};

var polyanno_setup_voting = function() {

  $('#polyanno-page-body').on("click", '.votingUpButton', function(event) {
    var votedID = $(event.target).closest(".polyanno-text-display").find("p").attr("id");
    var currentTopText = $(event.target).closest(".textEditorPopup").find(".polyanno-top-voted").find("p").html();
    var thisEditorID = $(event.target).closest(".textEditorPopup").attr("id");
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();
    votingFunction("up", votedID, thisEditor);
  });
};

var polyanno_setup_editor_events = function() {
  var the_tags_html = "<div class='row'>";
  $('.polyanno-image-metadata-tags-btn').on("click", function(event){
    var tagHTML1 = "<a class='polyanno-tag' >";
    var tagHTML2 = "</a>";
    if (!isUseless(imageSelectedMetadata)) {
      var polyanno_searching = $.grep(imageSelectedMetadata, function(e){ 
          if (!isUseless(e.label)) {  return e.label == "Tag";   };
      });
      polyanno_searching.forEach(function(theTagSpan){
        var polyannoTagHTML = tagHTML1 + theTagSpan + tagHTML2;
        the_tags_html.concat(polyannoTagHTML);
      });
    };
    the_tags_html.concat("</div>");
    add_dragondrop_pop("polyanno-image-tags-pop", the_tags_html, "polyanno-page-body", true);
  });

  $('#polyanno-page-body').on("click", '.addAnnotationSubmit', function(event) {
    var thisEditorID = $(event.target).closest(".annoPopup").attr("id"); 
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();
    polyanno_new_anno_via_text_box(thisEditor);
  });

  $('#polyanno-page-body').on("click", ".closePopoverMenuBtn", function(){
    $(event.target).closest(".popover").popover("hide"); ///////
  });

  $('#polyanno-page-body').on("click", ".polyanno-add-new-toggle-row", function(event){
    var this_add_new_row = $(this).closest(".textEditorPopup").find(".polyanno-add-new-row");
    if (this_add_new_row.css("display") == "none") {
      this_add_new_row.css("display", "block");
    }
    else {
      this_add_new_row.css("display", "none");
    };
  });

  $('#polyanno-page-body').on("click", ".polyanno-alternatives-toggle-row", function(event){
    var this_alternatives_row = $(this).closest(".textEditorPopup").find(".polyanno-list-alternatives-row");
    if (this_alternatives_row.css("display") == "none") {
      this_alternatives_row.css("display", "block");
    }
    else {
      this_alternatives_row.css("display", "none");
    };
  });

  $('#polyanno-page-body').on("click", ".polyannoLinkVectorBtn", function(){
    var thisEditorID = $(event.target).closest(".textEditorPopup").attr("id"); 
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();
    var parent_vector_id = checkForVectorTarget(parent_anno);
    var the_parent_vector = allDrawnItems.getLayer(parent_vector_id);
    Polyanno.selected.connectingEquals = {
      status: true,
      siblings: Polyanno.selected.transcriptions,
      parent_anno : Polyanno.selected.transcriptions[0].parent,
      parent_vector : the_parent_vector
    };
    polyanno_map.fitBounds(Polyanno.selected.connectingEquals.parent_vector.toGeoJSON().geometry.coordinates[0]);
    Polyanno.colours.highlightThis.vector(parent_vector_id, "yellow");
    var highlight_drawing_tools = $(".leaflet-draw-toolbar-top").effect("highlight");
    $("#"+thisEditor).transfer({
      to: $(".leaflet-draw-toolbar-top")
    }, highlight_drawing_tools);

    ///need to enable some kind of cancelling option, preferably within Leaflet itself

  });

  $("#polyanno-page-body").on("click", ".polyanno-options-dropdown-toggle", function(event){
      var theOptionRows = $(this).closest(".textEditorPopup").find(".polyanno-options-row");
      var theHandlebar = $(this).closest(".textEditorPopup").find(".popupBoxHandlebar");
      if (theOptionRows.css("display") == "none") {
        theOptionRows.css("display", "block");
        theHandlebar.css("border-radius", "5px 5px 0px 0px");
      }
      else {
        theOptionRows.css("display", "none");
        theHandlebar.css("border-radius", "5px");
      };
  });

  $("#polyanno-page-body").on("click", ".polyanno-metadata-tags-btn", function(event){
      var theTagsRow = $(this).closest(".textEditorPopup").find(".polyanno-metadata-tags-row");
      if (theTagsRow.css("display") == "none") {
        theTagsRow.css("display", "block");
      }
      else {
        theTagsRow.css("display", "none");
      };
  });

};



////SETUP

var polyanno_setup = function(opts) {

  if (opts.minimising == false) {  polyanno_minimising = false;  };

  document.getElementById("polyanno-top-bar").innerHTML = polyanno_top_bar_HTML;
  if (document.getElementById("polyanno-top-bar").innerHTML == polyanno_top_bar_HTML) {
    addIMEs(true, true, true);
  };

  ///this is currently compulsory and synchronous but should use a local storage in parallel soon too like Leaflet Draw?
  polyanno_setup_storage(opts.storage);

  if (!isUseless(opts.highlighting)) {  polyanno_setup_highlighting();  };

  if (!isUseless(opts.editor_options)) {  polyannoEditorHTML_options = polyannoEditorHTML_options_partone + opts.editor_options + polyannoEditorHTML_options_parttwo; };

  //var polyanno_image_title = polyanno_findLUNAimage_title(imageSelectedMetadata);
  var polyanno_image_title_HTML = "<span class='glyphicon glyphicon-picture'></span>";//"<span>"+polyanno_image_title()+"</span>";

  //will this induce synchronicity problems?
  $("#polyanno-page-body").addClass("row atu-keyboard-parent");

  var image_viewer_id = add_dragondrop_pop( "polyanno-image-box", polyanno_image_viewer_HTML , "polyanno-page-body", polyanno_minimising, polyanno_image_title_HTML, true );
  $(image_viewer_id).show("fold");
  $(image_viewer_id).attr("id", "imageViewer");

  polyanno_leaflet_basic_setup();

  initialise_dragondrop("polyanno-page-body", {"minimise": polyanno_minimising });

  polyanno_setup_editor_events();

};


