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
		//li.click(function(){ camel.main(camel.options.name);});
		li.click(function(ev){ 
			var n=$(ev.target).text();
			console.log("current view to be ", n);
			view(n); 
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
	
	//casbah document type is in options
	//this.casdoc=null; 
	
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
	console.log("View() created:",this.name);
};



/////////////////////////////////////////
// PUBLIC

exports.activate=function(CASBAH){
	casbah=CASBAH;

	//view=new View(new Options());
	if (!view$) {view$=$("#VIEWER-PLACEHOLDER");}
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
	console.log("casdoc.creators...", Object.keys(casbah.creators));	

	//first run
	if (views.length==0){new View();}
	
	if (isCasdok(arg)){
		//add a new view, it becomes current automaticaly
		if (add) {new View(new Options());}
		//change view options, save and render view
		viewByCasdok({casdok:arg});
	} else {
		console.log("veiwer.view( arg is NOT a casdok )");
		//then assume its a view name...
		//call up an existing view by name, add not applicable
		viewByViewName(arg);
	}
};

var isCasdok=function(casdok){
	//string is a casdoc key
	return (typeof casdok=="string" && Object.keys(casbah.creators).includes(casdok));
};

var isViewName=function(){
	
	
};

var viewByCasdok=function(options){
	
	console.log("veiwByCasdok()...");

	$.extend(view.options, options);	
	
	if (view.options.pronum==null){	
		//no project number so prompt or goto project view
		var p=prompt("Enter project number...");
		viewCasdok({pronum:p});
	} 
	else {
		localSave(prefix+view.name, view.options);
		
		//reset 
		view$.empty();
		
		//add the div element that will hold the document contents
		view$.append(view.casdo$);

		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: $.param({
				action:"VIEWER",
				branch:view.options.branch, //null or result of args below
				casdok:view.options.casdok,
				docnum:view.options.docnum,
				pronum:view.options.pronum
			}),
			error: function(err){ console.log(err.message);},
			success: function(r){
				//r={casdoc:{html:"", jscr:"", }, casdok:"drr"}
				console.log("viewSuccess...",r);
				//delete old vue
				var status=delete(view.casdoi);
				console.log("deleting old view.casdoi...", status);
				//create document instance
				view.casdoi=casbah.creators[r.casdok](view);
				//hide all
				$("CASDOC").hide();
				//then show new one
				view.casdo$.show();						
			},
			type:"POST",
			url:"/uploads"
		});
	}
};

var viewByViewName=function(name){
	console.log("viewOptions...", view.options);
	//Make named view the current view. Returns current view if called without argument
	if (typeof name!="string") {return view;}
	//find view by name
	var cv=views.filter(function(v){return (v.name==name);});
	//update current view...
	if (cv.length==1){
		view=cv[0];
		console.log("current view:", view.name);
		//hide all views
		$(".CASDOC").hide();
		//reveal current
		view.casdo$.show();
		return true;
	} else {
		console.log("view not found:", name);
		return false;
	}
};

var viewSuccessOld=function(r){ 
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
};		