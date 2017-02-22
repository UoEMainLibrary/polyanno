
/////GLOBAL VARIABLES

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);

var websiteAddress;
var polyanno_urls = {};

var polyanno_minimising = true;

var polyanno_current_username;

var polyanno_voting = true;
var polyanno_transcription = true;
var polyanno_translation = true;

var imageSelected; //info.json format URL
var imageSelectedMetadata = []; ////???

var vectorSelected = ""; //API URL
var vectorSelectedParent; //API URL
var currentCoords;

var polyanno_text_selected = ""; //API URL
var polyanno_text_selectedParent = ""; //API URL
var polyanno_text_selectedID; //DOM id
var polyanno_text_selectedHash; //parent API URL + ID
var polyanno_text_selectedFragment; //HTML Selection Object
var polyanno_text_type_selected = "";

//URLs
var targetSelected; //array
var targetType = ""; 
var childrenArray;

///[editor, vector, span] colours
var polyanno_highlight_colours_array = ["#EC0028","#EC0028","#EC0028"];
var polyanno_default_colours_array = ["buttonface","#03f","transparent"]; 

var editorsOpen = []; //those targets currently open in editors
var selectingVector = false; //used to indicate if the user is currently searching for a vector to link or not
var findingcookies = document.cookie;

var $langSelector = false;
var $imeSelector = false;

////leaflet

var polyanno_map;
var baseLayer;
var allDrawnItems = new L.FeatureGroup();
var controlOptions = {
    draw: {
        polyline: false,  //disables the polyline and marker feature as this is unnecessary for annotation of text as it cannot enclose it
        marker: false,
        //polygon: false,
        //circle: false
    },
    edit: {
        featureGroup: allDrawnItems, //passes draw controlOptions to the FeatureGroup of editable layers
    }
};

var popupVectorMenu;
    
//to track when editing
var currentlyEditing = false;
var currentlyDeleting = false;

////HTML VARIABLES

var polyanno_top_bar_HTML = `
  <div class="col-md-6 polyanno-bar-buttons">

    <div class="row">

      <div class="btn-group polyanno-language-buttons" role="group" aria-label="...">

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

      <div class="dropdown polyanno-other-button">

        <button class="btn btn-default " type="button" id="polyanno-bar-other-buttons">
          <span> ... </span>
          <span class="caret"></span>
        </button>

        <ul class="dropdown-menu" aria-labelledby="polyanno-bar-other-buttons">
            <li>
            <div class="btn-group polyanno-options-buttons" role="group" aria-label="...">
              <button class="btn btn-default polyanno-metadata-btn"><span class="glyphicon glyphicon-tags"></span></button>
              <button class="btn btn-default polyanno-export-text" type="button"><span class="glyphicon glyphicon-save"></span></button> <!--export as txt or PDF??-->
              <button class="btn btn-default polyanno-social" type="button"><span class="glyphicon glyphicon-share"></span></button> <!-- social media sharing-->
              <button class="btn btn-default polyanno-report" type="button"><span class="glyphicon glyphicon-exclamation-sign"></span><!--report inappropriate content--></button>
            </div>
            </li>
        </ul>

      </div>

    </div>

  </div>

  <div class="col-md-6 dragondrop-min-bar">

  </div>

`;


var openHTML = "<div class='popupAnnoMenu'>";
var transcriptionOpenHTML = `<a class="openTranscriptionMenu btn btn-default" onclick="checkEditorsOpen('vector', 'transcription');
      polyanno_map.closePopup();">
      TRANSCRIPTION
      </a><br>`;
var translationOpenHTML = `<a class="openTranslationMenu btn btn-default" onclick="checkEditorsOpen('vector', 'translation');
      polyanno_map.closePopup();">TRANSLATION</a>`;
var endHTML = "</div>";
var popupVectorMenuHTML = openHTML + transcriptionOpenHTML + translationOpenHTML + endHTML;


var polyanno_image_viewer_HTML = `<div id='polyanno_map' class="row"></div>`;

var addNewAnnoHTML = `<div class='item addNewItem row'> 
                        <div class='addNewContainer col-md-12'> 
                          <textarea id='testingKeys' class='newAnnotation row' placeholder='Add new annotation text here'></textarea><br>
                          <button type='button' class='btn addAnnotationSubmit row'>Submit <span class='glyphicon glyphicon-ok'></span></button>  
                        </div> 
                      </div>`;
var voteButtonsHTML = `<div class='row polyanno-below-anno-well' >
                        <button type='button' class='btn btn-default voteBtn votingUpButton'>
                          <span class='glyphicon glyphicon-thumbs-up' aria-hidden='true' ></span>
                        </button>
                        <button type='button' class='btn btn-default votesUpBadge'>
                          <span class='badge'></span>
                        </button>
                      </div>`;
var closeButtonHTML = `<span class='closePopoverMenuBtn glyphicon glyphicon-remove'></span>`;
var linkButtonHTML = `<button type='button' class='btn linkBtn'>
                        <span class="glyphicon glyphicon-picture"></span>
                      </button>`;

var transcriptionIconHTML = `<span class='glyphicon glyphicon-edit'></span>
                            <span>Transcription</span>`;
var translationIconHTML = `<span class='glyphicon glyphicon-globe'></span>
                            <span>Translation</span>`;
var popupLinkVectorMenuHTML = `
  <!-- Link Vector Popup Menu -->
  <div id="popupLinkVectorMenu" class="popupAnnoMenu">
    <div data-role="main" class="ui-content">
      <p>Create a new one on the image for this text selection</p>
    </div>
  </div>
`;

var popupVectorParentMenuHTML = `
  <!-- Vector Has a Parent Popup Menu -->
  <div id="popupVectorParentMenu" class="popupAnnoMenu">
    <div data-role="main" class="ui-content">
      <p>Please find that area in the relevant parent text</p>
      <a class="openTranscriptionMenuParent editorPopover btn btn-default">PARENT TRANSCRIPTION</a><br>
      <a class="openTranslationMenuParent editorPopover btn btn-default">PARENT TRANSLATION</a>
    </div>
  </div>
`;

var popupTranscriptionNewMenuHTML = `
  <!-- New Transcription Text Select Popup Menu -->
  <div id="popupTranscriptionNewMenu" class="popupAnnoMenu">
     <div data-role="main" class="ui-content">
        <a class="openTranscriptionMenuNew transcriptionTarget editorPopover btn btn-default">ADD NEW TRANSCRIPTION</a></br>
        <a class="polyanno-add-discuss">Discuss</a>
     </div>
  </div>
`;

var popupTranslationNewMenuHTML = `
  <!-- New Translation Text Select Popup Menu -->
  <div id="popupTranslationNewMenu" class="popupAnnoMenu" >
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuNew translationTarget editorPopover ui-btn ui-corner-all ui-shadow ui-btn-inline">ADD NEW TRANSLATION</a>
        <a class="polyanno-add-discuss">Discuss</a>
      </div>
  </div>  
`;

var popupTranscriptionChildrenMenuHTML = `
  <!-- Children Transcription Text Select Popup Menu-->
  <div id="popupTranscriptionChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranscriptionMenuOld editorPopover btn btn-default">VIEW OTHER TRANSCRIPTIONS</a>
        <a class="polyanno-add-discuss">Discuss</a>
      </div>
  </div>
`;
var popupTranslationChildrenMenuHTML = `
  <!-- Children Translation Text Select Popup Menu -->
  <div id="popupTranslationChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuOld editorPopover btn btn-default">VIEW OTHER TRANSLATIONS</a>
        <a class="polyanno-add-discuss">Discuss</a>
      </div>
  </div>
`;

