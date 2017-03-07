
/////GLOBAL VARIABLES

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined','']);

var websiteAddress;
var polyanno_urls = {};

var polyanno_minimising = true;

var polyanno_current_username;

var polyanno_transcription = true;
var polyanno_translation = true;

var imageSelected; //info.json format URL
var imageSelectedMetadata = []; ////???

var vectorSelected; //API URL
var vectorSelectedParent; //API URL
var currentCoords;

var polyanno_text_selected; //API URL of the image currently being displayed

//target variables
var polyanno_text_selectedParent; //API URL
var polyanno_text_selectedID; //DOM id
var polyanno_text_selectedHash; //parent API URL + ID
var polyanno_text_selectedFragment; //HTML Selection Object
var polyanno_text_type_selected;

//URLs
var targetSelected; //array
var targetType; 
var polyanno_siblingArray;

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

        <button class="btn btn-default polyanno-image-metadata-tags-btn"><span class="glyphicon glyphicon-tags"></span></button>

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

var polyannoVoteOverlayHTML = `<div class='polyanno-voting-overlay' >
                        <button type='button' class='btn btn-default voteBtn polyannoVotingUpButton'>
                          <span class='glyphicon glyphicon-thumbs-up' aria-hidden='true' ></span>
                        </button>
                        <button type='button' class='btn btn-default polyannoVotesUpBadge'>
                          <span class='badge'></span>
                        </button>
                      </div>`;
var closeButtonHTML = `<span class='closePopoverMenuBtn glyphicon glyphicon-remove'></span>`;

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
        <a class="openTranscriptionMenuNew transcriptionTarget editorPopover btn btn-default">ALTERNATIVE TRANSCRIPTION</a></br>
        <a class="polyanno-add-discuss btn btn-default"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
     </div>
  </div>
`;

var popupTranslationNewMenuHTML = `
  <!-- New Translation Text Select Popup Menu -->
  <div id="popupTranslationNewMenu" class="popupAnnoMenu" >
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuNew translationTarget editorPopover ui-btn ui-corner-all ui-shadow ui-btn-inline">ALTERNATIVE TRANSLATION</a>
        <a class="polyanno-add-discuss btn btn-default"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
      </div>
  </div>  
`;

var popupTranscriptionChildrenMenuHTML = `
  <!-- Children Transcription Text Select Popup Menu-->
  <div id="popupTranscriptionChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranscriptionMenuOld editorPopover btn btn-default" onclick="polyanno_open_existing_text_transcription_menu();">VIEW OTHER TRANSCRIPTIONS</a>
        <a class="polyanno-add-discuss btn btn-default"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
      </div>
  </div>
`;
var popupTranslationChildrenMenuHTML = `
  <!-- Children Translation Text Select Popup Menu -->
  <div id="popupTranslationChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuOld editorPopover btn btn-default" onclick="polyanno_open_existing_text_translation_menu();">VIEW OTHER TRANSLATIONS</a>
        <a class="polyanno-add-discuss btn btn-default"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
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
var polyannoEditorHTML_partone = `

  <div class="textEditorMainBox row ui-content">
    <div class="col-md-12">

`;

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
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoToggleAlternatives'>
          Show Alternatives
        </button> 
      </div>

      <div class="row polyanno-list-alternatives-row">

      </div>

      <div class="row polyanno-add-new-toggle-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoAddAnnotationToggle'>
          Add New Annotation
        </button> 
      </div>

      <div class="row polyanno-add-new-row">
        <div class='polyannoAddNewContainer col-md-12'> 
          <textarea id='testingKeys' class='newAnnotation row' placeholder='Add new annotation text here'></textarea><br>
          <button type='button' class='btn addAnnotationSubmit polyannoEditorDropdownBtn row'>Submit <span class='glyphicon glyphicon-ok'></span></button>  
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

/////GENERIC FUNCTIONS

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

