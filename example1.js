

imageSelected = "http://images.is.ed.ac.uk/luna/servlet/iiif/UoEwmm~2~2~77099~164515/info.json";

///defining setup options in a separate variable

var polyanno_setup_options = {
  "highlighting": true,
  "minimising": true,
  "voting": true
};

//this is assuming the defaults of storage URLs using the web page url and polyanno_storage for storage and no users

polyanno_setup(polyanno_setup_options);

//test cases

var t1 = new Polyanno.annotation({
  _id: 21376127467,
  body: {
    "id": "mooo"
  },
  target: [{
    "id": "sheep"
  }]
});


Polyanno.annotations.add(t1);


var t2 = Polyanno.getAnnotationsByTarget("sheep");

alert("getby targets returns"+JSON.stringify(t2));