var polyannoFavouriteBtnHTML = `
      <button class="btn col-md-1 polyanno-colour-change dragondrop-handlebar-obj polyanno-favourite">
        <span class="glyphicon glyphicon-star-empty"></span>
      </button>
`;

var polyannoEditorHandlebarHTML = `
      <button class="btn polyanno-options-dropdown-toggle dragondrop-handlebar-obj polyanno-colour-change col-md-2" type="button" >
          <span class="glyphicon glyphicon-cog"></span>
          <span class="caret"></span>
      </button>
`;
var polyannoEditorHTML = `

    <div class="textEditorMainBox row ui-content">
    <div class="col-md-12">

      <div class="row polyanno-options-row">
        <div class="btn-group polyanno-options-buttons" role="group" aria-label="options_buttons">
          <button type="button" class="btn btn-success addNewBtn">
            <span class="glyphicon glyphicon-pencil" ></span> NEW
          </button>
          <button class="btn btn-default polyanno-add-keyboard" type="button"><span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span></button> <!--add keyboard characters-->
          <button class="btn btn-default polyanno-metadata-btn"><span class="glyphicon glyphicon-tags"></span></button>
          <button class="btn btn-default polyanno-export-text" type="button"><span class="glyphicon glyphicon-save"></span></button> <!--export as txt or PDF??-->
          <button class="btn btn-default polyanno-social" type="button"><span class="glyphicon glyphicon-share"></span></button> <!-- social media sharing-->
          <button class="btn btn-default polyanno-report" type="button"><span class="glyphicon glyphicon-exclamation-sign"></span><!--report inappropriate content--></button>
        </div>
      </div>

        <div class="row polyanno-carousel-controls">
        <button class="polyanno-carousel-prev col-md-3" role="button" >
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
        <div class="col-md-6 polyanno-mid-carousel-controls"></div>
        <button class="polyanno-carousel-next col-md-3" role="button">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </button>
        </div>

      <div class="row editorCarousel carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="editorCarouselWrapper col-md-12 carousel-inner" role="listbox">
            <!--appended slides go here-->
        </div>
      </div>

      <div class="row polyanno-below-anno-display">

      </div>

    </div>
    </div>

`;

var polyannoEditorHTMLFull = `

  <!-- EDITOR BOX -->
  <div id="theEditor" class="row textEditorBox">
  <div class="col-md-12">

    <div class="row popupBoxHandlebar polyanno-colour-change ui-draggable-handle">
      <button class="btn col-md-1 polyanno-colour-change">
        <span class="closePopupBtn glyphicon glyphicon-remove"></span>
      </button>
      <button class="btn col-md-1 polyanno-colour-change polyanno-popup-min">
        <span> _ </span>
      </button>
      <div class="col-md-7">
        <div class="editorTitle"></div>
      </div>
      <button class="btn col-md-1 polyanno-colour-change polyanno-favourite">
        <span class="glyphicon glyphicon-star-empty"></span>
      </button>
      <button class="btn polyanno-options-dropdown-toggle polyanno-colour-change col-md-2" type="button" >
          <span class="glyphicon glyphicon-cog"></span>
          <span class="caret"></span>
      </button>
    </div>


    <div class="textEditorMainBox row ui-content">
    <div class="col-md-12">

      <div class="row polyanno-options-row">
        <div class="btn-group polyanno-options-buttons" role="group" aria-label="options_buttons">
          <button type="button" class="btn btn-success addNewBtn">
            <span class="glyphicon glyphicon-pencil" ></span> NEW
          </button>
          <button class="btn btn-default polyanno-add-keyboard" type="button"><span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span></button> <!--add keyboard characters-->
          <button class="btn btn-default polyanno-metadata-btn"><span class="glyphicon glyphicon-tags"></span></button>
          <button class="btn btn-default polyanno-export-text" type="button"><span class="glyphicon glyphicon-save"></span></button> <!--export as txt or PDF??-->
          <button class="btn btn-default polyanno-social" type="button"><span class="glyphicon glyphicon-share"></span></button> <!-- social media sharing-->
          <button class="btn btn-default polyanno-report" type="button"><span class="glyphicon glyphicon-exclamation-sign"></span><!--report inappropriate content--></button>
        </div>
      </div>

        <div class="row polyanno-carousel-controls">
        <button class="polyanno-carousel-prev col-md-3" role="button" >
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
        <div class="col-md-6 polyanno-mid-carousel-controls"></div>
        <button class="polyanno-carousel-next col-md-3" role="button">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </button>
        </div>

      <div class="row editorCarousel carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="editorCarouselWrapper col-md-12 carousel-inner" role="listbox">
            <!--appended slides go here-->
        </div>
      </div>

      <div class="row polyanno-below-anno-display">

      </div>

    </div>
    </div>

  </div>
  </div>

`;

/////GENERIC FUNCTIONS

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

var getTargetJSON = function(target) {

  if ( isUseless(target) ) { return null;  }
  else {
    var targetJSON;

    $.ajax({
    type: "GET",
    dataType: "json",
    url: target,
    async: false,
    success: 
      function (data) {
        targetJSON = data;
      }
    });
    return targetJSON;
  };
};

var updateAnno = function(targetURL, targetData) {
  $.ajax({
    type: "PUT",
    url: targetURL,
    async: false,
    dataType: "json",
    data: targetData,
    success:
      function (data) {  }
  });
};

