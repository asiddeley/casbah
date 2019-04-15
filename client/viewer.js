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
	casdok:"welcome", //casdoc key eg. "svr" for "site visit report"
	docnum:null, //document number ie. document folder name or ordinal eg. 1 for first
	pronum:null, //project id ie. project folder name
};

var argocheck=function(argo){
	if (typeof argo == "undefined"){
		argo=argodef;
		//pick project
	}
	
	return argo;	
};

var argoSave=function(viewer){
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

// place for list of viewer names
var name$;

//list of all intantiated viewers
var viewers=[];

//current viewer
var viewer;

//place for viewers to display content (ie. Vue instances)
var viewer$;

// Constructor function
var Viewer=function(argo){
	// agro - argument object
	// eg. {name:"camel name", branch:null, casdok:"svr", docnum:"SVR-A01", pronum:"BLDG-101"}

	viewer=this;	
	viewers.push(this);
	
	// default name for viewer
	this.name=autoname[viewers.length-1];
	
	//retrieve, merge and save arguments locally
	this.argoSave(argo);
	
	//DEPRECATED, do in exports.activate();
	//if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
	
	//casbah document object
	this.casdoc=""; 
	
	//DEPRECATED casbah document instance (new casbah.Svr();) 
	//this.casdoi=null; 
	//USE Vue instance instead	
	this.vue=null;
	
	//place for document  
	this.casdo$=$("<div class='CASDOC'></div>");
	this.casdo$.appendTo(view$);
	this.casdo$.attr("id","viewer-"+this.name);
	this.casdo$.hide();
	
	//update list of all instantiated views names.  Ensure it comes after name$ is defined
	updateNamesHTML();

	//update camel contents - only when called
	//view("welcome");
	console.log("New Viewer created:", this.name);
};

//casbah document type
Viewer.prototype.casdoc=null;
//casbah document instance I.e. vue component instance
Viewer.prototype.casdoi=null;
//casbah document place as a jquery wrapped element
Viewer.prototype.casdo$=null;

//returns the current document instnce I.e. vue component instance
Viewer.prototype.getCDI=function(){return viewer.casdoi;};

//reserved
Viewer.prototype.name="unnamed";
	
Viewer.prototype.retire=function(name){
	//remove viewer by name
	viewers=viewers.filter(function(v){return (v.name!=name);});
	//recalculate the CASBAH admin tab camel list
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
	if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
};

exports.current=function(name){
	//Make named viewer the main viewer. Returns main viewer if called without argument
	if (typeof name=="undefined") {return viewer;}
	//find viewer by name
	var mv=viewers.filter(function(v){return (v.name==name);});
	//update current viewer...
	if (mv.length==1){viewer=mv[0];}
	console.log("Current view:", viewer.name);	
	//?this.view();
};

exports.Viewer=Viewer;


exports.view=function(casdok){
	//casdok - the casdoc key eg. "svr" for "site visit report"
	//Render the current camel's contents depending on its arguments in this.argo ie. casdok or branch  
	//If casdok is not provided, currently set casdok is used
	//If current casdok is null (or 'welcome') then welcome page is displayed
	
	var casbah=this;

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

