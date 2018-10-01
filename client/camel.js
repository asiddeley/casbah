
/**********************************
CASBAH * Contract Administration System Be Architectural Heroes *

MIT License

Copyright (c) 2018 Andrew Siddeley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

********************************/

	
///////////////////////
// CAMEL = Contract Admin Main/Many Exploratory Llama.  

function Camel(argo){
	that=this;
	
	//argument object
	argo=$.extend({
		name:null,
		path:"uploads" 
	}, argo);
	
	//only one camel active at a time, this camel is now the main one 
	Camel.prototype.mainCamel=this;

	//update static list of all instantiated camels
	Camel.prototype.camels.push(this);}
	
	//init name. If not provided in argo, default name is the next nato code
	if (!argo.name){this.name=this.nato[Camel.prototype.camels.length-1];}
	
	//init camel names list if necessary
	if (typeof Camel.prototype.name$=="undefined"){Camel.prototype.name$=$("#camel-names");}
	
	//path for this camel to view
	this.path=argo.path;
	
	//init just once and for all camels, jquery element for displaying camel content
	if (argo.view$){Camel.prototype.view$=argo.view$;}
	if (!Camel.prototype.view$) {Camel.prototype.view$=$("#camel-view");}
	
	this.casdoc=""; //document - "site visit report"
	this.casdoo=null; //document object - new casbah.Svr();
	this.casdo$=$("<div class='CASDOC'></div>"); //jquery element or place for document templates 
	
	//render
	//update list of all instantiated camel names.  Ensure it comes after name$ is defined
	this.list();
	//update camel contents
	this.view();
};

Camel.prototype.list(){
	//delete existing list
	$(".CAMELNAME").remove();
	
	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	this.camels.forEach(function(n){
		var li=$("<li class='CAMELNAME'><a href='#'>"+n+"</a></li>");
		li.appendTo(Camel.prototype.name$);
		li.click(function(){ that.main(that.argo.name);});
	});
};


Camel.prototype.main=function(name){
	//Make named camel the main camel. Returns main camel if called without argument
	if (typeof name=="undefined") {return Camel.mainCamel;}
	//find camel with name
	var mc=this.camels.filter(function(c){return (c.name==name);});
	//update mainCamel property in all camels...
	if (mc.length==1){Camel.prototype.mainCamel=mc[0];}
	console.log("Main camel is " + Camel.mainCamel);	
	this.view();
};

Camel.prototype.mainCamel=null;

//list of all intantiated camels
Camel.prototype.camels=[];

Camel.prototype.name="unnamed";

Camel.prototype.nato=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];
	
Camel.prototype.retire=funtion(name){
	//close a camel
	Camel.prototype.camels=this.camels.filter(function(c){return (c.name!=name);});
	//redo the CASBAH admin tab camel list
	this.list();
};

Camel.prototype.view=function(path){
	//render the folder in path as per its assigned CASDOC
	
	var that=this.mainCamel;	
	if (typeof path=="string") {that.path=path;}	
	//reset the camel view
	Camel.prototype.view$.empty();
	//append any camel info here
	
	//add the div that will hold the document contents
	Camel.prototype.view$.append(that.casdo$);

	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"CAMEL-VIEW",
			path:this.mainCamel.path
		}),
		error: function(err){ console.log(err.message);},
		success: function(r){ 
			//r={casdoc:"site visit report", js:"client/svr.js", html:"client/svr.html"}
			//load and execute script...
			$.getScript(r.js, function(data, textStatus, jqxhr ){
				console.log( "$getScript " + r.js);	
				//console.log( data ); // Data returned
				//console.log( textStatus ); // Success
				//console.log( jqxhr.status ); // 200
				
				//then load template
				$.load(r.html, function(h){
					console.log( "$load " + r.html);	
					//reset jquery element casdo$ with applicable document templates
					that.casdo$.html(h);
					//create document object passing jquery element casdo$
					that.casdoo=casbah.creators[r.casdoc](that.casdo$);
					that.casdoo.render();					
				});
			});	
		},
		type:"POST",
		url:"/uploads"
	});
};

Camel.prototype.view$=null;

