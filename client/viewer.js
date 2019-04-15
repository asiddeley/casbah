/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

// PRIVATE STATIC

var cas;

//default background colours
var autoback=["beige", "orange", "orangered", "cyan", "royalblue", "yellow", "gold", "green", "olive", "tan", "brown", "gray"];

//default camel names
var autoname=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];

// argument object with factory settings
var argodef={
	branch:null,
	casdok:"splash", //casdoc key eg. "svr" for "site visit report"
	docnum:null, //document number ie. document folder name or ordinal eg. 1 for first
	pronum:null, //project id ie. project folder name
	viewer:null //view name
};

var argocheck=function(argo){
	if (typeof argo == "undefined"){
		argo=argodef;
		//pick project
	}
	
	return argo;	
};

var argoSave=function(viewer, argo){
	// TO DO...
	// get argo from local store using provided argo as default if not found
	// Camel.prototype.argoLoad=function(argo){}

	// Change function below to
	// merge provided argument obj with current argument obj and save locally

	//casdok = casdoc key eg. "svr" for "site visit report" 
	//branch = casdoc base returned by casbah server given casdoc key. eg. "reports/site visit reports/"
	//path   = pronum + casdoc.base + docnum eg. "prj-001/reports/site visit reports/svr-A01/"
	var a=viewer.name;
	var b=localStorage.getItem("viewer-branch-"+a);	
	var c=localStorage.getItem("viewer-casdok-"+a);
	var d=localStorage.getItem("viewer-docnum-"+a);
	var	p=localStorage.getItem("viewer-pronum-"+a);
	//console.log("viewer.argo before...", viewer.argo);
	$.extend(
		// factory settings 		
		viewer.argo,	
		// local storage. localStorage returns null if item not found
		{
			branch:(b?b:viewer.argo.branch),
			casdoc:(c?c:viewer.argo.casdok), 
			docnum:(d?d:viewer.argo.docnum), 
			pronum:(p?p:viewer.argo.pronum)
		},
		// new argument object provided thru constructor Camel(argo)
		((typeof argo=="object")?argo:{})
	);
	//console.log("viewer.argo after...", viewer.argo);
	if(viewer.argo.branch){localStorage.setItem("viewer-branch-"+a, viewer.argo.branch);}
	if(viewer.argo.casdoc){localStorage.setItem("viewer-casdok-"+a, viewer.argo.casdok);}
	if(viewer.argo.docnum){localStorage.setItem("viewer-docnum-"+a, viewer.argo.docnum);}
	if(viewer.argo.pronum){localStorage.setItem("viewer-pronum-"+a, viewer.argo.pronum);}
};


var name$;

var updateNamesHTML=function(){
	var camel=this;
	
	//delete existing list
	$(".CAMELNAME").remove();

	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	viewers.forEach(function(n){
		//calculate background colour, recycle colours if there are more camels than colours
		var bc=autoback[autoname.indexOf(n.name) % autoback.length];	
		//console.log("background-color:"+bc);
		var li=$("<li class='CAMELNAME'><a href='#'>"+n.name+"</a></li>");
		li.appendTo(name$);
		li.css("background-color",bc);
		li.click(function(){ camel.main(camel.argo.name);});
	});
};

//list of all intantiated viewers
var viewers=[];

//current viewer
var viewer;

//place for current Vue
var viev$;


var Viewer=function(argo){
	// agro - argument object
	// eg. {name:"camel name", branch:null, casdok:"svr", docnum:"SVR-A01", pronum:"BLDG-101"}
	
	// add this new camel to static list of all instantiated camels
	viewers.push(this);
	
	// default name for viewer
	this.name=autoname[viewers.length-1];

	// CHANGE...
	// retreive locally stored arguments, mix in current arguments and store
	this.argoSave(argo);
	// LIKE...
	// this.argoLoad(argo); //get argo from local store using provided argo as default if not found
	// this.argoSave(argo); //merge provided argument obj with current argument obj and save locally
	
	//update current viewer 
	viewer=this;
	
	// init camel names list if necessary
	//if (typeof proto.name$=="undefined"){proto.name$=$("#camel-names");}
	
	// NEEDS WORK...	
	// init just once and for all camels, jquery element for displaying camel content
	if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
	
	this.casdoc=""; //casbah document object
	this.casdoi=null; //casbah document instance - new casbah.Svr();
	this.casdo$=$("<div class='CASDOC'></div>"); //jquery element or place for document templates 
	this.casdo$.appendTo(this.view$);
	
	//update list of all instantiated camel names.  Ensure it comes after name$ is defined
	updateNamesHTML();

	//update camel contents - only when called
	view("welcome");
	console.log("viewer named:", this.name);
};

