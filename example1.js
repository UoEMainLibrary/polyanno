
imageSelected = "https://images.is.ed.ac.uk/luna/servlet/iiif/UoEwmm~2~2~77099~164515/info.json";

var polyanno_setup_options = {
  "highlighting": true,
  "minimising": true,
  "voting": true
};

//this is assuming the defaults of storage URLs using the web page url and polyanno_storage for storage and no users
polyanno_setup(polyanno_setup_options);

alert(JSON.stringify(Object.getOwnPropertyNames(Polyanno.selected.textHighlighting)));
