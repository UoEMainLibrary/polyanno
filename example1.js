
imageSelected = "https://images.is.ed.ac.uk/luna/servlet/iiif/UoEwmm~2~2~77099~164515/info.json";

var polyanno_setup_options = {
  "highlighting": true,
  "minimising": true,
  "voting": true
};

//this is assuming the defaults of storage URLs using the web page url and polyanno_storage for storage and no users
polyanno_setup(polyanno_setup_options);

alert(JSON.stringify(Object.getOwnPropertyNames(Polyanno.collections.prototype))+"\nand the vectors are "+JSON.stringify(Object.getOwnPropertyNames(Polyanno.vectors)));

Polyanno.vectors.on("polyanno_created", function(e){
	alert(" a vector was created and the event details were: \n "+JSON.stringify(e)+"!");
});

Polyanno.annotations.on("polyanno_created", function(e){
	alert(" an annotation was created and the event details were: \n "+JSON.stringify(e)+"!");
});

Polyanno.selected.vectors.on("polyanno_created", function(e){
	alert("something was added to the selected collection and the event details were: \n "+JSON.stringify(e)+"!");
});

alert("so the vector listeners are: \n"+JSON.stringify(Polyanno.vectors.listeners)+"\nand the annotation listeners are: \n"+JSON.stringify(Polyanno.annotations.listeners)+"\nand the translations listeners are: \n"+JSON.stringify(Polyanno.translations.listeners));