//reserved
Viewer.prototype.casdoc=null;
Viewer.prototype.casdoi=null;
Viewer.prototype.casdo$=null;

//returns the current camel's casdoc instance
Viewer.prototype.getCDI=function(){return this.currentViewer.casdoi;};

//result of argo.casdoc, argo.doc_id & argo.pro_id as provided by ajax call
//Camel.prototype.branch=null;



Viewer.prototype.currentViewer=null;

Viewer.prototype.name="unnamed";

//element for display of camel names
Viewer.prototype.name$;
	
Viewer.prototype.retire=function(name){
	//remove camel by name
	viewers=viewers.filter(function(v){return (v.name!=name);});
	//redo the CASBAH admin tab camel list
	this.updateNamesHTML();
};

Viewer.prototype.showMenu=function(ev, m$){
	//Shows the current casdoc's menu
	//var m$=this.currentViewer.casdoi.m$;
	
	//first call texteditor with no arguments to turn it off just in case its on
	//ed.hide();
	m$.show().position({my:'left top',	at:'left bottom', of:ev});
	//remember caller, that is the <div> or <p> element that launched the contextMenu
	m$.menu('option', 'caller', ev.target);
	return false;
};

Viewer.prototype.hideMenu=function(ev, m$){
	m$.hide();
}

// PUBLIC
exports.activate=function(casbah){
	cas=casbah;
	viewer=new Viewer();
};

exports.current=function(name){
	//Make named viewer the main viewer. Returns main viewer if called without argument
	if (typeof name=="undefined") {return viewer;}
	//find viewer by name
	var mv=viewers.filter(function(c){return (c.name==name);});
	//update current viewer...
	if (mv.length==1){viewer=mv[0];}
	console.log("Current view:",viewer.name);	
	//?this.view();
};

exports.Viewer=Viewer;

exports.view=function(casdok){
	//casdok - the casdoc key eg. "svr" for "site visit report"
	//Render the current camel's contents depending on its arguments in this.argo ie. casdok or branch  
	//If casdok is not provided, currently set casdok is used
	//If current casdok is null (or 'welcome') then welcome page is displayed
	
	var casbah=this;
	var viewer=currentViewer;	

	console.log("casbah.view()...");
	console.log("pronum...", this.argo.pronum);
	//no project number so prompt or goto project view
	if (this.argo.pronum==null){
		var p=prompt("Enter project number...");
		argoSave({pronum:p});
		casbah.view(casdok);
	} else {	
		//argument provided so update
		if (typeof casdok == "string"){argoSave({casdok:casdok});}
		
		//reset the camel view
		view$.empty();
		//append any camel info here
		
		//add the div element that will hold the document contents
		view$.append(viewer.casdo$);

		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: $.param({
				action:"CAMEL VIEW",
				branch:camel.argo.branch, //null or result of args below
				casdok:camel.argo.casdok,
				docnum:camel.argo.docnum,
				pronum:camel.argo.pronum
			}),
			error: function(err){ console.log(err.message);},
			success: function(r){ 
				//r={branch:"", folders:[], files:[], err:null, casdoc:{}} 
				//cadsoc={name:"site visit report", jscr:"client/svr.js", html:"client/svr.html"}
				
				// REPLACE...
				//camel.argo.branch=r.branch;
				//camel.argoSave(r);			
				
				// WITH...
				// camel.argoMixSet({branch:r.branch});
				
				//load and execute script...	
				console.log( "camel $load..." + r.casdoc.html);	
				camel.casdo$.load(r.casdoc.html, function(){
					console.log( "viewer $getScript..." + r.casdoc.jscr);
					$.getScript(r.casdoc.jscr, function(data, textStatus, jqxhr ){
						//console.log( data ); // Data returned
						//console.log( textStatus ); // Success
						//console.log( jqxhr.status ); // 200
						//create document object passing jquery element casdo$
						console.log("casdok..."+r.casdok);
						//create document instance
						camel.casdoi=casbah.creators[r.casdok](camel);
						//then show it
						camel.casdoi.view();
					});
				});
			},
			type:"POST",
			url:"/uploads"
		});
	}
};

