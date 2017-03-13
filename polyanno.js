
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
/*
{     siblings: polyanno_siblingArray,
      parent_anno : polyanno_siblingArray[0].parent,
      parent_vector : checkForVectorTarget(parent_anno)
}*/
var findingcookies = document.cookie;

var $langSelector = false;
var $imeSelector = false;

////leaflet

var polyanno_map;
var baseLayer;
var allDrawnItems = new L.FeatureGroup();
var temp_merge_shape = new L.FeatureGroup();
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

//merging variables
var polyanno_merging_vectors = false;
var polyanno_temp_merge_shape = false; ///Leaflet layer not just GeoJSON
var polyanno_merging_array = [];

var polyanno_merging_transcription = []; ///equal to the children array of parent anno
var polyanno_merging_translation = []; ///equal to the children array of parent anno

////HTML VARIABLES

var polyanno_transcribe_symbol = "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-list-alt'></span>";
var polyanno_translate_symbol = "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-globe'></span>";
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


var openHTML = "<div class='popupAnnoMenu'>";
var transcriptionOpenHTML = `<a class="openTranscriptionMenu polyanno-standard-btn btn btn-default" onclick="checkEditorsOpen('vector', 'transcription');
      polyanno_map.closePopup();">`+polyanno_transcribe_symbol+`</a><br>`;
var translationOpenHTML = `<a class="openTranslationMenu polyanno-standard-btn btn btn-default" onclick="checkEditorsOpen('vector', 'translation');
      polyanno_map.closePopup();">`+polyanno_translate_symbol+`</a>`;
var endHTML = "</div>";
var popupVectorMenuHTML = openHTML + transcriptionOpenHTML + translationOpenHTML + endHTML;


var polyanno_image_viewer_HTML = `<div id='polyanno_map' class="row"></div>`;

var polyanno_merging_transcription_HTML = `
                                    <div class="row">
                                      <h2>The New Transcription:</h2>
                                    </div>
                                    <div id="polyanno_merging_transcription" class="row">
                                    </div>`;
var polyanno_merging_translation_HTML = `
                                    <div class="row">
                                      <h2>The New Translation:</h2>
                                    </div>
                                    <div id="polyanno_merging_translation" class="row">
                                    </div>`;

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

var popupSelectingVectorHTML = `
  <div id="popupTranscriptionNewMenu" class="popupAnnoMenu">
    <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_setting_selecting_vector(); polyanno_map.closePopup();">Submit</a>
    <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_reset_selecting_vector(); polyanno_map.closePopup();">Cancel</a>
  </div>
`;

var popupTranscriptionNewMenuHTML = `
  <!-- New Transcription Text Select Popup Menu -->
  <div id="popupTranscriptionNewMenu" class="popupAnnoMenu">
     <div data-role="main" class="ui-content">
        <a class="openTranscriptionMenuNew transcriptionTarget editorPopover btn btn-default polyanno-standard-btn">`+polyanno_select_fragment_symbol+`</a></br>
        <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
     </div>
  </div>
`;

var popupTranslationNewMenuHTML = `
  <!-- New Translation Text Select Popup Menu -->
  <div id="popupTranslationNewMenu" class="popupAnnoMenu" >
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuNew translationTarget editorPopover ui-btn ui-corner-all polyanno-standard-btn">`+polyanno_select_fragment_symbol+`</a></br>
        <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
      </div>
  </div>  
`;

