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
	$(".VIEWNAME").remove();

	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	views.forEach(function(n){
		//calculate background colour, recycle colours if there are more camels than colours
		var bc=autoback[autoname.indexOf(n.name) % autoback.length];	
		//console.log("background-color:"+bc);
		var li=$("<li class='VIEWNAME'><a href='#'>"+n.name+"</a></li>");
		li.appendTo(name$);
		li.css("background-color",bc);
		//li.click(function(){ camel.main(camel.options.name);});
		li.click(function(ev){ 
			var n=$(ev.target).text();
			console.log("current view to be ", n);
			casbah.show(n); 
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

	view=this;
	views.push(this);

	// default name for view
	this.name=autoname[views.length-1];
	this.bc=autoback[autoname.indexOf(this.name) % autoback.length];	

	//retrieve, merge and save options locally
	this.options=new Options();	
	localLoad(prefix+this.name, this.options);
	$.extend(this.options, options);
	localSave(prefix+this.name, this.options);
	console.log("View.options:", this.options);
	
	//place for vue element or document  
	this.casdo$=$("<div></div>");
	this.casdo$.appendTo(view$);
	this.casdo$.css({"border-color":this.bc, "border-width":"4px", "border-style":"solid"});

	//place for vue
	this.el$=$("<div></div>");
	this.el$.attr("id", prefix+this.name);
	this.el$.appendTo(this.casdo$);

	//casbah document instance OR vue component instance
	this.casdoi=casbah.creators[this.options.casdok](view);
	//this.casdoi=casbah.creator(this.options.casdok)(view);
	
	//update list of all instantiated views names.  Ensure it comes after name$ is defined
	updateNamesHTML();
};

View.prototype.clear=function(){
	console.log("view.clear()...");
	if (this.casdoi instanceof Vue){this.casdoi.$destroy();}
	this.casdo$.empty();
	//place for vue
	this.el$=$("<div></div>");
	this.el$.attr("id", prefix+this.name);
	this.el$.appendTo(this.casdo$);
	//return view for chaining
	return this;
};

View.prototype.el=function(){
	//required for vue component instance 
	return ("#"+prefix+this.name);
};

View.prototype.getCDI=function(){
	//get the casbah document instnce or vue component instance
	return this.casdoi;
};

View.prototype.hide=function(){this.casdo$.hide();};
	
View.prototype.localSave=function(options){
	//expose localSave, called from project for updating {pronum:"updatedPronum"}
	localSave(prefix+this.name, options);
};

View.prototype.setCDI=function(casdoi){
	console.log("setCDI()...");
	this.casdoi=casdoi;
};

View.prototype.show=function(){this.casdo$.show();};


/////////////////////////////////////////
// PUBLIC

exports.activate=function(CASBAH){
	casbah=CASBAH;

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
exports.show=function(arg, add){

	var casbah=this;

	console.log("casbah.view()...");
	//first run
	if (views.length==0){new View({casdok:"welcome"});}
	
	if (isCasdok(arg)){
		console.log("arg is a casdoc key");
		if (add) {
			//create a new View copying current options, view updated automatically
			new View(new Options(view.options));
		} else {
 			// create new instance of vue or Casbah Document Instance, but clear() first!
			view.setCDI(casbah.creators[arg](view.clear()));
		}
		//isolate the current vue
		views.forEach(function(v){if (v==view){v.show();} else {v.hide();}});	
		//if not a vue then call its renderer
		if (typeof view.casdoi.render=="function"){view.casdoi.render();}			
	} 
	else if (isViewName(arg)) {
		console.log("arg is a view name");
		//isolate the current vue
		views.forEach(function(v){if (v.name==arg){v.show();} else {v.hide();}});	
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