var fieldMatching = function(searchArray, field, fieldValue) {
  if (isUseless(searchArray) || isUseless(field) || isUseless(fieldValue)) {  return false  }
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

////GENERAL ANNOTATION FUNCTIONS

var findClassID = function(classString, IDstring) {
  var IDindex = classString.search(IDstring) + IDstring.length;
  var IDstart = classString.substring(IDindex);
  var theID = IDstart.split(" ", 1);
  return theID[0];
};

var checkForVectorTarget = function(theText, the_target_type) {

  var findByBodyURL = polyanno_urls.annotation + "body/"+encodeURIComponent(theText);
  alert("the URL to check "+findByBodyURL);
  var the_regex = '/.*'+the_target_type+'.*/';
  var theChecking = checkFor(findByBodyURL, "target");
  if (  isUseless(theChecking[0])  ) { return false } 
  else {   return fieldMatching(theChecking, "format", 'image/SVG').body.id;  };

};

var lookupTargetChildren = function(target, baseURL) {
  var childTexts;
  var targetParam = encodeURIComponent(target);
  var aSearch = baseURL.concat("targets/"+targetParam);
  $.ajax({
    type: "GET",
    dataType: "json",
    url: aSearch,
    async: false,
    success: 
      function (data) {
        childTexts = data.list;
        alert("searching annos by "+aSearch+" and returned with "+encodeURIComponent(childTexts));
      }
  });

  if ((isUseless(childTexts))||(isUseless(childTexts[0]))) {
    return false;
  }
  else {

    var ids = [];
    childTexts.forEach(function(doc){
        ids.push(doc.body.id);
    });

    var theSearch = baseURL.concat("ids/"+encodeURIComponent(ids)+"/target/"+encodeURIComponent(target));
    //////
    var theDocs;
    $.ajax({
      type: "GET",
      dataType: "json",
      url: theSearch,
      async: false,
      success: 
        function (data) {
          theDocs = data.list;
        }
    });

    alert("searching the targets by "+theSearch+" and returned with "+JSON.stringify(theDocs));
    return theDocs;

  };
};

var updateVectorSelection = function(the_vector_url) {

  var textData = {target: [{id: the_vector_url, format: "SVG"}]};
  selectingVector.forEach(function(child){
    ////check selectingVector is not anno
    updateAnno(child[0].body.id, textData);
  });
  var editorID = fieldMatching(editorsOpen, "tSelectedParent", selectingVector[0][0].parent).editor;
  selectingVector = false;

  /////remove linkVector button

  closeEditorMenu(editorID);
  setTargets(openEditorMenu);

};


var votingFunction = function(vote, votedID, currentTopText, editorID) {
  var theVote = findBaseURL() + "voting/" + vote;
  var targetID = findBaseURL().concat(votedID); ///API URL of the annotation voted on
  var votedTextBody = $("#"+votedID).html(); 
  var targetData = {
    parent: polyanno_text_selectedParent, ///it is this that is updated containing the votedText within its body
    children: [{
      id: polyanno_text_selectedID, //ID of span location
      fragments: [{
        id: targetID
      }]
    }],
    votedText: votedTextBody,  topText: currentTopText
  };
  var updatedTranscription;
  $.ajax({
    type: "PUT",
    url: theVote,
    async: false,
    dataType: "json",
    data: targetData,
    success:
      function (data) {
        updatedTranscription = data.reloadText;
      }
  });

  if (updatedTranscription) {    polyanno_text_selected = targetID;  };
  if (updatedTranscription && (!isUseless(vectorSelected))) {
    var updateTargetData = {};
    updateTargetData[polyanno_text_type_selected] = targetID;
    updateAnno(vectorSelected, updateTargetData);
  };

  closeEditorMenu(editorID);
  setTargets(openEditorMenu);

///////if the parent is open in an editor rebuild carousel with new transcription 
  editorsOpen.forEach(function(editorOpen){
    editorOpen.children.forEach(function(eachChild){
      if ( eachChild.id == polyanno_text_selectedID ){
        closeEditorMenu(editorOpen.editor);
        ////reopen???
        //$(editorOpen.editor).effect("shake");
      };
    });
  });

};


var findHighestRankingChild = function(parent, locationID) {
  var theLocation = fieldMatching(getTargetJSON(parent).children, "id", locationID);
  var the_child = fieldMatching(theLocation.fragments, "rank", 0); 
  return findField(the_child, "id");
};

///// TEXT SELECTION

var outerElementTextIDstring;
var newContent;
var newNodeInsertID;
var startParentID;

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

var insertSpanDivs = function() {
  $(outerElementTextIDstring).html(newContent); 
  polyanno_text_selectedID = newNodeInsertID;
};

var findBaseURL = function() {
  if (polyanno_text_type_selected == "transcription") {  return polyanno_urls.transcription;  }
  else if (polyanno_text_type_selected == "translation") {  return polyanno_urls.translation;  };
};

var newAnnotationFragment = function(baseURL) {

  polyanno_text_selectedHash = polyanno_text_selectedParent.concat("#"+polyanno_text_selectedID); //need to refer specifically to body text of that transcription - make body independent soon so no need for the ridiculously long values??
  targetSelected = [polyanno_text_selectedHash];
  //polyanno_text_selectedFragment 
  var targetData = {text: polyanno_text_selectedFragment, parent: polyanno_text_selectedParent};
  var createdText;
  
  $.ajax({
    type: "POST",
    url: baseURL,
    async: false,
    data: targetData,
    success: 
      function (data) {
        createdText = data.url;
      }
  });

  polyanno_text_selected = createdText;
  var annoData = { body: { id: createdText }, target: [{id: polyanno_text_selectedHash, format: "text/html"}, {id: polyanno_text_selectedParent, format: "application/json"} ] };

  $.ajax({
    type: "POST",
    url: polyanno_urls.annotation,
    async: false,
    data: annoData,
    success: 
      function (data) {  }
  });

  var newHTML = $(outerElementTextIDstring).html();
  var parentData = {text: newHTML, children: [{id: polyanno_text_selectedID, fragments: [{id: polyanno_text_selected}]}]};
  updateAnno(polyanno_text_selectedParent, parentData);

};


var setpolyanno_text_selectedID = function(theText) {

  var findByBodyURL = polyanno_urls.annotation + "body/"+encodeURIComponent(theText);
  var the_regex = '/.*'+findBaseURL()+'.*/';
  var theTarget = fieldMatching(checkFor(findByBodyURL, "target"), "format", "text/html");
  if ( theTarget != false ) { 
    polyanno_text_selectedHash = theTarget.id;
    polyanno_text_selectedID = polyanno_text_selectedHash.substring(polyanno_text_selectedParent.length + 1); //the extra one for the hash        
  };

};

var newSpanClass = function(startParentClass) {
  if (startParentClass.includes('transcription-text')) {
    return "transcription-text opentranscriptionChildrenPopup";
  }
  else if (startParentClass.includes('translation-text')) {
    return "translation-text opentranslationChildrenPopup";
  }
  else {
    //alert("Please select transcription translation text");
    return null;
  };
};

var strangeTrimmingFunction = function(thetext) {
  if(thetext && (thetext = new String(thetext).replace(/^\s+|\s+$/g,''))) {
    return thetext.toString();
  }; 
};

var newTextPopoverOpen = function(theTextIDstring, theParent) {
  $('#polyanno-page-body').on("click", function(event) {
    if ($(event.target).hasClass("popupAnnoMenu") == false) {
      $(theTextIDstring).popover("hide");
    }
  });

  $('.openTranscriptionMenuNew').on("click", function(event) {
    insertSpanDivs();
    polyanno_text_selectedParent = polyanno_urls.transcription.concat(theParent);
    newAnnotationFragment(polyanno_urls.transcription);
    polyanno_text_type_selected = "transcription";
    targetType = "transcription";
    setTargets(openEditorMenu);
    $(theTextIDstring).popover('hide');    
  });

  $('.closeThePopover').on("click", function(event){
    $(theTextIDstring).popover("hide");
  });
};

var initialiseNewTextPopovers = function(theTextIDstring, theParent) {
  $(theTextIDstring).popover({ 
    trigger: 'manual',
    placement: 'top',
    html : true,
    container: 'body',
    title: closeButtonHTML,
    content: popupTranscriptionNewMenuHTML
  });
  $(theTextIDstring).popover('show');
  $(theTextIDstring).on("shown.bs.popover", function(ev) {
    newTextPopoverOpen(theTextIDstring, theParent);
  });
};

var initialiseOldTextPopovers = function(theTextIDstring) {
  $(theTextIDstring).popover({ 
    trigger: 'manual', //////
    placement: 'top',
    html : true,
    title: closeButtonHTML,
    content: popupTranscriptionChildrenMenuHTML
  });
  $(theTextIDstring).popover('show');
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
  startParentID = startNode.parentElement.id;
  var startParentClass = startNode.parentElement.className;

  var nodeLocationStart = selection.anchorOffset; //index from within startNode text where selection starts
  var nodeLocationEnd = selection.focusOffset; //index from within endNode text where selection ends

  var endNode = selection.focusNode; //the text type Node that end of the selection was in 
  var endNodeText = endNode.textContent;
  var endParentID = endNode.parentElement.id; //the ID of the element type Node that the text ends in

  outerElementTextIDstring = "#" + startParentID; //will be encoded URI of API?

  if (classCheck.includes('opentranscriptionChildrenPopup')) { 
    initialiseOldTextPopovers(outerElementTextIDstring);
  }
  else if (classCheck.includes('opentranslationChildrenPopup')) { 
    initialiseOldTextPopovers(outerElementTextIDstring);
  }    
  else if (startParentID != endParentID) {
   // alert("you can't select across existing fragments' borders sorry");
  }
  else {

    newNodeInsertID = Math.random().toString().substring(2);

    var newSpan = "<a class='" + newSpanClass(startParentClass) + " ' id='" + newNodeInsertID + "' >" + selection + "</a>";
    var outerElementHTML = $(outerElementTextIDstring).html().toString(); //includes any spans that are contained within this selection 

    ///CONTENT BEFORE HIGHLIGHT IN THE TEXT TYPE NODE
    var previousSpanContent = startNodeText.slice(0, nodeLocationStart);

    //CONTENT BEFORE HIGHLIGHT IN THE ELEMENT TYPE NODE
    var previousSpan = startNode.previousElementSibling; //returns null if none i.e. this text node is first node in element node
    var outerElementStartContent = setOESC(outerElementHTML, previousSpanContent, previousSpan);

    ///CONTENT AFTER HIGHLIGHT IN THE TEXT TYPE NODE
    var nextSpanContent;
    if (endNode == startNode) { nextSpanContent = startNodeText.slice(nodeLocationEnd, startNodeTextEndIndex)}
    else {nextSpanContent = endNodeText.slice(0, nodeLocationEnd)};

    ///CONTENT AFTER HIGHLIGHT IN ELEMENT TYPE NODE
    var nextSpan = endNode.nextElementSibling; //returns null if none i.e. this text node is the last in the element node
    var outerElementEndContent = setOEEC(outerElementHTML, nextSpanContent, nextSpan );

    newContent = outerElementStartContent + newSpan + outerElementEndContent;
    polyanno_text_selectedFragment = strangeTrimmingFunction(selection);

    initialiseNewTextPopovers(outerElementTextIDstring, startParentID);

  };
};

///// VIEWER WINDOWS

var setChildrenArray = function(callback_function) {  
  alert("the target for the children array selected is "+JSON.stringify(targetSelected));
  childrenArray = lookupTargetChildren(targetSelected[0], findBaseURL()); 
//  alert("the childrenArray is "+JSON.stringify(childrenArray));
  if (!isUseless(callback_function)) { callback_function(); };
};

var buildCarousel = function(existingChildren, popupIDstring, extraHTML) {

  var openingHTML = "<div class='item row pTextDisplayItem ";
  var openingHTML2 = "'> <div class='pTextDisplay col-md-12'> <div class='row well well-sm polyanno-anno-well'> <p id='";
  var middleHTML = "' class='content-area' title=' '>";
  var endTextHTML = "</p></div>";
  var endDivHTML = "</div></div>";
  var closingHTML = endTextHTML + extraHTML + endDivHTML;

  existingChildren.forEach(function(subarray) {

    var itemText = subarray[0].text;
    var itemID = subarray[0]._id;
    var itemHTML = openingHTML + itemID + openingHTML2 + itemID + middleHTML + itemText + closingHTML;
    $(popupIDstring).find(".editorCarouselWrapper").append(itemHTML);

    if ( !isUseless(subarray[1]) )  {
      var votesUp = subarray[1].votesUp;
      $("."+itemID).find(".votesUpBadge").find(".badge").html(votesUp); 
    }; 
/////////update metadata options with defaults and placeholders???    
  });

};

var highlightTopVoted = function() {
  var theTextString = "#" + polyanno_text_selected.slice(findBaseURL().length, polyanno_text_selected.length);
  $(theTextString).closest(".item").addClass("active"); //ensures it is the first slide people see
  $(theTextString).addClass("currentTop");
///////////choose better styling later!!!!!///////
  $(theTextString).css("color", "grey");
  $(theTextString).find(".polyanno-below-anno-well").append("<span='glyphicon glyphicon-star'></span><span='glyphicon glyphicon-star'></span><span='glyphicon glyphicon-star'></span><span='glyphicon glyphicon-star'></span>");
};

var canLink = function(popupIDstring) {
  if (targetType.includes("vector") == false){ 
    $(popupIDstring).find(".polyanno-options-buttons").append(linkButtonHTML);
  };
};

var canVoteAdd = function(popupIDstring, theVectorParent) {
  //if it is targeting it's own type OR it is targeting a vector with parents THEN you can vote and add
  if ( targetType.includes(polyanno_text_type_selected) || ( ( targetType.includes("vector") ) && ( !isUseless(theVectorParent) ) ) ) { 
    $(popupIDstring).find(".editorCarouselWrapper").append(addNewAnnoHTML);
    var stuffToAdd = " ";
    if (polyanno_voting) { stuffToAdd += voteButtonsHTML };
    ///////metadata stuff too!!!!!!!
    return stuffToAdd; 
  }
  else {
    $(popupIDstring).find(".polyanno-carousel-controls").css("display", "none");
    $(popupIDstring).find(".addNewBtn").css("display", "none");
    return "";
  };
};

var addCarouselItems = function(popupIDstring) {
  var theVectorParent = checkFor(vectorSelected, "parent");
  if (( isUseless(childrenArray) || isUseless(childrenArray[0]) ) && isUseless(theVectorParent) ) {
    $(popupIDstring).find(".editorCarouselWrapper").append(addNewAnnoHTML);
    $(popupIDstring).find(".newAnnotation").attr("id", "addBox"+popupIDstring);
    $(popupIDstring).find(".addNewItem").addClass("active");
    $(popupIDstring).find(".polyanno-carousel-controls").css("display", "none");
    $(popupIDstring).find(".addNewBtn").css("display", "none");
  }
  else {
    var theExtras = canVoteAdd(popupIDstring, theVectorParent);
    buildCarousel(childrenArray, popupIDstring, theExtras);
    highlightTopVoted();
  };
};

var returnTextIcon = function(polyanno_text_type_selected){
  if(polyanno_text_type_selected == "transcription") {
    return transcriptionIconHTML;
  }
  else if (polyanno_text_type_selected == "translation"){
    return translationIconHTML;
  };
};

var updateEditor = function(popupIDstring) {
  $(popupIDstring).find("#theEditor").attr("id", "newEditor");
  $(popupIDstring).find(".editorTitle").html(returnTextIcon(polyanno_text_type_selected));
  canLink(popupIDstring);
  setChildrenArray();
  alert("at this point the textSelected is "+polyanno_text_selected);
  addCarouselItems(popupIDstring);
  $(popupIDstring).find(".textEditorMainBox").find('*').addClass(polyanno_text_type_selected+"-text"); 
};

var checkingItself = function(searchField, searchFieldValue, theType) {
  if (theType == searchField) { return false }
  else {  return fieldMatching(editorsOpen, searchField, searchFieldValue)[theType] };
};

var addEditorsOpen = function(popupIDstring) {
  editorsOpen.push({
    "editor": popupIDstring,
    "typesFor": targetType,
    "vSelected": vectorSelected,
    "tSelectedParent": polyanno_text_selectedParent,
    "tSelectedID": polyanno_text_selectedID,
    "tSelectedHash": polyanno_text_selectedHash,
    "tTypeSelected": polyanno_text_type_selected,
    "children": childrenArray
  });
  vectorSelected = "";
  polyanno_text_selectedParent = "";
  polyanno_text_selectedID = "";
  polyanno_text_selectedHash = "";
  polyanno_text_type_selected = "";
  childrenArray = [];
  return editorsOpen;
};

var createEditorPopupBox = function() {

  var dragon_opts = {
    "minimise": polyanno_minimising,
    "initialise_min_bar": false,
    "beforeclose": preBtnClosing
  };
  var popupIDstring = add_dragondrop_pop("textEditorPopup", polyannoEditorHTML, "polyanno-page-body", dragon_opts, polyannoEditorHandlebarHTML);
  $(popupIDstring).find(".dragondrop-handlebar").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondrop-handlebar-obj").addClass("polyanno-colour-change"); 
  //id="theEditor" class="row textEditorBox"
  $(popupIDstring).find(".dragondropbox").addClass("textEditorBox");
  var newCarouselID = "Carousel" + Math.random().toString().substring(2);
  $(popupIDstring).find(".editorCarousel").attr("id", newCarouselID);
  $(popupIDstring).find(".polyanno-carousel-controls").attr("href", "#" + newCarouselID);

  return popupIDstring;

};

var openEditorMenu = function() {

  var popupIDstring = createEditorPopupBox();
  /*$('.opentranscriptionChildrenPopup').popover({ 
    trigger: 'manual',
    placement: 'top',
    html : true,
    title: "  ",
    content: popupTranscriptionChildrenMenuHTML
  });*/
  updateEditor(popupIDstring); 
  addEditorsOpen(popupIDstring); 

};

var removeEditorsOpen = function(popupIDstring) {
  var theEditorItem = fieldMatching(editorsOpen, "editor", popupIDstring);
  var currentIndex = editorsOpen.indexOf(theEditorItem); 
  editorsOpen.splice(currentIndex,1);
};

var closeEditorMenu = function(thisEditor) {
  if (thisEditor.includes("#")) { thisEditor = thisEditor.split("#")[1]; };
  resetVectorHighlight(thisEditor);
  removeEditorsOpen(thisEditor);
  return dragondrop_remove_pop(thisEditor);
};

var preBtnClosing = function(thisEditor) {
  resetVectorHighlight(thisEditor);
  removeEditorsOpen(thisEditor);
};

var findNewTextData = function(editorString) {

  var newText = $(editorString).find(".newAnnotation").val();
  polyanno_text_selected = newText; ////////
  var textData = {text: newText, metadata: imageSelectedMetadata, target: []}; ////

  if (targetType.includes("vector") == true) {
    alert("the vector selected is "+vectorSelected);
    textData.target.push({id: vectorSelected, format: "image/SVG"});
  };

  if (targetType.includes(polyanno_text_type_selected)) {
      textData.target.push({id: polyanno_text_selectedHash, format: "text/html"});
      textData.parent = polyanno_text_selectedParent;
  }
  else if (targetType.includes(polyanno_text_type_selected) == false) {
      //textData.target.push({id: ???, format: "text/html"});
  };

  if (textData.target[0] != 'undefined') {
    return textData;
  };
  
};

var polyanno_add_annotationdata = function(thisAnnoData) {

  alert("the anno to be added is "+JSON.stringify(thisAnnoData));

  $.ajax({
    type: "POST",
    url: polyanno_urls.annotation,
    async: false,
    data: thisAnnoData,
    success: 
      function (data) {
        createdAnno = data.url;
      }
  });

  /////double check synchronicity of this - what is stopping empty brackets being sent?

  //if the annotation is a child then it is targeting its own type, so update parent
  if (targetType.includes(polyanno_text_type_selected)) {

    var polyanno_new_target_data = {children: [{id: polyanno_text_selectedID, fragments: [{id: thisAnnoData.body.id}] }]};
    updateAnno(polyanno_text_selectedParent, polyanno_new_target_data);
  };

  if (  targetType.includes("vector") && (  isUseless(childrenArray[0]) )) {
    var polyanno_new_target_data = {};
    polyanno_new_target_data[polyanno_text_type_selected] = thisAnnoData.body.id;

    alert("updating the vector "+vectorSelected+" with "+JSON.stringify(polyanno_new_target_data));

    updateAnno(vectorSelected, polyanno_new_target_data);
  };

};

var addAnnotation = function(thisEditor){

  var editorString = "#" + thisEditor;
  var theData = findNewTextData(editorString);

  alert("posting to "+findBaseURL()+" is "+JSON.stringify(theData));

  $.ajax({
    type: "POST",
    url: findBaseURL(),
    async: false,
    data: theData,
    success: 
      function (data) {

        var thisAnnoData = { 
          "body": {
            "id" : data.url
          },
          "target": theData.target
        };

        polyanno_add_annotationdata(thisAnnoData);
      }
  });

////****synchronicity checks needed!!

  $(editorString).find(".newAnnotation").val("");  

//  polyanno_text_selected = createdText; //////only if there was none before??

  closeEditorMenu(thisEditor);
  if (  targetType.includes("vector") ) { openNewEditor("vector") }
  else { openNewEditor("text")  };
};

var setTargets = function(callback_function) {
 
  if (  isUseless(vectorSelected) ){ 
    targetSelected = [polyanno_text_selectedHash];
    targetType = polyanno_text_type_selected;
    if (!isUseless(callback_function)) { callback_function(); };
  }
  else if ( isUseless(polyanno_text_selected) || isUseless(polyanno_text_selectedParent) ) { 
    targetSelected = [vectorSelected];
    targetType = "vector";
    alert("the target selected is vector alone and it is "+vectorSelected);
    if (!isUseless(callback_function)) { callback_function(); };
  }
  else {
    targetSelected = [polyanno_text_selectedHash, vectorSelected];
    targetType = "vector " + polyanno_text_type_selected;
    if (!isUseless(callback_function)) { callback_function(); };
  };

};

var openNewEditor = function(fromType) {

  if (fromType == "vector") {
    polyanno_text_selected = checkFor(vectorSelected, polyanno_text_type_selected); //return the api url NOT json file
    polyanno_text_selectedParent = checkFor(polyanno_text_selected, "parent");
    if ( polyanno_text_selected != false ) { setpolyanno_text_selectedID(polyanno_text_selected) };
    alert("going to open up new editor for a vector with textSelected "+polyanno_text_selected+" of type "+typeof(polyanno_text_selected));
  }
  else if (fromType == "text") {
    polyanno_text_selected = findHighestRankingChild(polyanno_text_selectedParent, polyanno_text_selectedID);
    vectorSelected = checkForVectorTarget(polyanno_text_selected); 
  };
  setTargets(openEditorMenu);
};

var checkEditorsOpen = function(fromType, textType) {
  polyanno_text_type_selected = textType;
  if (isUseless(editorsOpen)) {    openNewEditor(fromType);  }
  else {
    var canOpen = true;
    editorsOpen.forEach(function(editorOpen){
      if ( ( (  !isUseless(editorOpen["vSelected"]) && (editorOpen["vSelected"] == vectorSelected)  )||( !isUseless(editorOpen["tSelectedParent"]) && editorOpen["tSelectedParent"] == polyanno_text_selectedParent)) && (editorOpen["tTypeSelected"] == textType)){
        $(editorOpen.editor).effect("shake");
        canOpen = false;
      };
    });
    if (canOpen == true) {  openNewEditor(fromType) };
  };
};

var findVectorParent = function(coordinatesArray, parentCoordsArray) {
  var xBounds = [ parentCoordsArray[0][0], parentCoordsArray[2][0] ];
  var yBounds = [ parentCoordsArray[0][1], parentCoordsArray[2][1] ];
  var counter = 0;
  coordinatesArray.forEach(function(pair){
    if (  (xBounds[0] <= pair[0]) && ( pair[0]<= xBounds[1]) && (yBounds[0] <= pair[1]) && (pair[1] <= yBounds[1])  ) {  counter += 1;  };
  });
  if (counter >= 3) {  return true;  }
  else {  return false;  };
};

var searchForVectorParents = function(theDrawnItems, theCoordinates) {
  var overlapping = false;
  theDrawnItems.eachLayer(function(layer){
    var drawnItem = layer.toGeoJSON();
    if (findVectorParent(theCoordinates, drawnItem.geometry.coordinates[0])) {  
      overlapping = layer._leaflet_id ;  
    };
  });
  return overlapping;
};

var settingEditorVars = function(thisEditor) {
  if(!thisEditor.includes("#")) { thisEditor = "#" + thisEditor; };
  editorsOpen.forEach(function(target){
    if(target.editor == thisEditor) {
      targetType = target.typesFor;
      vectorSelected = target.vSelected;
      polyanno_text_selectedParent = target.tSelectedParent;
      polyanno_text_selectedID = target.tSelectedID;
      polyanno_text_selectedHash = target.tSelectedHash;
      polyanno_text_type_selected = target.tTypeSelected;
      childrenArray = target.children;
    };
  });
};

////USERS HANDLING

var polyannoAddFavourites = function(the_favourited_type, the_favourited_id) {
  var targetData = {  "favourites": { "image_id" : imageSelected } };
  targetData.favourites[the_favourited_type] = the_favourited_id;

///////
  $.ajax({
    type: "PUT",
    url: users_url + polyanno_current_username,
    dataType: "json",
    data: targetData
  });

};

var polyannoRemoveFavourites = function(the_favourited_type, the_favourited_id) {
  var targetData = {  "removefavourite": { "image_id" : imageSelected } };
  targetData.favourites[the_favourited_type] = the_favourited_id;
///////
  $.ajax({
    type: "PUT",
    url: users_url + polyanno_current_username,
    dataType: "json",
    data: targetData
  });

};

/////update activities of users functions here 


////HIGHLIGHTING 

var highlightVectorChosen = function(chosenVector, colourChange) {
  allDrawnItems.eachLayer(function(layer){
    if(layer._leaflet_id == chosenVector) {
      layer.setStyle({color: colourChange});
    };
  });
};

var highlightEditorsChosen = function(chosenEditor, colourChange) {
  if (!chosenEditor.includes("#")) {  chosenEditor = "#"+chosenEditor; }
  $(chosenEditor).find(".polyanno-colour-change").css("background-color", colourChange);
};

var highlightSpanChosen = function(chosenSpan, colourChange) {
  $(chosenSpan).css("background-color", colourChange);
};

var findAndHighlight = function(searchField, searchFieldValue, highlightColours) {
  var thisEditor = checkingItself(searchField, searchFieldValue, "editor");
  if (!isUseless(thisEditor)) {  highlightEditorsChosen(thisEditor, highlightColours[0]);  };
  var thisVector = checkingItself(searchField, searchFieldValue, "vSelected");
  if (!isUseless(thisVector)) {  highlightVectorChosen(thisVector, highlightColours[1]);  };
  var thisSpan = checkingItself(searchField, searchFieldValue, "tSelectedID");
  if (!isUseless(thisSpan)) {  
    if (!thisSpan.includes("#")) {  thisSpan = "#"+thisSpan; };
    if (!isUseless($(thisSpan))) {  highlightSpanChosen(thisSpan, highlightColours[2]);  };
  };
};

var resetVectorHighlight = function(thisEditor) {
  var thisVector = fieldMatching(editorsOpen, "editor", thisEditor).vSelected; 
  if(!isUseless(thisVector)){ highlightVectorChosen("#"+thisVector, polyanno_default_colours_array[1]); };
};

///////LEAFLET 

var generateIIIFregion = function(coordinates) {

    /////how to encode polygon regions?? Are they allowed in IIIF???

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
    var paramURL = x.toString() + "," + y.toString() + "," + w.toString() + "," + h.toString() + "/full/0/";

    return paramURL;
};

var getIIIFsectionURL = function (imageJSON, coordinates, formats) {

    var imagewithoutinfo = imageJSON.split("/info.json",1);
    var imagewithoutinfoURL = imagewithoutinfo[0];
    var splitIndex = imagewithoutinfoURL.lastIndexOf("/");
    var image_id = imagewithoutinfoURL.substring(splitIndex +1);
    var baseImageURL = imagewithoutinfoURL.slice(0, splitIndex +1);

    var regionParams = generateIIIFregion(coordinates);
    var pickAFormat = formats;

    var params = regionParams.concat(image_id + "." + pickAFormat);
    var theURL = baseImageURL.concat(params);

    return theURL;
};


////INITIALISING AND SETUPS

///text selection

$('#polyanno-page-body').on("mouseup", '.content-area', function(event) {

  var selection = getSelected(); 
  var classCheck = selection.anchorNode.parentElement.className;

  if (classCheck.includes('openTranscriptionMenuOld')) { //if it is a popover within the selection rather than the text itself

    polyanno_text_selectedID = startParentID;
    if (  !isUseless($(outerElementTextIDstring).parent().attr('id')) ){
      polyanno_text_selectedParent = polyanno_urls.transcription + $(outerElementTextIDstring).parent().attr('id'); 
    };
    polyanno_text_selectedHash = polyanno_text_selectedParent.concat("#"+polyanno_text_selectedID);
    checkEditorsOpen("text", "transcription");
    $(outerElementTextIDstring).popover('hide'); ////

  }   
  else if (classCheck.includes('popover-title')) { 
    $(outerElementTextIDstring).popover('hide'); ///
  } 
  else if (classCheck.includes("polyanno-add-discuss")) {
    if ($(outerElementTextIDstring).hasClass("annotator-hl")) {

    }
    else {
      var thisSpanText = $(outerElementTextIDstring).html().toString();
      new TextQuoteAnchor($(outerElementTextIDstring), thisSpanText);
    };
  }
  else {
    setNewTextVariables(selection, classCheck);
  };
});



/////////LEAFLET

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

  polyanno_map.addLayer(allDrawnItems);
  new L.Control.Draw(controlOptions).addTo(polyanno_map); //

  polyanno_map.whenReady(function(){
    mapset = true;
  });
};

