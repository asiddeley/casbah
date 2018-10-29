
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

//////////////////////////
// Project
// Client Side

// Adding Pro to casbah creator library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.project=function(camel){return new casbah.Project(camel);};
// Remember, in casdocs prolog extends project so prolog also needs a creator...
casbah.creators.prolog=function(camel){return new casbah.Project(camel);};


// Adding Project constructor function to casbah library if missing
if (typeof casbah.Project!="function"){casbah.Project=function(){


var pro=function(camel){
	
	var pro=this;
	pro.camel=camel;
	// jquery wrapped element for view 
	pro.v$=pro.camel.casdo$;
	
	//load templates and render...
	$.get("client/header.html", function(htm){
		pro.header_template=Handlebars.compile(htm);
		pro.v$.find("#project-header-placeholder").html(pro.header_template({doc_type:"Project Log"}));
	});
	
	// text editor
	pro.ed=new casbah.Editor();
	
	// jquery wrapped element initialized as a jquery menu... 
	pro.m$=pro.v$.find("#project-menu").menu().css("position","absolute", "width", "200px").hide();

	pro.template=Handlebars.compile(pro.v$.find("#project-template").html());
	pro.view();
};


pro.prototype.change=function(pronum, field, valu, callback){
	// Changes information stored in a particular project folder in __projectData.json
	// change field:values in project_json located in a particular project dir
	// same as project.change
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"PRO CHANGE",
			pronum:pronum,
			field:field,
			valu:valu
		}),
		error: function(err){ console.log(err.message);},
		success: function(result){ if (typeof callback =="function"){callback();}},
		type:"POST",
		url:"/uploads"
	});
};

pro.prototype.current=function(caller){
	
	var pronum;
	if (typeof caller=="undefined"){
		//called from menu
		caller=this.m$.menu("option","caller");
		pronum=$(caller).closest("[project_id]").attr("project_id");
	} else {
		// Called from page
		pronum=$(caller).text();
	}
	$("#browser_tab").text("CASBAH ("+pronum+")");
	this.camel.argoSave({"pronum":pronum});
};

// Open text editor...
pro.prototype.edit=function(el){
	var pro=this;
	pro.ed.text(el, function(){
		pro.update(pro.ed.row(), pro.ed.rowid(), true); 
		pro.ed.hide();
		var pronum=pro.ed.target_attr("pronum");
		var field=pro.ed.target_attr("field"); 
		var text=pro.ed.val();
		console.log("FIELD",field, " UPDATED TEXT:", text);
		pro.change(pronum, field, text, function(){
			pro.ed.hide();
			//refresh (server request and render), alt just render cache...
			pro.view();
		})	
	});
};

//pro.prototype.insert_menu=function(){
pro.prototype.create=function(){
	// Creates a new project folder
	
	var pro=this;

	var pronum=prompt("New Project Number (or cancel for next logical name)");
	
	$.ajax({
		data:$.param({action:"PRO CREATE", pronum:pronum}),
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		error:function(err){console.log("Error from server:", err);},
		success:function(result){pro.view();},
		type:"POST",
		url:"/uploads"
	});	

};

pro.prototype.update=function(row, rowid, flag){
	console.log("Project update ROW:",row," ROWID:", rowid);
	//TO DO...
};

pro.prototype.view=function(){
	var pro=this;
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({action:"PRO LEDGER"}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			pro.v$.find("#project-placeholder").html(pro.template(result));
		},
		type:"POST",
		url:"/uploads"
	});
};

//////////////////////////////////////////
//END OF CLOSURE
return pro;}();}
//console.log("project.js loaded");
