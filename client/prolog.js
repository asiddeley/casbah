
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

// Adding Plog to casbah creator library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.prolog=function(camel){return new casbah.Prolog(camel);};

// Adding Plog constructor function to casbah library if missing
if (typeof casbah.Prolog!="function"){casbah.Prolog=function(){

var plog=function(camel){
	
	var plog=this;
	plog.camel=camel;
	// jquery wrapped element for view 
	plog.v$=plog.camel.casdo$;
	
	//load templates and render...
	$.get("client/header.html", function(htm){
		plog.header_template=Handlebars.compile(htm);
		plog.v$.find("#project-header-placeholder").html(plog.header_template({doc_type:"Project Log"}));
	});
	
	// text editor
	plog.ed=new casbah.Editor();
	
	// jquery wrapped element initialized as a jquery menu... 
	plog.m$=plog.v$.find("#project-menu").menu().css("position","absolute", "width", "200px").hide();

	plog.template=Handlebars.compile(plog.v$.find("#project-template").html());
	plog.view();
};


plog.prototype.change=function(pronum, field, valu, callback){
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

/***
plog.prototype.current_menu=function(){
	// Called from Menu 
	var caller=this.m$.menu("option","caller");
	var pronum=$(caller).closest("[project_id]").attr("project_id");
	$("#browser_tab").text("CASBAH-"+pronum);
	//localStorage.setItem("project_id", pid);
	this.camel.argoSave({"pronum":pronum});
};

plog.prototype.current_page=function(el){
	// Called from page
	var pronum=$(el).text();
	$("#browser_tab").text("CASBAH ("+pronum+")");
	//localStorage.setItem("project_id", pid);
	this.camel.argoSave({"pronum":pronum});
};
*/
plog.prototype.current=function(caller){
	
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
plog.prototype.edit=function(el){
	var plog=this;
	plog.ed.text(el, function(){
		plog.update(plog.ed.row(), plog.ed.rowid(), true); 
		plog.ed.hide();
		var pronum=plog.ed.target_attr("pronum");
		var field=plog.ed.target_attr("field"); 
		var text=plog.ed.val();
		console.log("FIELD",field, " UPDATED TEXT:", text);
		plog.change(pronum, field, text, function(){
			plog.ed.hide();
			//refresh (server request and render), alt just render cache...
			plog.view();
		})	
	});
};

//plog.prototype.insert_menu=function(){
plog.prototype.create=function(){
	// Creates a new project folder
	
	var plog=this;

	var pronum=prompt("New Project Number (or cancel for next logical name)");
	
	$.ajax({
		data:$.param({action:"PRO CREATE", pronum:pronum}),
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		error:function(err){console.log("Error from server:", err);},
		success:function(result){plog.view();},
		type:"POST",
		url:"/uploads"
	});	

};

plog.prototype.update=function(row, rowid, flag){
	console.log("Project update ROW:",row," ROWID:", rowid);
	//TO DO...
};

plog.prototype.view=function(){
	var plog=this;
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({action:"PRO LOG"}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			plog.v$.find("#project-placeholder").html(plog.template(result));
		},
		type:"POST",
		url:"/uploads"
	});
};



//////////////////////////////////////////
//END OF CLOSURE
return plog;}();}

console.log("plog.js loaded");