var getTargetJSON = function(target, callback_function) {

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

var updateAnno = function(targetURL, targetData, callback_function) {
  $.ajax({
    type: "PUT",
    url: targetURL,
    async: false,
    dataType: "json",
    data: targetData,
    success:
      function (data) { 
        if (!isUseless(callback_function)) {
          callback_function();
        };
      }
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

  ///this is not working because that polyanno_storage function was never built yet...
  var findByBodyURL = polyanno_urls.annotation.concat("body/"+encodeURIComponent(theText));
  //var the_regex = '/.*'+the_target_type+'.*/';
  var theChecking = checkFor(findByBodyURL, "target");
  if (  isUseless(theChecking[0])  ) { return false } 
  else {   
/* This is returning the JSON of annotation target of the type:
  {
    "id": "http:\/\/localhost:8080\/api\/vectors\/58bd6c0e6ef3451b18000007",
    "_id": "58bd6c2e6ef3451b1800000e",
    "format": "image\/SVG"
  }
  So the .id is only providing the URL alone, not the JSON
*/
    return fieldMatching(theChecking, "format", 'image/SVG').id;  
  };

};

var polyanno_annos_of_target = function(target, baseURL, callback_function) {

  var targetParam = encodeURIComponent(target);
  var aSearch = baseURL.concat("targets/"+targetParam);

  ///currently polyanno_storage is returning all annotations with this target, regardless of annotation type

  $.ajax({
    type: "GET",
    dataType: "json",
    url: aSearch,
    async: false,
    success: 
      function (data) {
        if (!isUseless(data.list[0])) {
          polyanno_search_annos_by_ids(data.list, baseURL, target, callback_function);
        }
        else if (!isUseless(callback_function)) {
          callback_function();
        };
      }
  });

};

var polyanno_search_annos_by_ids = function(childTexts, baseURL, target, callback_function) {
    var ids = [];
    childTexts.forEach(function(doc){
        ids.push(doc.body.id);
    });
    var theSearch = baseURL.concat("ids/"+encodeURIComponent(ids)+"/target/"+encodeURIComponent(target));

    //this is searching the transcriptions database for the actual docs
  
    $.ajax({
      type: "GET",
      dataType: "json",
      url: theSearch,
      async: false,
      success: 
        function (data) {
          callback_function(data.list);
        }
    });
};

var updateVectorSelection = function(the_vector_url) {

  ///this is the process for linking vectors

  var textData = {target: [{id: the_vector_url, format: "image/SVG"}]};
  selectingVector.forEach(function(child){
    ////check selectingVector is not anno
    updateAnno(child[0].body.id, textData);
  });

  var editorID = fieldMatching(editorsOpen, "tSelectedParent", selectingVector[0][0].parent).editor;
  //need to ensure asynchronicity here
  selectingVector = false;
  $(editorID).find(".polyanno-vector-link-row").css("display", "none");

};

var polyanno_voting_reload_editors = function(updatedTranscription, editorID, targetID) {
  if (updatedTranscription) {    
    polyanno_text_selected = targetID;
    closeEditorMenu(editorID, targetID);  
  };
  if (updatedTranscription && (!isUseless(vectorSelected))) {
    var updateTargetData = {};
    updateTargetData[polyanno_text_type_selected] = targetID;
    updateAnno(vectorSelected, updateTargetData);
  };

  ///////if the parent is open in an editor rebuild carousel with new transcription 
  editorsOpen.forEach(function(editorOpen){
    editorOpen.children.forEach(function(eachChild){
      if ( eachChild.id == polyanno_text_selectedID ){
        closeEditorMenu(editorOpen.editor, editorOpen.body.id);
      };
    });
  });

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

  $.ajax({
    type: "PUT",
    url: theVote,
    async: false,
    dataType: "json",
    data: targetData,
    success:
      function (data) {
        polyanno_voting_reload_editors(data.reloadText, editorID, targetID);
      }
  });

};


var findHighestRankingChild = function(parent, locationID) {
  var the_parent_json = getTargetJSON(parent);
  var theLocation = fieldMatching(the_parent_json.children, "id", locationID);
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

var polyanno_new_child_anno_created = function(baseURL) {
  //need to refer specifically to body text of that transcription - make body independent soon so no need for the ridiculously long values??
  polyanno_text_selectedHash = polyanno_text_selectedParent.concat("#"+polyanno_text_selectedID); 
  targetSelected = [polyanno_text_selectedHash];
  var targetData = {text: polyanno_text_selectedFragment, metadata: imageSelectedMetadata, parent: polyanno_text_selectedParent};
  var thisEditorString = $("#"+polyanno_text_selectedID).closest(".textEditorPopup").attr("id");
  
  $.ajax({
    type: "POST",
    url: baseURL,
    async: false,
    data: targetData,
    success: 
      function (data) {
        var createdText = data.url;
        polyanno_text_selected = createdText;
        var annoData = { body: { id: createdText }, target: [
          {id: polyanno_text_selectedHash, format: "text/html"}, 
          {id: polyanno_text_selectedParent, format: "application/json"}, 
          {id: imageSelected,  format: "application/json"  } ] };
        polyanno_add_annotationdata(annoData, thisEditorString);
      }
  });

};


var setpolyanno_text_selectedID = function(theText) {

  var findByBodyURL = polyanno_urls.annotation + "body/"+encodeURIComponent(theText);
  var the_regex = '/.*'+findBaseURL()+'.*/';
  var theTarget = fieldMatching(checkFor(findByBodyURL, "target"), "format", "text/html");
  if ( theTarget != false ) { 
    polyanno_text_selectedHash = theTarget.id;
    polyanno_text_selectedID = polyanno_text_selectedHash.substring(polyanno_text_selectedParent.length + 1); //the extra one for the hash   
    return theTarget.id;     
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
    ///
    insertSpanDivs();
    polyanno_text_selectedParent = polyanno_urls.transcription.concat(theParent);
    polyanno_text_type_selected = "transcription";
    targetType = "transcription";
    $(theTextIDstring).popover('hide'); 
    polyanno_new_child_anno_created(polyanno_urls.transcription);   
  });

  $('.openTranslationMenuNew').on("click", function(event) {
    insertSpanDivs();
    polyanno_text_selectedParent = polyanno_urls.translation.concat(theParent);
    polyanno_text_type_selected = "translation";
    targetType = "translation";
    $(theTextIDstring).popover('hide'); 
    polyanno_new_child_anno_created(polyanno_urls.translation);  
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
  var startParentClass = startNode.parentElement.parentElement.className;

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
    var outerElementHTML = $(outerElementTextIDstring).html().toString(); 

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

    newContent = outerElementStartContent + newSpan + outerElementEndContent;
    polyanno_text_selectedFragment = strangeTrimmingFunction(selection);

    initialiseNewTextPopovers(outerElementTextIDstring, startParentID);

  };
};

///// VIEWER WINDOWS

var createEditorPopupBox = function() {

  var dragon_opts = {
    "minimise": polyanno_minimising,
    "initialise_min_bar": false,
    "beforeclose": preBtnClosing
  };
  var polyannoEditorHTML = polyannoEditorHTML_partone + polyannoEditorHTML_options + polyannoEditorHTML_partfinal;
  var popupIDstring = add_dragondrop_pop("textEditorPopup", polyannoEditorHTML, "polyanno-page-body", dragon_opts, polyannoEditorHandlebarHTML);
  $(popupIDstring).find(".dragondrop-handlebar").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondrop-handlebar-obj").addClass("polyanno-colour-change"); 
  $(popupIDstring).find(".dragondropbox").addClass("textEditorBox");
  $(popupIDstring).find(".dragondrop-title").html(returnTextIcon(polyanno_text_type_selected));
  $(popupIDstring).find(".textEditorMainBox").find('*').addClass(polyanno_text_type_selected+"-text");

  return popupIDstring;

};

var polyanno_can_link = function(popupIDstring) {
  if ((!isUseless(targetType))&&(targetType.includes("vector") == false)){ 
    $(popupIDstring).find(".polyanno-vector-link-row").css("display", "block");
    //add event listener for this
  };
};

var polyanno_can_vote_add = function(popupIDstring) {
  if ( targetType.includes(polyanno_text_type_selected) ) {
    $(popupIDstring).find(".polyanno-add-new-toggle-row").css("display", "block");

    //enable listening event for voting display   
    ////improve to hover because otherwise flickering for small text displays!!
    $(popupIDstring).on("mouseover", ".polyanno-text-display", function(event){
      $(event.target).find(".polyanno-voting-overlay").css("display", "block");
    });
    $(popupIDstring).on("mouseout", ".polyanno-text-display", function(event){
      $(event.target).find(".polyanno-voting-overlay").css("display", "none");
    });

  };
};

var polyanno_is_new = function(popupIDstring, theSiblingArray) {
  if ( isUseless(theSiblingArray) || isUseless(theSiblingArray[0]) ) {

    $(popupIDstring).find(".polyanno-add-new-row")
    .css("display", "block")
    .attr("id", "addBox"+popupIDstring);

    return true;
  }
  else {
    return false;
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

  existingTextAnnos.forEach(function(subarray) {

    var theParagraphHTML = polyanno_build_text_display_row(subarray[0]);
    var thisItemID = subarray[0]._id;
    var thisItemURL = findBaseURL() + thisItemID;

    if (thisItemURL == polyanno_text_selected){
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
    //[[ {} ]]
    var itemHTML = polyanno_build_text_display_row(existingTextAnnos[0][0]);
    $(popupIDstring).find(".polyanno-top-voted").append(itemHTML);
  }
  else {
    polyanno_build_alternatives_list(existingTextAnnos, popupIDstring);
  };

};

var addEditorsOpen = function(popupIDstring) {
  return editorsOpen.push({
    "editor": popupIDstring,
    "typesFor": targetType,
    "vSelected": vectorSelected,
    "tSelectedParent": polyanno_text_selectedParent,
    "tSelectedID": polyanno_text_selectedID,
    "tSelectedHash": polyanno_text_selectedHash,
    "tTypeSelected": polyanno_text_type_selected,
    "children": polyanno_siblingArray
  });
};

var polyanno_reset_global_variables = function() {
  vectorSelected = false;
  polyanno_text_selectedParent = false;
  polyanno_text_selectedID = false;
  polyanno_text_selectedHash = false;
  polyanno_text_type_selected = false;
  polyanno_siblingArray = [];
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

var openEditorMenu = function(thisSiblingArray) {

  var popupIDstring = createEditorPopupBox();

  polyanno_can_link(popupIDstring);
  polyanno_can_vote_add(popupIDstring);

  var checkIfNew = polyanno_is_new(popupIDstring, thisSiblingArray);
  if (!checkIfNew) {
    polyanno_display_editor_texts(thisSiblingArray, popupIDstring);
    polyanno_populate_tags(thisSiblingArray[0][0], popupIDstring);
  };

  addEditorsOpen(popupIDstring); 

};

//////////////////////////////////////////////////////////////////


var returnTextIcon = function(polyanno_text_type_selected){
  if(polyanno_text_type_selected == "transcription") {
    return transcriptionIconHTML;
  }
  else if (polyanno_text_type_selected == "translation"){
    return translationIconHTML;
  };
};

var checkingItself = function(searchField, searchFieldValue, theType) {
  if (theType == searchField) { return false }
  else {  return fieldMatching(editorsOpen, searchField, searchFieldValue)[theType] };
};

var removeEditorsOpen = function(popupIDstring) {
  var theEditorItem = fieldMatching(editorsOpen, "editor", popupIDstring);
  var currentIndex = editorsOpen.indexOf(theEditorItem); 
  editorsOpen.splice(currentIndex,1);
};

var closeEditorMenu = function(thisEditor, reopen) {
  if (thisEditor.includes("#")) { thisEditor = thisEditor.split("#")[1]; };
  var the_editor_gone = dragondrop_remove_pop(thisEditor);
  if (!isUseless(the_editor_gone) && (!isUseless(reopen))) {
    polyanno_text_selected = reopen;
    polyanno_set_and_open("refresh");
    return the_editor_gone;
  }
  else {
    resetVectorHighlight(thisEditor);
    removeEditorsOpen(thisEditor);
    return the_editor_gone;
  }
};

var preBtnClosing = function(thisEditor) {
  resetVectorHighlight(thisEditor);
  removeEditorsOpen(thisEditor);
};

var findNewTextData = function(editorString) {

  var newText = $(editorString).find(".newAnnotation").val();
  var textData = {text: newText, metadata: imageSelectedMetadata, target: [{  "id": imageSelected,  "format": "application/json"  }]};

  if (targetType.includes("vector")) {
    ///get vectorSelected JSON
    //var theCoords = notFeature.notGeometry.notCoordinates;
    //var IIIFsection = getIIIFsectionURL(imageSelected, theCoords, "jpg");
    //textData.target.push({id: IIIFsection, format: "image/jpg"});
    textData.target.push({id: vectorSelected, format: "image/SVG"});
  };

  if (targetType.includes(polyanno_text_type_selected)) {
    textData.target.push({id: polyanno_text_selectedHash, format: "text/html"});
    textData.parent = polyanno_text_selectedParent;
  };

  if (textData.target[0] != 'undefined') { 
    return textData;
  };
  
};

var polyanno_add_annotationdata = function(thisAnnoData, thisEditor) {

  $.ajax({
    type: "POST",
    url: polyanno_urls.annotation,
    async: false,
    data: thisAnnoData,
    success: 
      function (data) {
        
      }
  });

  //if the annotation is a child then it is targeting its own type, so update parent
  if ((!isUseless(polyanno_text_type_selected)) && targetType.includes(polyanno_text_type_selected)) {

    var newHTML = $(outerElementTextIDstring).html();
    var polyanno_new_target_data = {text: newHTML, children: [{id: polyanno_text_selectedID, fragments: [{id: thisAnnoData.body.id}] }]};
    var polyanno_the_parent = polyanno_text_selectedParent;
    updateAnno(polyanno_the_parent, polyanno_new_target_data);

    //refresh parent editor setup
    var parentEditor = thisEditor;
    thisEditor = false; //prevent repeat opening later
    var closingTheParentMenu = function() {
      //closeEditorMenu(parentEditor, thisAnnoData.body.id); 
      $(thisEditor).find(".content-area").html(newHTML);
    };

    //open new editor for child text then as callback refresh the parent editor
    polyanno_set_and_open("text", closingTheParentMenu);

  };

  if (  targetType.includes("vector") && (  isUseless(polyanno_siblingArray) || isUseless(polyanno_siblingArray[0]) )) {
    var polyanno_new_target_data = {};
    polyanno_new_target_data[polyanno_text_type_selected] = thisAnnoData.body.id;
    var polyanno_this_vector = vectorSelected;
    updateAnno(polyanno_this_vector, polyanno_new_target_data);
  };
  
  if (!isUseless(thisEditor)) {  closeEditorMenu(thisEditor, thisAnnoData.body.id);  };

};

var polyanno_new_anno_of_vector_created = function(thisEditor){

  var editorString = "#" + thisEditor;
  var theData = findNewTextData(editorString);

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

        //closeEditorMenu(thisEditor);
        polyanno_add_annotationdata(thisAnnoData, thisEditor);
      }
  });

};

var polyanno_setting_global_variables = function(fromType) {

  if (fromType == "vector") {
    var does_vector_have_text = checkFor(vectorSelected, polyanno_text_type_selected); //return the api url NOT json file
    if (does_vector_have_text != false) {
      polyanno_text_selected = does_vector_have_text;
      var does_text_have_parent = checkFor(does_vector_have_text, "parent");
      if (does_text_have_parent != false) {
        polyanno_text_selectedParent = does_text_have_parent;
        var theHashHere = setpolyanno_text_selectedID(does_vector_have_text);
        targetType = "vector " + polyanno_text_type_selected;
        return targetSelected = [theHashHere, vectorSelected];
      }
      else {
        targetType = "vector";
        return targetSelected = [vectorSelected];
      };
    }
    else {
      targetType = "vector";
      return targetSelected = [vectorSelected];
    };
    
  }
  else if (fromType == "text") {
    var what_is_topvoted_here = findHighestRankingChild(polyanno_text_selectedParent, polyanno_text_selectedID);
    polyanno_text_selected = what_is_topvoted_here;
    var does_have_vector_target = checkForVectorTarget(what_is_topvoted_here); ///returning URL alone, NOT JSON
    if (does_have_vector_target != false) {
      vectorSelected =  does_have_vector_target;

      targetType = "vector " + polyanno_text_type_selected;
      return targetSelected = [polyanno_text_selectedHash, does_have_vector_target];
    }
    else {
      targetType = polyanno_text_type_selected;
      return targetSelected = [polyanno_text_selectedHash];
    };   
  }
  else if (fromType == "refresh") {
    var does_text_have_parent = checkFor(polyanno_text_selected, "parent");
    var does_have_vector_target = checkForVectorTarget(polyanno_text_selected); ///returning URL alone, NOT JSON
   if ((does_text_have_parent != false) && (does_have_vector_target != false)) {

      polyanno_text_selectedParent = does_text_have_parent;
      var theHashHere = setpolyanno_text_selectedID(does_vector_have_text);

      targetType = "vector " + polyanno_text_type_selected;
      return targetSelected = [theHashHere, does_have_vector_target];
    }
    else if ((does_text_have_parent != false) && (does_have_vector_target == false)) {
      alert("from refresh and has text but no vector and the text type selected is "+polyanno_text_type_selected);
      polyanno_text_selectedParent = does_text_have_parent;
      var theHashHere = setpolyanno_text_selectedID(does_vector_have_text);
      targetType = polyanno_text_type_selected;
      return targetSelected = [theHashHere];
    }
    else if ((does_text_have_parent == false) && (does_have_vector_target != false)) {
      targetType = "vector";
      return targetSelected = [does_have_vector_target];
    };
  };

};

var polyanno_set_and_open = function(fromType, callback_function) {
  var the_targets = polyanno_setting_global_variables(fromType);
  if (!isUseless(the_targets)) {
    polyanno_annos_of_target(targetSelected[0], findBaseURL(), openEditorMenu);
    if (!isUseless(callback_function)) { callback_function()  };
  };
};

var checkEditorsOpen = function(fromType, textType) {
  polyanno_text_type_selected = textType;
  if (isUseless(editorsOpen)) {    polyanno_set_and_open(fromType);  }
  else {
    var canOpen = true;
    editorsOpen.forEach(function(editorOpen){
      if ( ( (  !isUseless(editorOpen["vSelected"]) && (editorOpen["vSelected"] == vectorSelected)  )||( !isUseless(editorOpen["tSelectedParent"]) && editorOpen["tSelectedParent"] == polyanno_text_selectedParent)) && (editorOpen["tTypeSelected"] == textType)){
        $(editorOpen.editor).effect("shake");
        canOpen = false;
      };
    });
    if (canOpen == true) {  polyanno_set_and_open(fromType) };
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
      polyanno_siblingArray = target.children;
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

var getIIIFsectionURL = function (imageJSON, coordinates, format) {

    var imagewithoutinfo = imageJSON.split("/info.json",1);
    var imagewithoutinfoURL = imagewithoutinfo[0];
    /*
    var splitIndex = imagewithoutinfoURL.lastIndexOf("/");
    var image_id = imagewithoutinfoURL.substring(splitIndex +1);
    var baseImageURL = imagewithoutinfoURL.slice(0, splitIndex +1);
    */
    var regionParams = generateIIIFregion(coordinates);
    var theURL = imagewithoutinfoURL.concat(regionParams + "." + format);

    return theURL;
};


////INITIALISING AND SETUPS

///text selection

var polyanno_open_existing_text_transcription_menu = function() {

  ///not sure entirely about synchronicity of this but meh
  polyanno_reset_global_variables();

  var selection = getSelected(); 
  alert("running the function for old text annos and the outer element id is "+outerElementTextIDstring);

  polyanno_text_selectedID = startParentID;
  if (  !isUseless($(outerElementTextIDstring).parent().attr('id')) ){
    polyanno_text_selectedParent = polyanno_urls.transcription + $(outerElementTextIDstring).parent().attr('id'); 
  };
  polyanno_text_selectedHash = polyanno_text_selectedParent.concat("#"+polyanno_text_selectedID);
  checkEditorsOpen("text", "transcription");
  $(outerElementTextIDstring).popover('hide'); ////
};

var polyanno_open_existing_text_translation_menu = function() {

  ///not sure entirely about synchronicity of this but meh
  polyanno_reset_global_variables();

  var selection = getSelected(); 
  var classCheck = selection.anchorNode.parentElement.className;

  polyanno_text_selectedID = startParentID;
  if (  !isUseless($(outerElementTextIDstring).parent().attr('id')) ){
    polyanno_text_selectedParent = polyanno_urls.translation + $(outerElementTextIDstring).parent().attr('id'); 
  };
  polyanno_text_selectedHash = polyanno_text_selectedParent.concat("#"+polyanno_text_selectedID);
  checkEditorsOpen("text", "translation");
  $(outerElementTextIDstring).popover('hide'); ////
};

$('#polyanno-page-body').on("mouseup", '.content-area', function(event) {

  ///not sure entirely about synchronicity of this but meh
  polyanno_reset_global_variables();

  var selection = getSelected(); 
  var classCheck;
  if (!isUseless(selection) || !isUseless(selection.anchorNode.parentElement) ) {
    classCheck = selection.anchorNode.parentElement.className;
  };

  if ((classCheck.includes('openTranscriptionMenuOld'))||(classCheck.includes('openTranslationMenuOld')) ) { //if it is a popover within the selection rather than the text itself

    alert("trying to open menu of existing text annos");

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
    polyanno_annos_of_target(imageSelected, polyanno_urls.vector, polyanno_load_existing_vectors);
    polyanno_creating_vec();
    polyanno_vec_select();
    polyanno_vector_edit_setup();
    polyanno_image_popovers_setup();
  });
};

//load the existing vectors
var polyanno_load_existing_vectors = function(existingVectors) {

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
      }
      else {
        ///not sure entirely about synchronicity of this but meh
        polyanno_reset_global_variables();
      }

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

      $.ajax({
        type: "POST",
        url: polyanno_urls.vector,
        async: false,
        data: annoData,
        success: 
          function (data) {
            //setting global variables
            vectorSelected = data.url;
            targetType = "vector";
            targetSelected = [vectorSelected];

            targetData.body.id = data.url;
            polyanno_add_annotationdata(targetData);
            layer._leaflet_id = data.url;
            if (selectingVector == false) { layer.bindPopup(popupVectorMenu).openPopup(); }
            else {  updateVectorSelection(data.url); };
          }
      });

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
    alert("are you sure you want to delete that? I'm probably keeping it anyway whilst this project is in development.");

  });
};


var polyanno_image_popovers_setup = function() {

  $('#map').popover({ 
    trigger: 'manual',
    placement: 'top',
    html : true,
    title: closeButtonHTML,
    content: popupVectorParentMenuHTML
  });

  $('#map').on("shown.bs.popover", function(event) {

    $('#polyanno-page-body').on("click", '.openTranscriptionMenuParent', function(event) {
      checkEditorsOpen("vector", "transcription");
      $('#map').popover('hide');
    });
    $('#polyanno-page-body').on("click", '.openTranslationMenuParent', function(event) {
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
    var votedID = $(event.target).closest(".polyanno-text-display").find("p").attr("id");
    var currentTopText = $(event.target).closest(".textEditorPopup").find(".polyanno-top-voted").find("p").html();
    var thisEditor = $(event.target).closest(".textEditorPopup").attr("id");
    settingEditorVars(thisEditor);
    votingFunction("up", votedID, currentTopText, thisEditor);
  });
};

var polyanno_setup_editor_events = function() {

  $('#polyanno-page-body').on("click", '.addAnnotationSubmit', function(event) {
    var thisEditor = $(event.target).closest(".annoPopup").attr("id"); 
    settingEditorVars(thisEditor);
    polyanno_new_anno_of_vector_created(thisEditor);
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
    var thisEditor = $(event.target).closest(".textEditorPopup").attr("id"); 
    settingEditorVars(thisEditor);
    selectingVector = polyanno_siblingArray;
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

  document.getElementById("polyanno-top-bar").innerHTML = polyanno_top_bar_HTML;
  if (document.getElementById("polyanno-top-bar").innerHTML == polyanno_top_bar_HTML) {
    addIMEs(true, true, true);
  };

  ///this is currently compulsory and synchronous but should use a local storage in parallel soon too like Leaflet Draw?
  polyanno_setup_storage(opts.storage);

  if (!isUseless(opts.highlighting)) {  polyanno_setup_highlighting();  };

  if (!isUseless(opts.editor_options)) {  polyannoEditorHTML_options = polyannoEditorHTML_options_partone + opts.editor_options + polyannoEditorHTML_options_parttwo; };

  //var polyanno_image_title = polyanno_findLUNAimage_title(imageSelectedMetadata);
  var polyanno_image_title_HTML = " ";//"<span>"+polyanno_image_title()+"</span>";

  //will this induce synchronicity problems?
  $("#polyanno-page-body").addClass("atu-keyboard-parent");

  var image_viewer_id = add_dragondrop_pop( "polyanno-image-box", polyanno_image_viewer_HTML , "polyanno-page-body", polyanno_minimising, polyanno_image_title_HTML );
  $(image_viewer_id).find(".dragondrop-close-pop-btn").css("display", "none");
  $(image_viewer_id).attr("id", "imageViewer");

  polyanno_leaflet_basic_setup();

  initialise_dragondrop("polyanno-page-body", {"minimise": polyanno_minimising });

  if (!isUseless(opts.users)) { polyanno_setup_users(opts.users); };

  polyanno_setup_editor_events();

};