//load the existing vectors
var polyanno_load_existing_vectors = function() {

  var existingVectors = lookupTargetChildren(imageSelected, polyanno_urls.vector);

  var tempGeoJSON = {  "type": "Feature",  "properties":{},  "geometry":{}  };
  var currentVectorLayers = {};

  if (!isUseless(existingVectors)) {
    existingVectors.forEach(function(vector) {

      var oldData = tempGeoJSON;
      oldData.geometry.type = vector.notFeature.notGeometry.notType;
      oldData.geometry.coordinates = [vector.notFeature.notGeometry.notCoordinates];
      oldData.properties.transcription = findField(vector, "transcription");
      oldData.properties.translation = findField(vector, "translation");
      oldData.properties.parent = findField(vector, "parent");

      var existingVectorFeature = L.geoJson(oldData, 
        { onEachFeature: function (feature, layer) {
            layer._leaflet_id = vector.id,
            allDrawnItems.addLayer(layer),
            layer.bindPopup(popupVectorMenu)
          }
        }).addTo(polyanno_map);

    });
  };
};

var polyanno_creating_vec = function() {
  polyanno_map.on(L.Draw.Event.CREATED, function(evt) {

    var layer = evt.layer;
    var shape = layer.toGeoJSON();
    var vectorOverlapping = searchForVectorParents(allDrawnItems, shape.geometry.coordinates[0]); 
    allDrawnItems.addLayer(layer);
    if (  (vectorOverlapping != false) && (selectingVector == false)  ) { 
      allDrawnItems.removeLayer(layer);
      vectorSelected = vectorOverlapping;
      $("#map").popover();
      $("#map").popover('show');
    }
    else {
      var annoData = {geometry: shape.geometry, metadata: imageSelectedMetadata, parent: vectorOverlapping };

      if (selectingVector != false) { 
        var theTopText = findHighestRankingChild(polyanno_text_selectedParent, polyanno_text_selectedID);
        annoData[polyanno_text_type_selected] = theTopText;  
      };

      $.ajax({
        type: "POST",
        url: polyanno_urls.vector,
        async: false,
        data: annoData,
        success: 
          function (data) {
            vectorSelected = data.url;
          }
      });

      var targetData = {target: [], body: {}};
      var IIIFsection = getIIIFsectionURL(imageSelected, shape.geometry.coordinates[0], "jpg");
      targetData.target.push({
          "id": imageSelected,
          "format": "application/json"
      });
      targetData.target.push({
          "id": IIIFsection,
          "format": "jpg" ////official jpg file type???
      });

      targetData.body.id = vectorSelected;

      $.ajax({
        type: "POST",
        url: polyanno_urls.annotation,
        async: false,
        data: targetData,
        success: 
          function (data) {}
      });

      layer._leaflet_id = vectorSelected;
      if (selectingVector == false) { layer.bindPopup(popupVectorMenu).openPopup(); }
      else {  updateVectorSelection(vectorSelected); };
    };

  });
};

