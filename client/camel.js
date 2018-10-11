
/****************************************************************
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

	
/////////////////////////////////////////////////
// Camel = Contract Admin Many Exploratory Llamas 
// Client side

function Camel(argo){
	//that=this;
	
	// add this camel to static list of all instantiated camels
	Camel.prototype.allcamels.push(this);
	
	// default name for camel
	this.name=this.autoname[this.allcamels.length-1];

	this.argoSave(argo);
	
	//only one camel active at a time, this camel is now the main one 
	Camel.prototype.mainCamel=this;
	
	//init camel names list if necessary
	if (typeof Camel.prototype.name$=="undefined"){Camel.prototype.name$=$("#camel-names");}
	
	//branch for this camel to view eg. "/PRJ-001/reports/site visit report/SVR-A01"  
	//this.branch=argo.branch;
	
	//init just once and for all camels, jquery element for displaying camel content
	// NEEDS WORK...
	//if (argo.view$){Camel.prototype.view$=argo.view$;}
	if (!this.view$) {Camel.prototype.view$=$("#camel-view");}
	
	this.casdoc=""; //casbah document key eg. "svr" for "site visit report"
	this.casdoi=null; //casbah document instance - new casbah.Svr();
	this.casdo$=$("<div class='CASDOC'></div>"); //jquery element or place for document templates 
	this.casdo$.appendTo(this.view$);
	
	//update list of all instantiated camel names.  Ensure it comes after name$ is defined
	this.list();

	//update camel contents - only when called
	//this.view(); 
	console.log("camel named:", this.name);
};

//list of all intantiated camels.  Must be defined before Camel.prototype.argo
Camel.prototype.allcamels=[];

//default background colours
Camel.prototype.autoback=["beige", "orange", "orangered", "cyan", "royalblue", "yellow", "gold", "green", "olive", "tan", "brown", "gray"];

//default camel names.  Must be defined before Camel.prototype.argo
Camel.prototype.autoname=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];

// argument object with factory settings
Camel.prototype.argo={
	name:null,
	casdok:null, 
	docuid:null, 
	projid:null
};

// update and save argument object
Camel.prototype.argoSave=function(argo){

	//casdoc = key eg. "svr" for "site visit report" 
	//branch = casdoc.base returned by casbah server given casdoc key. eg. "reports/site visit reports/"
	//path = pro_id + casdoc.base + doc_id eg. "prj-001/reports/site visit reports/svr-A01/"
	var a=this.name;
	var c=localStorage.getItem("camel-casdok-"+a);
	var d=localStorage.getItem("camel-docuid-"+a);
	var	p=localStorage.getItem("camel-projid-"+a);
	
	console.log("this.argo before...", this.argo);
	$.extend(
		// factory settings 		
		this.argo,	
		// local storage. localStorage returns null if item not found
		{casdoc:(c?c:this.argo.casdok), docuid:(d?d:this.argo.docuid), projid:(p?p:this.argo.projid)},
		// new argument object provided thru constructor Camel(argo)
		((typeof argo=="object")?argo:{})
	);
	
	console.log("this.argo after...", this.argo);
	
	if(this.argo.casdoc){localStorage.setItem("camel-casdok-"+a, this.argo.casdok);}
	if(this.argo.docuid){localStorage.setItem("camel-docuid-"+a, this.argo.docuid);}
	if(this.argo.projid){localStorage.setItem("camel-projid-"+a, this.argo.projid);}

};

//result of argo.casdoc, argo.doc_id & argo.pro_id as provided by ajax call
Camel.prototype.branch=null;

Camel.prototype.list=function(){
	var camel=this;
	
	//delete existing list
	$(".CAMELNAME").remove();

	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	this.allcamels.forEach(function(n){
		//calculate background colour, recycle colours if there are more camels than colours
		var bc=camel.autoback[camel.autoname.indexOf(n.name) % camel.autoback.length];	
		//console.log("background-color:"+bc);
		var li=$("<li class='CAMELNAME'><a href='#'>"+n.name+"</a></li>");
		li.appendTo(Camel.prototype.name$);
		li.css("background-color",bc);
		li.click(function(){ camel.main(camel.argo.name);});
	});
};


Camel.prototype.main=function(name){
	//Make named camel the main camel. Returns main camel if called without argument
	if (typeof name=="undefined") {return Camel.prototype.mainCamel;}
	//find camel with name
	var mc=this.allcamels.filter(function(c){return (c.name==name);});
	//update mainCamel property in all camels...
	if (mc.length==1){Camel.prototype.mainCamel=mc[0];}
	console.log("Main camel is " + Camel.prototype.mainCamel);	
	this.view();
};

Camel.prototype.mainCamel=null;

Camel.prototype.name="unnamed";
	
Camel.prototype.retire=function(name){
	//remove camel by name
	Camel.prototype.allcamels=Camel.prototype.allcamels.filter(function(c){return (c.name!=name);});
	//redo the CASBAH admin tab camel list
	this.list();
};

Camel.prototype.view=function(casdok){
	//casdok - the casdoc key eg. "svr" for "site visit report"
	//with current camel, render the branch as per its assigned CASDOC
	var camel=this.mainCamel;	

	console.log("CAMEL.VIEW()...");
	console.log("projid...", this.argo.projid);
	if (this.argo.projid==null){
		var p=prompt("Enter project id");
		this.argoSave({projid:p});
	};
	//argument provided so update
	if (typeof casdok == "string"){this.argoSave({casdok:casdok});}
	
	//reset the camel view
	Camel.prototype.view$.empty();
	//append any camel info here
	
	//add the div element that will hold the document contents
	Camel.prototype.view$.append(camel.casdo$);

	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"CAMEL VIEW",
			branch:camel.branch, //null or result of args below
			casdok:camel.argo.casdok,
			docuid:camel.argo.docuid,
			projid:camel.argo.projid
		}),
		error: function(err){ console.log(err.message);},
		success: function(r){ 
			//r={branch:"", folders:[], files:[], err:null, casdoc:{}} 
			//cadsoc={name:"site visit report", jscr:"client/svr.js", html:"client/svr.html"}
			camel.branch=r.branch;
			//load and execute script...
			console.log( "$getScript..." + r.casdoc.jscr);
			$.getScript(r.casdoc.jscr, function(data, textStatus, jqxhr ){
				console.log( "loaded..." + r.casdoc.jscr);	
				//console.log( data ); // Data returned
				//console.log( textStatus ); // Success
				//console.log( jqxhr.status ); // 200
				
				//reset jquery element casdo$ with applicable document templates
				camel.casdo$.load(r.casdoc.html, function(){
					console.log( "camel $load:" + r.casdoc.html);	
					//create document object passing jquery element casdo$
					camel.casdoi=casbah.creators[r.casdok](camel.casdo$, r.branch);
					camel.casdoi.view();					
				});
			});
		},
		type:"POST",
		url:"/uploads"
	});
};

Camel.prototype.view$=null;


console.log("camel loaded...");