var popupTranscriptionChildrenMenuHTML = `
  <!-- Children Transcription Text Select Popup Menu-->
  <div id="popupTranscriptionChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranscriptionMenuOld editorPopover btn btn-default polyanno-standard-btn" onclick="polyanno_open_existing_text_transcription_menu();">`+polyanno_fragment_alternatives_symbol+`</a>
        <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
      </div>
  </div>
`;
var popupTranslationChildrenMenuHTML = `
  <!-- Children Translation Text Select Popup Menu -->
  <div id="popupTranslationChildrenMenu" class="popupAnnoMenu">
      <div data-role="main" class="ui-content">
        <a class="openTranslationMenuOld editorPopover btn btn-default polyanno-standard-btn" onclick="polyanno_open_existing_text_translation_menu();">`+polyanno_fragment_alternatives_symbol+`</a>
        <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn"><span class="glyphicon glyphicon glyphicon-comment"></span> Discuss</a>
      </div>
  </div>
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
  ///this is the process for linking vectors to text segments
  var textData = {target: [{id: the_vector_url, format: "image/SVG"}]};
  selectingVector.siblings.forEach(function(child){
    updateAnno(child[0].body.id, textData);
  });

  var editorID = fieldMatching(editorsOpen, "tSelectedParent", selectingVector.parent_anno).editor;
  //need to ensure asynchronicity here
  selectingVector = false;
  $(editorID).find(".polyanno-vector-link-row").css("display", "none");
  ///update editorsOpen to activate highlighting

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

var polyanno_find_highest_ranking_frag_child = function(location_json) {
  var the_child = fieldMatching(location_json.fragments, "rank", 0); 
  return findField(the_child, "id");
};

var findHighestRankingChild = function(the_parent_json_children, locationID) {
  var theLocation = fieldMatching(the_parent_json_children, "id", locationID);
  return polyanno_find_highest_ranking_frag_child(theLocation);
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

var polyanno_new_anno_via_selection = function(baseURL) {
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
        polyanno_add_annotationdata(annoData, false, thisEditorString, [data.url], [false], [polyanno_text_selectedParent]);
      }
  });

};

var polyanno_new_translation_via_linking = function(merged_vector) {

};

var polyanno_new_transcription_via_linking = function(merged_vector) {

};

var polyanno_new_annos_via_linking = function(merged_vector) {
  var linked_transcriptions = $("#polyanno_merging_transcription").html();
  var linked_translations = $("#polyanno_merging_translation").html();

  var transcription_data = {text: linked_transcriptions, children: polyanno_merging_transcription, metadata: imageSelectedMetadata};
  var translation_data = {text: linked_translations, children: polyanno_merging_translation, metadata: imageSelectedMetadata};

  ///dealing sequentially to address global variables problems??

  /*
  var annoData = { body: { id: data.url }, target: [
          {id: merged_vector, format: "image/SVG" },
          {id: imageSelected,  format: "application/json"  } ] };
  */    
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
    polyanno_new_anno_via_selection(polyanno_urls.transcription);   
  });

  $('.openTranslationMenuNew').on("click", function(event) {
    insertSpanDivs();
    polyanno_text_selectedParent = polyanno_urls.translation.concat(theParent);
    polyanno_text_type_selected = "translation";
    targetType = "translation";
    $(theTextIDstring).popover('hide'); 
    polyanno_new_anno_via_selection(polyanno_urls.translation);  
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

var polyanno_shake_the_popups = function() {
  $(".annoPopup").effect("shake", {
    direction: "right",
    distance: 10,
    times: 2
  });
};

var createEditorPopupBox = function() {

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
    $(popupIDstring).on("mouseenter", ".polyanno-text-display", function(event){
      //$(event.target).find(".polyanno-voting-overlay").css("display", "block");
      $(event.target).find(".polyanno-voting-overlay").show("swing");
    });
    $(popupIDstring).on("mouseleave", ".polyanno-text-display", function(event){
      //$(event.target).find(".polyanno-voting-overlay").css("display", "none");
      $(event.target).find(".polyanno-voting-overlay").hide("swing");
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

var closeEditorMenu = function(thisEditor, reopen, text_selected, this_vector, text_parent, text_siblings) {
  if (thisEditor.includes("#")) { thisEditor = thisEditor.split("#")[1]; };
  var the_editor_gone = dragondrop_remove_pop(thisEditor);
  if (!isUseless(the_editor_gone) && (!isUseless(reopen))) {
    polyanno_text_selected = reopen;
    polyanno_set_and_open("refresh", false, text_selected, this_vector, text_parent, text_siblings);
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
  return {text: newText, metadata: imageSelectedMetadata, target: [{  "id": imageSelected,  "format": "application/json"  }]};
  
};

var polyanno_add_annotationdata = function(thisAnnoData, thisEditor, parentEditor, this_text, this_vec, this_parent, text_siblings) {

  $.ajax({
    type: "POST",
    url: polyanno_urls.annotation,
    async: false,
    data: thisAnnoData,
    success: 
      function (data) {
        
      }
  });

  //refresh parent editor setup
  var closingTheParentMenu = function() {
    $(parentEditor).find(".content-area").html(newHTML);
  };

  //if the annotation is a child then it is targeting its own type, so update parent
  if ((!isUseless(polyanno_text_type_selected)) && targetType.includes(polyanno_text_type_selected)) {

    var newHTML = $(outerElementTextIDstring).html();
    var polyanno_new_target_data = {text: newHTML, children: [{id: polyanno_text_selectedID, fragments: [{id: thisAnnoData.body.id}] }]};
    var polyanno_the_parent = polyanno_text_selectedParent;
    updateAnno(polyanno_the_parent, polyanno_new_target_data);

    //open new editor for child text then as callback refresh the parent editor
    polyanno_set_and_open("text", closingTheParentMenu, [thisAnnoData.body.id], false, [polyanno_the_parent], text_siblings);

  };

  if (  targetType.includes("vector") && (  isUseless(polyanno_siblingArray) || isUseless(polyanno_siblingArray[0]) )) {
    var polyanno_new_target_data = {};
    polyanno_new_target_data[polyanno_text_type_selected] = thisAnnoData.body.id;
    var polyanno_this_vector = vectorSelected;
    updateAnno(polyanno_this_vector, polyanno_new_target_data);

  };
  
  if (!isUseless(thisEditor)) {  closeEditorMenu(thisEditor, false, this_text, this_vec, this_parent, text_siblings);  };

};

var polyanno_new_anno_via_text_box = function(thisEditor){

  var editorString = "#" + thisEditor;
  var theData = findNewTextData(editorString);
  var this_parent = false;
  var this_vec = false;
  if (targetType.includes("vector")) {
    var vector_layer = polyanno_map.getLayer(vectorSelected);
    var theCoords = vector_layer.geometry.coordinates[0];
    var IIIFsection = getIIIFsectionURL(imageSelected, theCoords, "jpg");
    textData.target.push({id: IIIFsection, format: "image/jpg"});
    textData.target.push({id: vectorSelected, format: "image/SVG"});
    this_vec = vectorSelected;
  };

  if (targetType.includes(polyanno_text_type_selected)) {
    textData.target.push({id: polyanno_text_selectedHash, format: "text/html"});
    textData.parent = polyanno_text_selectedParent;
    this_parent = polyanno_text_selectedParent;
  };

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

        closeEditorMenu(thisEditor);
        polyanno_add_annotationdata(thisAnnoData, thisEditor, false, [data.url], this_vec, this_parent);
      }
  });

};

var polyanno_setting_global_variables = function(fromType, text_selected, this_vector_selected, text_parent) {

  if (fromType == "vector") {
    var does_vector_have_text;
    if (isUseless(text_selected)) { does_vector_have_text = checkFor(vectorSelected, polyanno_text_type_selected); } //return the api url NOT json file 
    else { does_vector_have_text = text_selected[0]; };

    if (does_vector_have_text != false) {
      polyanno_text_selected = does_vector_have_text;
      var does_text_have_parent;
      if (isUseless(text_parent)) { does_text_have_parent = checkFor(does_vector_have_text, "parent"); }
      else { does_text_have_parent = text_parent[0]; };
      
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
    var what_is_topvoted_here;
    if (isUseless(text_selected)) { 
      var the_parent_json = getTargetJSON(polyanno_text_selectedParent);
      what_is_topvoted_here = findHighestRankingChild(the_parent_json.children, polyanno_text_selectedID); 
    }
    else { what_is_topvoted_here = text_selected[0]; };

    polyanno_text_selected = what_is_topvoted_here;

    var does_have_vector_target;
    if (isUseless(this_vector_selected)) { does_have_vector_target = checkForVectorTarget(what_is_topvoted_here); } ///returning URL alone, NOT JSON
    else { does_have_vector_target = this_vector_selected[0]; };

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
    var does_text_have_parent;
    if (isUseless(text_parent)) { does_text_have_parent = checkFor(polyanno_text_selected, "parent"); }
    else { does_text_have_parent = text_parent[0]; };

    var does_have_vector_target;
    if (isUseless(this_vector_selected)) { does_have_vector_target = checkForVectorTarget(polyanno_text_selected); } ///returning URL alone, NOT JSON
    else { does_have_vector_target = this_vector_selected[0]; };

   if ((does_text_have_parent != false) && (does_have_vector_target != false)) {

      polyanno_text_selectedParent = does_text_have_parent;
      var theHashHere = setpolyanno_text_selectedID(does_vector_have_text);

      targetType = "vector " + polyanno_text_type_selected;
      return targetSelected = [theHashHere, does_have_vector_target];
    }
    else if ((does_text_have_parent != false) && (does_have_vector_target == false)) {
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

var polyanno_set_and_open = function(fromType, callback_function, text_selected, this_vector, text_parent, text_siblings) {
  var the_targets = polyanno_setting_global_variables(fromType, text_selected, this_vector, text_parent);
  if (!isUseless(the_targets) && (isUseless(text_siblings))) {
    polyanno_annos_of_target(targetSelected[0], findBaseURL(), openEditorMenu);
    if (!isUseless(callback_function)) { callback_function()  };
  }
  else {
    openEditorMenu(text_siblings);
  };
};

var checkEditorsOpen = function(fromType, textType) {
  polyanno_text_type_selected = textType;
  if (isUseless(editorsOpen)) {    polyanno_set_and_open(fromType, false, polyanno_text_selected, vectorSelected, polyanno_text_selectedParent, polyanno_siblingArray);  }
  else {
    var canOpen = true;
    editorsOpen.forEach(function(editorOpen){
      if ( ( (  !isUseless(editorOpen["vSelected"]) && (editorOpen["vSelected"] == vectorSelected)  )||( !isUseless(editorOpen["tSelectedParent"]) && editorOpen["tSelectedParent"] == polyanno_text_selectedParent)) && (editorOpen["tTypeSelected"] == textType)){
        $(editorOpen.editor).effect("shake");
        canOpen = false;
      };
    });
    if (canOpen == true) {  polyanno_set_and_open(fromType, false, polyanno_text_selected, vectorSelected, polyanno_text_selectedParent, polyanno_siblingArray) };
  };
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

////HIGHLIGHTING 

var highlightVectorChosen = function(chosenVector, colourChange) {
  allDrawnItems.eachLayer(function(layer){
    if(layer._leaflet_id == chosenVector) {
      layer.setStyle({color: colourChange});
    };
  });
  //polyanno_map.getLayer(chosenVector).setStyle({color: colourChange});
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
      alert("the angle that currently represents a notch is "+JSON.stringify(the_vertex_array)+" with an angle of "+the_angle);
      notches_array.push(the_vertex_array);
    };
  };
  alert("so the final notches array is "+JSON.stringify(notches_array));
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
      if (is_new_inside.length > 0) && (justOverlap) {
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
  alert("the final merged shape coords are "+JSON.stringify(final_merge_shape_coords));
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
  if (!isUseless(concavity_check)) {
    if (isUseless(tempGeoJSON.properties)) {  tempGeoJSON.properties = {};  };
    tempGeoJSON.properties.OCD = concavity_check;
  };

  ///replace with setLatLngs method??
  tempGeoJSON.geometry.coordinates[0] = new_merge_coords;

  temp_merge_shape.removeLayer(temp_shape_layer);

  L.geoJson(tempGeoJSON, 
        { onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            polyanno_temp_merge_shape = layer
          }
        }).addTo(polyanno_map);
  temp_merge_shape.setStyle({color: "yellow"});
  temp_merge_shape.bringToBack();
};

var polyanno_add_first_merge_shape = function(shape_to_copy) {

  var shapeGeoJSON = shape_to_copy.toGeoJSON();
  var tempGeoJSON = {  "type": "Feature",  "properties":{},  "geometry":{"type": "Polygon", "coordinates": shapeGeoJSON.geometry.coordinates}  };
  L.geoJson(tempGeoJSON, 
        { onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            polyanno_temp_merge_shape = layer
          }
        }).addTo(polyanno_map);

  temp_merge_shape.setStyle({color: "yellow"});
  temp_merge_shape.bringToBack();
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
        { onEachFeature: function (feature, layer) {
            temp_merge_shape.addLayer(layer),
            layer.bringToBack(),
            polyanno_temp_merge_shape = layer
          }
        }).addTo(polyanno_map);
  temp_merge_shape.setStyle({color: "yellow"});
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

var polyanno_load_merging_anno = function(new_vec, text_type) {
  var this_id = new_vec.properties[text_type]; 
  var this_json = getTargetJSON();
  var this_display_id = "#polyanno_merging_"+text_type;
  var old_text = $(this_display_id).html();
  var new_frag_id = Math.random().toString().substring(2);
  var this_class = text_type.concat("-text");
  var the_new_span = "<a class='" + newSpanClass(this_class) + " ' id='" + new_frag_id + "' >" + this_json.text + "</a>";
  var new_text = old_text.concat(the_new_span);
  $(this_display_id).html(new_text);
  var new_fragment = {id: new_frag_id, fragments: [{id: this_id}]};
  return new_fragment;
};

var polyanno_add_merge_annos = function(new_vec_layer) {
  var new_vec = new_vec_layer.toGeoJSON();
  if ((!isUseless(new_vec.properties)) && (!isUseless(new_vec.properties.transcription))) { 
    var new_frag = polyanno_load_merging_anno(new_vec, "transcription");
    polyanno_merging_transcription.push(new_frag);
  };
  if ((!isUseless(new_vec.properties)) && (!isUseless(new_vec.properties.translation))) { 
    var new_frag = polyanno_load_merging_anno(new_vec, "translation");
    polyanno_merging_translation.push(new_frag);
  };
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
    var the_index = polyanno_extracting_merged_anno("transcription", polyanno_merging_transcription, vec_removed.properties.transcription);
    polyanno_merging_transcription.slice(the_index, 1);
  };
  if ((!isUseless(vec_removed.properties))&&(!isUseless(vec_removed.properties.translation))) { 
    var the_index = polyanno_extracting_merged_anno("translation", polyanno_merging_translation, vec_removed.properties.translation);
    polyanno_merging_translation.slice(the_index, 1);
  };
};

///////
var polyanno_setting_selecting_vector = function() {
  var this_layer = allDrawnItems.getLayer(vectorSelected);
  polyanno_new_vector_made(this_layer, this_layer.shape, vector_is_child_of);
};
var polyanno_reset_selecting_vector = function() {
  var this_layer = allDrawnItems.getLayer(vectorSelected);
  allDrawnItems.removeLayer(this_layer);
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

  var selection = getSelected(); 

  ///not sure entirely about synchronicity of this but meh
  polyanno_reset_global_variables();

  polyanno_text_selectedID = startParentID;
  if (  !isUseless($(outerElementTextIDstring).parent().attr('id')) ){
    polyanno_text_selectedParent = polyanno_urls.transcription + $(outerElementTextIDstring).parent().attr('id'); 
    alert("so now the text selected parent is "+polyanno_text_selectedParent);
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
    polyanno_annos_of_target(imageSelected, polyanno_urls.vector, polyanno_load_existing_vectors);
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
            layer.bindPopup(popupVectorMenu),
            layer.setStyle({color: polyanno_default_colours_array[1]})
          }
        }).addTo(polyanno_map);

    });
  };
};

var polyanno_new_vector_made = function(layer, shape, vector_parent, vector_children, callback_function) {
  var annoData = {geometry: shape.geometry, OCD: shape.properties.OCD, metadata: imageSelectedMetadata, parent: vector_parent, children: vector_children };

  if (selectingVector != false) { 
    var theTopText = findHighestRankingChild(selectingVector.parent_anno, polyanno_text_selectedID);
    annoData[polyanno_text_type_selected] = theTopText;  
  }
  else {
    ///not sure entirely about synchronicity of this but meh
    polyanno_reset_global_variables();
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
        polyanno_add_annotationdata(targetData, false, false, [false], [data.url], []);

        layer._leaflet_id = data.url;
        if (selectingVector == false) { layer.bindPopup(popupVectorMenu).openPopup(); }
        else {  updateVectorSelection(data.url); };

        if (!isUseless(callback_function)) {  callback_function(data.url);  };
      }
  });

};

var polyanno_linking_annos_to_vector_checks = function(layer) {
  var shape = layer.toGeoJSON();
  var checkingOverlapping = check_this_shape_for_overlapping(shape, allDrawnItems, false, true, false); //don't complete children array, do complete parent array
  allDrawnItems.addLayer(layer);
  if ((checkingOverlapping[0] == 2) && (checkingOverlapping[1].includes(selectingVector.parent_vector))) {  ///inside the correct vector
    layer.bindPopup(popupSelectingVectorHTML).openPopup();
  }
  else { 
    alert("Please draw inside the correct larger shape!");
    polyanno_map.fitBounds(selectingVector.parent_vector.toGeoJSON().geometry.coordinates[0]);
  };
};

var polyanno_creating_vec = function() {
  polyanno_map.on(L.Draw.Event.CREATED, function(evt) {

    ////assuming not triggered event when the merge shape is added manually

    var layer = evt.layer;

    if ( selectingVector != false )   {      ///drawing a new vector for a smaller text fragment
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
      ///////inside another shape but not whilst selectingVector
      else if (checkingOverlapping[0] == 2)  {   
        allDrawnItems.removeLayer(layer);
        vectorSelected = checkingOverlapping[1][0];
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

    currentlyDeleting = true;
    ///check if vector has any annotations
    ///if it does then prevent deleting and alert that it has annotations and admin privileges needed to do that
    var theURL = polyanno_urls.annotation +"/target/" + vector_url;
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
    if((!isUseless(vec.layer.properties)) && (!isUseless(vec.layer.properties.parent))){
      vectorSelectedParent = vec.layer.properties.parent;
    };

    if (currentlyEditing || currentlyDeleting) {}
    else if (selectingVector != false) {  
      vec.layer.closePopup();
      alert("Draw a new shape around the text on the image!");
      polyanno_map.fitBounds(selectingVector.parent_vector.toGeoJSON().geometry.coordinates[0]);
      $(".leaflet-draw-toolbar-top").effect("highlight");
    }
    else if (polyanno_merging_vectors) {
      ///need to introduce parents checks??
      vec.layer.closePopup();
      if (polyanno_merging_array.includes(vec.layer)) {
        //unclick and remove this vector
        var the_index = polyanno_merging_array.indexOf(vec.layer);
        polyanno_remove_merge_number(vec.layer, polyanno_merging_array, the_index);
        polyanno_merging_array.splice(the_index, 1);
        polyanno_remove_merge_annos(vec.layer);
        polyanno_remove_merge_shape(vec.layer, polyanno_temp_merge_shape);
      }
      else if (polyanno_temp_merge_shape != false) {
        //click and merge this vector
        polyanno_merging_array.push(vec.layer);
        polyanno_update_merge_shape(polyanno_temp_merge_shape, vec.layer, polyanno_merging_array);
        polyanno_add_merge_numbers(vec.layer, polyanno_merging_array);
        polyanno_add_merge_annos(vec.layer);
      }
      else {
        //click and start the new merge shape
        polyanno_merging_array.push(vec.layer);
        polyanno_add_first_merge_shape(vec.layer);
        polyanno_add_merge_numbers(vec.layer, polyanno_merging_array);
        polyanno_add_merge_annos(vec.layer);
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
    updateAnno(vectorSelected, shape); ////////////
    /////
  });
};

var polyanno_leaflet_vector_to_json = function(layer){

  var vector = {  "type": "Feature",  "properties":{},  "geometry":{}  };

  vector.id = layer._leaflet_id;
  vector.notFeature.notGeometry.notType = layer.geometry.type;
  vector.notFeature.notGeometry.notCoordinates = layer.geometry.coordinates[0];
  vector.transcription = findField("layer.properties", "transcription");
  vector.translation = findField("layer.properties", "translation");
  vector.parent = findField("layer.properties", "parent");
  vector.OCD = findField("layer.properties", "OCD");

  return vector;

};

///creating the new Leaflet Merging Toolbar

var polyanno_leaflet_merge_toolbar_setup = function() {

  ///also setup drawing tools under submenu??

    /* A sub-action which completes as soon as it is activated.
   * Sub-actions receive their parent action as an argument to
   * their `initialize` function. We save a reference to this
   * parent action so we can disable it as soon as the sub-action
   * completes.
   */

  var polyanno_merge_leaflet_subaction = L.ToolbarAction.extend({
      options: {
          toolbarIcon: {
              html: '<a href="#">Merge</a>',
              tooltip: 'Merge'
          }   
      },
      initialize: function(this_map, merging_action) {
          this.map = this_map;
          this.merging_action = merging_action;
          L.ToolbarAction.prototype.initialize.call(this);                
      },
      addHooks: function() {
          ///
          this.merging_action.disable();
      }
  });

  var polyanno_merge_submit = polyanno_merge_leaflet_subaction.extend({
            options: {
                toolbarIcon: {
                    html: '<a href="#">Submit</a>',
                    tooltip: 'Complete'
                }   
            },
            addHooks: function () {
              ///
            }
        });

  var polyanno_merge_cancel = polyanno_merge_leaflet_subaction.extend({
            options: {
                toolbarIcon: {
                    html: '<a href="#">Cancel</a>',
                    tooltip: 'Cancel'
                }   
            },
            addHooks: function () {
                //
            }
        });

  /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
   * by definition, contained inside another toolbar, so it
   * doesn't need the additional styling and behavior of a
   * L.Toolbar.Control or L.Toolbar.Popup.
   */

  var polyanno_merge_action = L.ToolbarAction.extend({
            options: {
                toolbarIcon: {
                    className: '',
                },
                subToolbar: new L.Toolbar({ 
                    actions: [polyanno_merge_submit, polyanno_merge_cancel]
                })
            }
        });

  new L.Control.Toolbar({
      options: {
          position: 'topleft',
          actions: [  polyanno_merge_action  ],
          className: 'polyanno-leaflet-merge-toolbar' // Style the toolbar with 
      }
  }).addTo(polyanno_map);

};

var polyanno_closing_merging = function() {
  polyanno_temp_merge_shape = false;
  polyanno_merging_transcription = [];
  polyanno_merging_translation = [];
  polyanno_merging_array = [];
  $(".leaflet-draw-toolbar-top").css("color", "#333");
  $(".annoPopup").css("opacity", 1.0);
  $(".polyanno-merging-buttons").toggle("swing");
  var transcription_id = $("#polyanno_merging_transcription").closest(".annoPopup").attr("id");
  var translation_id = $("#polyanno_merging_translation").closest(".annoPopup").attr("id");
  alert("the display ids are "+transcription_id+" and "+translation_id);
  dragondrop_remove_pop(transcription_id);
  dragondrop_remove_pop(translation_id);

};

var polyanno_leaflet_merge_polyanno_button_setup = function() {

  $("#polyanno-merge-shapes-enable").on("click", function(event){
      polyanno_merging_vectors = true;
      ///add class "active" to button to stay pressed??
      var this_transcription_display = add_dragondrop_pop("polyanno_merging_annos", polyanno_merging_transcription_HTML, "polyanno-page-body", true, null, true);
      var this_translation_display = add_dragondrop_pop("polyanno_merging_annos", polyanno_merging_translation_HTML, "polyanno-page-body", true, null, true);
      ///need to set highlighted display??
      $(".polyanno-merging-buttons").toggle("swing");
      $(".leaflet-draw-toolbar-top").css("color", "yellow");
      $(".annoPopup").css("opacity", 0.3);
      $("#imageViewer").css("opacity", 1.0);
  });


  $(".polyanno-merge-shapes-submit-btn").on("click", function (event) {
    if (polyanno_merging_array.length > 1) {
      var shape = polyanno_temp_merge_shape.toGeoJSON();
      allDrawnItems.addLayer(polyanno_temp_merge_shape);
      temp_merge_shape.removeLayer(polyanno_temp_merge_shape);
      polyanno_new_vector_made(polyanno_temp_merge_shape, shape, false, polyanno_merging_array, polyanno_new_annos_via_linking); //layer, shape, parent, children, callback
      polyanno_closing_merging();
    }
    else {
      temp_merge_shape.removeLayer(polyanno_temp_merge_shape);
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
    var thisEditor = $(event.target).closest(".annoPopup").attr("id"); 
    settingEditorVars(thisEditor);
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
    var thisEditor = $(event.target).closest(".textEditorPopup").attr("id"); 
    settingEditorVars(thisEditor);
    var parent_vector_id = checkForVectorTarget(parent_anno);
    var the_parent_vector = allDrawnItems.getLayer(parent_vector_id);
    selectingVector = {
      siblings: polyanno_siblingArray,
      parent_anno : polyanno_siblingArray[0].parent,
      parent_vector : the_parent_vector
    };
    polyanno_map.fitBounds(selectingVector.parent_vector.toGeoJSON().geometry.coordinates[0]);
    highlightVectorChosen(parent_vector_id, "yellow");
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
  var polyanno_image_title_HTML = "<span class='glyphicon glyphicon-picture'></span>";//"<span>"+polyanno_image_title()+"</span>";

  //will this induce synchronicity problems?
  $("#polyanno-page-body").addClass("atu-keyboard-parent");

  var image_viewer_id = add_dragondrop_pop( "polyanno-image-box", polyanno_image_viewer_HTML , "polyanno-page-body", polyanno_minimising, polyanno_image_title_HTML, true );
  $(image_viewer_id).show("fold");
  $(image_viewer_id).attr("id", "imageViewer");

  polyanno_leaflet_basic_setup();

  initialise_dragondrop("polyanno-page-body", {"minimise": polyanno_minimising });

  polyanno_setup_editor_events();

};


