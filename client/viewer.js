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

var checkOptions=function(options){
	if (typeof options == "undefined"){
		options=argodef;
		//pick project
	}
	
	return options;	
};

// view mode
// 0 - view call uses current view
// 1 - view call creates new view this time only (mode reverts to 0)
// 2 - view call creates new view from now on 
var mode=0;

var saveOptions=function(view){
	// TO DO...
	// get options from local store using provided options as default if not found
	// Camel.prototype.argoLoad=function(options){}

	// Change function below to
	// merge provided argument obj with current argument obj and save locally

	//casdok = casdoc key eg. "svr" for "site visit report" 
	//branch = casdoc base returned by casbah server given casdoc key. eg. "reports/site visit reports/"
	//path   = pronum + casdoc.base + docnum eg. "prj-001/reports/site visit reports/svr-A01/"
	var a=view.name;
	var b=localStorage.getItem("view-branch-"+a);	
	var c=localStorage.getItem("view-casdok-"+a);
	var d=localStorage.getItem("view-docnum-"+a);
	var	p=localStorage.getItem("view-pronum-"+a);
	//console.log("view.options before...", view.options);
	$.extend(
		// factory settings 		
		view.options,	
		// local storage. localStorage returns null if item not found
		{
			branch:(b?b:view.options.branch),
			casdoc:(c?c:view.options.casdok), 
			docnum:(d?d:view.options.docnum), 
			pronum:(p?p:view.options.pronum)
		},
		// new argument object provided thru constructor Camel(options)
		((typeof options=="object")?options:{})
	);
	//console.log("view.options after...", view.options);
	if(view.options.branch){localStorage.setItem("view-branch-"+a, view.options.branch);}
	if(view.options.casdoc){localStorage.setItem("view-casdok-"+a, view.options.casdok);}
	if(view.options.docnum){localStorage.setItem("view-docnum-"+a, view.options.docnum);}
	if(view.options.pronum){localStorage.setItem("view-pronum-"+a, view.options.pronum);}
};

var updateNamesHTML=function(){
	var camel=this;
	
	//delete existing list
	$(".CAMELNAME").remove();

	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	views.forEach(function(n){
		//calculate background colour, recycle colours if there are more camels than colours
		var bc=autoback[autoname.indexOf(n.name) % autoback.length];	
		//console.log("background-color:"+bc);
		var li=$("<li class='CAMELNAME'><a href='#'>"+n.name+"</a></li>");
		li.appendTo(name$);
		li.css("background-color",bc);
		li.click(function(){ camel.main(camel.options.name);});
	});
};

// place for list of view names
var name$;

//list of all instantiated views
var views=[];

//current view
var view;

//place for views to display content (ie. Vue instances)
var view$;

// Constructor function
var View=function(options){
	// eg. {name:"camel name", branch:null, casdok:"svr", docnum:"SVR-A01", pronum:"BLDG-101"}

	view=this;	
	views.push(this);
	
	// default name for view
	this.name=autoname[views.length-1];
	
	//retrieve, merge and save arguments locally
	this.saveOptions(options);
	
	//casbah document type
	this.casdoc=null; 
	
	//casbah document instance (previously new casbah.Svr();), now
	//vue component instance
	this.casdoi=null; 
	
	//place for document  
	this.casdo$=$("<div class='CASDOC'></div>");
	this.casdo$.appendTo(view$);
	this.casdo$.attr("id","view-"+this.name);
	this.casdo$.hide();
	
	//returns the current document instnce I.e. vue component instance
	this.getCDI=function(){return view.casdoi;};
	
	//update list of all instantiated views names.  Ensure it comes after name$ is defined
	updateNamesHTML();

	//update camel contents - only when called
	//view("welcome");
	console.log("New View created:", this.name);
};



/////////////////////////////////////////
// PUBLIC

exports.activate=function(casbah){
	cas=casbah;
	view=new View();
	if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
};

exports.current=function(name){
	//Make named view the current view. Returns current view if called without argument
	if (typeof name=="undefined") {return view;}
	//find view by name
	var mv=views.filter(function(v){return (v.name==name);});
	//update current view...
	if (mv.length==1){view=mv[0];}
	console.log("Current view:", view.name);	
	//?this.view();
};


exports.menuHide=function(ev, m$){m$.hide();}

exports.menuShow=function(ev, m$){
	//Shows the current casdoc's menu
	//var m$=this.currentViewer.casdoi.m$;
	//var m$=casbah.current.menu$ ??? HOW TO DEFINE CASDOC CONTEXT MENUS
	
	//first call texteditor with no arguments to turn it off just in case its on
	//ed.hide();
	m$.show().position({my:'left top',	at:'left bottom', of:ev});
	//remember caller, that is the <div> or <p> element that launched the contextMenu
	m$.menu('option', 'caller', ev.target);
	return false;
};


//no need to expose this
//exports.Viewer=Viewer;

exports.unView=function(name){
	//remove view by name
	views=views.filter(function(v){return (v.name!=name);});
	//recalculate the CASBAH admin tab camel list
	updateNamesHTML();
};

exports.viewmode(viewmode){
	// 0 - view call uses current view
	// 1 - view call creates new view this time only then mode reverts to 0
	// 2 - view call creates new view from now on 
	if (typeof viewmode=="undefined"){
		return viewmode;
	} else {
		mode=viewmode;		
	}
}

exports.view=function(casdok){
	//casdok - the casdoc key eg. "svr" for "site visit report"
	//Render the current camel's contents depending on its arguments in this.options ie. casdok or branch  
	//If casdok is not provided, currently set casdok is used
	//If current casdok is null (or 'welcome') then welcome page is displayed
	
	var casbah=this;	

	console.log("casbah.view()...");
	console.log("pronum...", this.options.pronum);
	//no project number so prompt or goto project view
	if (this.options.pronum==null){
		var p=prompt("Enter project number...");
		saveOptions({pronum:p});
		casbah.view(casdok);
	} else {	
		//argument provided so update
		if (typeof casdok == "string"){saveOptions({casdok:casdok});}
		
		//reset the camel view
		view$.empty();
		//append any camel info here
		
		//add the div element that will hold the document contents
		view$.append(view.casdo$);

		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: $.param({
				action:"CAMEL VIEW",
				branch:camel.options.branch, //null or result of args below
				casdok:camel.options.casdok,
				docnum:camel.options.docnum,
				pronum:camel.options.pronum
			}),
			error: function(err){ console.log(err.message);},
			success: function(r){ 
				//r={branch:"", folders:[], files:[], err:null, casdoc:{}} 
				//cadsoc={name:"site visit report", jscr:"client/svr.js", html:"client/svr.html"}
				
				// REPLACE...
				//camel.options.branch=r.branch;
				//camel.saveOptions(r);			
				
				// WITH...
				// camel.argoMixSet({branch:r.branch});
				
				//load and execute script...	
				console.log( "camel $load..." + r.casdoc.html);	
				camel.casdo$.load(r.casdoc.html, function(){
					console.log( "view $getScript..." + r.casdoc.jscr);
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

