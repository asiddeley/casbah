/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

// PRIVATE STATIC

var casbah;

//default background colours
var autoback=["beige", "orange", "orangered", "cyan", "royalblue", "yellow", "gold", "green", "olive", "tan", "brown", "gray"];

//default camel names
var autoname=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];

// view or casdoc options object with default settings
var Options=function(options){
	this.branch=null;
	//casdoc key eg. "svr" for "site visit report". Default is the welcome splash screen
	this.casdok="welcome"; 
	//document number ie. folder name or ordinal eg. 1 for first
	this.docnum=null; 
	//project id ie. project folder name
	this.pronum=null; 
	//plus whatever is provided...
	if (typeof options=="object"){$.extend(this, options);}
};

var localSave=function(id, object){
	Object.getOwnPropertyNames(object).forEach(function(k,i,arr){
		//object[k]
		//localStorage.setItem("view-branch-"+a, view.options.branch);	
		localStorage.setItem(id+k, object[k]);		
	});
};

var localLoad=function(id, object){
	Object.getOwnPropertyNames(object).forEach(function(k,i,arr){
		//localStorage.setItem("view-branch-"+a, view.options.branch);	
		object[k]=localStorage.getItem(id+k);
	});
};

//prefix for id
var prefix="view-";

// place for list of view names
var name$;

var updateNamesHTML=function(){
	
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
		//li.click(function(){ camel.main(camel.options.name);});
		li.click(function(ev){ 
			var n=$(ev.target).text();
			console.log("current view to be ", n);
			casbah.view(n); 
		});
	});
};

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

	//retrieve, merge and save options locally
	this.options=new Options();	
	localLoad(prefix+this.name, this.options);
	$.extend(this.options, options);
	localSave(prefix+this.name, this.options);
	console.log("View.options:", this.options);
	
	//place for document  
	this.casdo$=$("<div></div>");
	this.casdo$.appendTo(view$);
	var bc=autoback[autoname.indexOf(this.name) % autoback.length];	
	this.casdo$.css("border-color", bc);
	this.casdo$.addClass("CASDOC");
	this.casdo$.attr("id", prefix+this.name);
	//this.casdo$.hide();
	
	//casbah document instance OR vue component instance
	this.casdoi=casbah.creators[this.options.casdok](view);
	
	//returns the current document instnce I.e. vue component instance
	this.getCDI=function(){return view.casdoi;};
	
	//expose localSave, called from project for updating {pronum:"updatedPronum"}
	this.localSave=function(options){localSave(prefix+this.name, options);};
	
	//update list of all instantiated views names.  Ensure it comes after name$ is defined
	updateNamesHTML();

	//update camel contents - only when called
	//view("welcome");
	console.log("View() created:",this.name);
};



/////////////////////////////////////////
// PUBLIC

exports.activate=function(CASBAH){
	casbah=CASBAH;

	//view=new View(new Options());
	if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
	if (!name$) {name$=$("#VIEW-LIST");}
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

exports.unView=function(name){

	//remove view by name
	views=views.filter(function(v){return (v.name!=name);});
	//recalculate the CASBAH admin tab camel list
	updateNamesHTML();
};


//view manager
exports.view=function(arg, add){
	
	var casbah=this;

	console.log("casbah.view()...");
	//console.log("casdoc.creators...", Object.keys(casbah.creators));	

	//first run
	if (views.length==0){new View({casdok:"welcome"});}
	
	if (isCasdok(arg)){
		console.log("arg is a casdoc key");
		if (add) {
			//create a new View copying current options, view updated automatically
			new View(new Options(view.options));
			view.options.pronum=prompt("Enter project number...", view.options.pronum);
			localSave(prefix+view.name, view.options);
		} else {			
			// create new instance of vue or casdoc  
			view.casdoi=casbah.creators[arg](view);
		}
		// manage visibilities
		views.forEach(function(v){
			//var v=views[i];
			if (v==view){
				//show current	
				if (v.casdoi instanceof Vue){
					console.log("vue.visible=true");
					v.casdoi.visible=true;
				} else {
					console.log("casdo$.show()");
					v.casdo$.show();
				}				
			} else {
				//hide others
				if (v.casdoi instanceof Vue){
					console.log("vue.visible=false");
					v.casdoi.visible=false;
				} else {
					console.log("casdo$.hide()");
					v.casdo$.hide();
				}				
			}			
		});
		if (typeof view.casdoi.render=="function"){view.casdoi.render();}			
	} 
	else if (isViewName(arg)) {
		console.log("arg is a view name");
		// manage visibilities
		views.forEach(function(v){
			//var v=views[i];
			if (v.name==arg){
				//show current	
				if (v.casdoi instanceof Vue){v.casdoi.visible=true;} else {v.casdo$.show();}				
			} else {
				//hide others
				if (v.casdoi instanceof Vue){v.casdoi.visible=false;} else {v.casdo$.hide();}				
			}			
		});
	} else {console.log("arg unknown");}
};

var isCasdok=function(casdok){
	// returns true of arg is a casdoc key
	return (typeof casdok=="string" && Object.keys(casbah.creators).includes(casdok));
};

var isViewName=function(name){
	// returns true if arg is a view name
	return (views.filter(function(v){return (v.name==name);}).length > 0);
};
	
	