var polyanno_vec_select = function() {

  polyanno_map.on('draw:deletestart', function(){
    currentlyDeleting = true;
  });
  polyanno_map.on('draw:deletestop', function(){
    currentlyDeleting = false;
  });
  polyanno_map.on('draw:editstart', function(){
    currentlyEditing = true;
  });
  polyanno_map.on('draw:editstop', function(){
    currentlyEditing = false;
  });

  allDrawnItems.on('click', function(vec) {
    vectorSelected = vec.layer._leaflet_id;
    if (currentlyEditing || currentlyDeleting) {}
    else if (selectingVector != false) {  alert("make a new vector!");  }
    else {  vec.layer.openPopup();  };

  });

};

var polyanno_vector_edit_setup = function() {
  //////update DB whenever vector coordinates are changed
  allDrawnItems.on('edit', function(vec){
    var shape = vec.layer.toGeoJSON();
    /////
    updateAnno(vectorSelected, shape); ////////////
    /////
  });

  //////update DB whenever vector is deleted
  allDrawnItems.on('remove', function(vec){
    //////******
    var shape = vec.layer.toGeoJSON();

  });
};


var polyanno_image_popovers_setup = function() {

  /////maybe change to be more specific to the drawing?
  /*
  $('#imageViewer').popover({ 
    trigger: 'manual',
    placement: 'top',
    html : true,
    title: closeButtonHTML,
    content: popupLinkVectorMenuHTML
  });

  $('#imageViewer').on("shown.bs.popover", function(event) {
      $('#polyanno-page-body').on("click", function(event) {
        if ($(event.target).hasClass("popupAnnoMenu") == false) {
          $('#map').popover("hide");
        }
      });
      $('.closeThePopover').on("click", function(event){
        $('#map').popover("hide");
      });
  });
  */
  $('#map').popover({ 
    trigger: 'manual',
    placement: 'top',
    html : true,
    title: closeButtonHTML,
    content: popupVectorParentMenuHTML
  });

  $('#map').on("shown.bs.popover", function(event) {

    $('#polyanno-page-body').one("click", '.openTranscriptionMenuParent', function(event) {
      checkEditorsOpen("vector", "transcription");
      $('#map').popover('hide');
    });
    $('#polyanno-page-body').one("click", '.openTranslationMenuParent', function(event) {
      checkEditorsOpen("vector", "translation");
      $('#map').popover('hide');
    });

    $('.closeThePopover').on("click", function(event){
      $('#map').popover("hide");
    });
  });
};

