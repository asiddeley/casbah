
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
// CAMEL = Contract Admin Main Exploratory Llama.  

function Camel(argo){
	that=this;
	
	//argument object
	argo=$.extend({
		name:null,
		path:"uploads" 
	}, argo);

	//Main camel is last Camel instantiated unless changed by user via camel.main
	this.mainCamel=this;
	
	//init view$ as static variable, jquery element for displaying content from all camels
	Camel.prototype.view$=$("#camel-view");

	//update static list of all instantiated camels
	Camel.prototype.camels.push(this);}
	
	//init name.  If not provided in argo, default name is the next nato code
	if (!argo.name){this.name=this.nato[Camel.prototype.camels.length-1];}
	
	//init camel names list if necessary
	if (typeof Camel.prototype.name$=="undefined"){Camel.prototype.name$=$("#camel-names");}
	
	//update list of all instantiated camel names	
	var li=$("<li id='camel-"+this.argo.name+"'><a href='#'>"+this.argo.name+"</a></li>");
	li.appendTo(Camel.prototype.name$);
	li.click(function(){ that.main(that.argo.name);});


};



//list of all intantiated camels
Camel.prototype.camels=[];

Camel.prototype.main=function(name){
	//make the camel name, the main camel 
	//called from the CASBAH admin menu when user wishes to change camels
	console.log("Main camel shall be " + name);
	var mc=this.camels.filter(function(camel){return (camel.name==name);});
	if (mc.length==1){this.mainCamel=mc[0];}
	this.view();
};

Camel.prototype.name="unnamed";

Camel.prototype.nato=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"];

Camel.prototype.retire=funtion(name){
	//kill the camel name
	//called from the CASBAH admin menu
	
}

Camel.prototype.view=function(path){
	// render the folder in path, per assigned CASDOC

	/* What is path?
	Constructed from variables and constants...
	Eg. server/reports.js, path.join(
		global.appRoot, req.body.uploads_dir, req.body.project_id, 
		reports_dir, svr_dir, req.body.svr_id, svr_jsonfile )
	GENERALIZED...
	approot + uploads + PID + DocTab + DocType + DocID	

	Adjusted as navigation occur... 
	Eg. client/folder.html, 
	GENERALIZED... 
	approot + uploads + project_id + path
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"FOLDER-SELECT",
			folder_path:folder_path,
			project_id:localStorage.getItem("project_id")
		}),
		error: function(err){ console.log("Error", err);},
		success: function(result){folder.render(result);},
		type:"POST",
		url:"/uploads"
	});
		
	*/
	
	
	
	if (typeof path=="string") {this.mainCamel.path=path;}
	// view = this.view$
	// path = this.mainCamel.path
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"CAMEL-VIEW",
			project_id:this.project_id,
			path:this.mainCamel.path
		}),
		error: function(err){ console.log(err.message);},
		success: function(result){ if (typeof callback =="function"){callback();}},
		type:"POST",
		url:"/uploads"
	});
	
}

Camel.prototype.view$=null;