////alltheunicode

$('#polyanno-page-body').on("click", '.newAnnotation', function(event) {

  atu_the_input = this;
  atu_initialise_IMEs();

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

  /////////
  ////check for default and highlighted colour array
  /////////

  $('#polyanno-page-body').on("mouseover", ".textEditorBox", function(event){

    var thisEditor = "#" + $(event.target).closest(".textEditorPopup").attr("id");
    //////////
    $(thisEditor).find(".polyanno-colour-change").css("background-color", polyanno_highlight_colours_array[0]);
    findAndHighlight("editor", thisEditor, polyanno_highlight_colours_array);
    //////////
    $(thisEditor).on("mouseenter", ".opentranscriptionChildrenPopup", function(event){
      $(thisEditor).find(".polyanno-colour-change").css("background-color", polyanno_default_colours_array[0]);
      findAndHighlight("editor", thisEditor, polyanno_default_colours_array);
      var thisSpan = $(event.target).attr("id");
      $("#"+thisSpan).css("background-color", polyanno_highlight_colours_array[2]);
      findAndHighlight("tSelectedID", thisSpan, polyanno_highlight_colours_array);
    });

    $(thisEditor).on("mouseleave", ".opentranscriptionChildrenPopup", function(event){
      var thisSpan = $(event.target).attr("id");
      $("#"+thisSpan).css("background-color", polyanno_default_colours_array[2]);
      findAndHighlight("tSelectedID", thisSpan, polyanno_default_colours_array);
    });  

  });

  $('#polyanno-page-body').on("mouseout", ".textEditorBox", function(event){
    var thisEditor = "#" + $(event.target).closest(".textEditorPopup").attr("id");
    $(thisEditor).find(".polyanno-colour-change").css("background-color", polyanno_default_colours_array[0]);
    findAndHighlight("editor", thisEditor, polyanno_default_colours_array);
  });

  $('#polyanno-page-body').on("mouseover", ".leaflet-popup", function(event){
    highlightVectorChosen(vectorSelected, polyanno_highlight_colours_array[1]);
    findAndHighlight("vSelected", vectorSelected, polyanno_highlight_colours_array);
  });

  $('#polyanno-page-body').on("mouseover", ".leaflet-popup", function(event){
    highlightVectorChosen(vectorSelected, polyanno_default_colours_array[1]);
    findAndHighlight("vSelected", vectorSelected, polyanno_default_colours_array);
  });

  allDrawnItems.on('mouseover', function(vec) {
    vec.layer.setStyle({color: polyanno_highlight_colours_array[1]});
    findAndHighlight("vSelected", vec.layer._leaflet_id, polyanno_highlight_colours_array);
  });
  allDrawnItems.on('mouseout', function(vec) {
    vec.layer.setStyle({color: polyanno_default_colours_array[1]});
    findAndHighlight("vSelected", vec.layer._leaflet_id, polyanno_default_colours_array);
  });

};

/////USERS

var polyanno_enable_favourites = function () {

  polyannoEditorHandlebarHTML += polyannoFavouriteBtnHTML;

  $("#polyanno-page-body").on("click", ".polyanno-favourite", function(event) {
    var theSpan = $(this).find(".glyphicon");
    if (theSpan.hasClass("glyphicon-star-empty")) {
      if ( $(this).closest(".annoPopup").attr("id") == "imageViewer" ) {
        polyannoAddFavourites("the_image", true);
      }
      else {
        polyannoAddFavourites(textTypeSelected, textSelected);
      };
      theSpan.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
    }
    else {
      if ( $(this).closest(".annoPopup").attr("id") == "imageViewer" ) {
        polyannoRemoveFavourites("the_image", false);
      }
      else {
        polyannoRemoveFavourites(textTypeSelected, textSelected);
      };
      polyannoHandleFavourites("removefavourite", textSelected);
      theSpan.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
    };
  });

};


/*
$(".polyanno-image-box").draggable();
$(".polyanno-image-box").draggable({
  addClasses: false,
  handle: ".imageHandlebar",
  revert: function(theObject) {
    return adjustDragBootstrapGrid($(this));
  },
  revertDuration: 0,
  snap: ".annoPopup",
  snapMode: "outer"
});
$( ".polyanno-image-box" ).resizable();
$( ".polyanno-image-box" ).resizable( "enable" );
*/
/////////////

var polyanno_setup_storage_fields = function(opts) {
  polyanno_urls = {
    "vector": websiteAddress.concat("/api/vectors/"),
    "transcription": websiteAddress.concat("/api/transcriptions/"),
    "translation": websiteAddress.concat("/api/translations/"),
    "annotation": websiteAddress.concat("/api/annotations/")
  };
  if (!isUseless(opts)) {
    if (!isUseless(opts.transcription)) { polyanno_urls.transcription = opts.transcription; };
    if (!isUseless(opts.translation)) { polyanno_urls.translation = opts.translation; };
    if (!isUseless(opts.vector)) { polyanno_urls.vector = opts.vector; };
    if (!isUseless(opts.annotation)) { polyanno_urls.annotation = opts.annotation; };
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

var polyanno_setup_users = function(opts) {
  if (!isUseless(opts.favourites)) {
    polyanno_enable_favourites();
  };
  if (!isUseless(opts.users_url)){
    polyanno_urls.users = opts.users_url;
  }
  else {
    polyanno_urls.users = websiteAddress + "/users/";
  };

};

var polyanno_setup_voting = function() {

  $('#polyanno-page-body').on("click", '.votingUpButton', function(event) {
    var votedID = $(event.target).closest(".pTextDisplay").find("p").attr("id");
    var currentTopText = $(event.target).closest(".textEditorPopup").find(".currentTop").html();
    var thisEditor = $(event.target).closest(".textEditorPopup").attr("id");
    settingEditorVars(thisEditor);
    votingFunction("up", votedID, currentTopText, thisEditor);
  });
};

var polyanno_setup_editor_events = function() {

  $('#polyanno-page-body').on("click", '.addAnnotationSubmit', function(event) {
    var thisEditor = $(event.target).closest(".annoPopup").attr("id"); 
    settingEditorVars(thisEditor);
    ////
    addAnnotation(thisEditor);
  });

  $('#polyanno-page-body').on("click", ".closePopoverMenuBtn", function(){
    $(event.target).closest(".popover").popover("hide"); ///////
  });


  $('#polyanno-page-body').on('slid.bs.carousel', '.editorCarousel', function(event) {

    var currentSlideID = $(event.target).find(".active").find(".content-area").attr("id");
    var thisEditor = $(event.target).closest(".annoPopup").attr("id"); 
    settingEditorVars(thisEditor);
    if (!isUseless(currentSlideID))  {  textSelected = findBaseURL() + currentSlideID;  };

  });

  $('#polyanno-page-body').on("click", ".addNewBtn", function(event){
    $(event.target).closest(".textEditorPopup").find(".editorCarousel").carousel(0);
  });

  $('#polyanno-page-body').on("click", ".polyanno-carousel-next", function(event){
    $(event.target).closest(".textEditorPopup").find(".editorCarousel").carousel("next");
  });

  $('#polyanno-page-body').on("click", ".polyanno-carousel-prev", function(event){
    $(event.target).closest(".textEditorPopup").find(".editorCarousel").carousel("prev");
  });

  $('#polyanno-page-body').on("click", ".linkBtn", function(){
    var thisEditor = $(event.target).closest(".textEditorPopup").attr("id"); 
    settingEditorVars(thisEditor);
    selectingVector = childrenArray;
    $("#imageViewer").effect("bounce");
    $("#map").popover( "show");
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

////SETUP

var polyanno_setup = function(opts) {

  if (opts.minimising == false) {  polyanno_minimising = false;  };
  addIMEs(true, true, true); //why is this not working??????

  document.getElementById("polyanno-top-bar").innerHTML = polyanno_top_bar_HTML;

  polyanno_setup_storage(opts.storage);

  if (!isUseless(opts.highlighting)) {  polyanno_setup_highlighting();  };

  if (opts.voting == false) {  polyanno_voting = false;  }
  else {  polyanno_setup_voting()  };


  //var polyanno_image_title = polyanno_findLUNAimage_title(imageSelectedMetadata);
  var polyanno_image_title_HTML = " ";//"<span>"+polyanno_image_title()+"</span>";

  //will this induce synchronicity problems?
  $("#polyanno-page-body").addClass("atu-keyboard-parent");

  var image_viewer_id = add_dragondrop_pop( "polyanno-image-box", polyanno_image_viewer_HTML , "polyanno-page-body", polyanno_minimising, polyanno_image_title_HTML );
  //$(".polyanno-image-box").find("") find handlebar and remove close button
  $(image_viewer_id).attr("id", "imageViewer");

  polyanno_leaflet_basic_setup();
  polyanno_load_existing_vectors();
  polyanno_creating_vec();
  polyanno_vec_select();
  polyanno_vector_edit_setup();
  polyanno_image_popovers_setup();

  initialise_dragondrop("polyanno-page-body", {"minimise": polyanno_minimising });

  if (!isUseless(opts.users)) { polyanno_setup_users(opts.users); };

  polyanno_setup_editor_events();

};


