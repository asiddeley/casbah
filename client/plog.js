
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
// Plog = Project Log
// Client Side

// Adding Plog to casbah creator library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.Plog=function(camel){return new casbah.Plog(camel);};

// Adding Plog constructor function to casbah library if missing
if (typeof casbah.Plog!="function"){casbah.Plog=function(){

var plog=function(camel){
	
	var plog=this;
	plog.camel=camel;
	// jquery wrapped element for view 
	var v$=project.camel.casdo$;
	
	//load templates and render...
	$.get("client/header.html", function(htm){
		plog.header_template=Handlebars.compile(htm);
		v$.find("#project-header-placeholder").html(plog.header_template({doc_type:"Project Log"}));
	});
	
	// text editor
	plog.prototype.ed=new casbah.Editor();
	
	// jquery wrapped element initialized as a jquery menu... 
	plog.m$=v$.find("#project-menu").menu().css("position","absolute", "width", "200px").hide();

	plog.template=Handlebars.compile(v$.find("#project-template").html());
	plog.view();
};


plog.prototype.change=function(pronum, field, valu, callback){
	// change field:values in project_json located in a particular project dir
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"PROJECT CHANGE",
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

plog.prototype.current_menu=function(){
	// Called from Menu 
	var caller=this.m$.menu("option","caller");
	var pronum=$(caller).closest("[pronum]").attr("pronum");
	$("#browser_tab").text("CASBAH-"+pronum);
	//localStorage.setItem("project_id", pid);
	this.camel.argoSave({"pronum":pronum});
};

plog.prototype.current_page=function(el){
	// Called from page
	var pronum=$(el).text();
	$.("#browser_tab").text("CASBAH ("+pronum+")");
	//localStorage.setItem("project_id", pid);
	this.camel.argoSave({"pronum":pid});
};

// Open text editor...
plog.prototype.edit=function(el){
	project.ed.text(el, function(){
		project.update(project.ed.row(), project.ed.rowid(), true); 
		project.ed.hide();
		var pid=project.ed.target_attr("pid");
		var field=project.ed.target_attr("field"); 
		var text=project.ed.val();
		console.log("FIELD",field, " UPDATED TEXT:", text);
		project.change(pid, field, text, function(){
			project.ed.hide();
			//refresh (server request and render), alt just render cache...
			project.refresh();
		})	
	});
};

plog.prototype.insert_menu=function(){
	//Called from Menu 
	var caller=project.menu.menu("option","caller");
	//var pid=$(caller).closest("[project_id]").attr("project_id");
	var pid=$(caller).attr("project_id");
	var project_id=prompt("New Project ID", pid);
	if (project_id != "" && project_id != null){
		$.ajax({
			data:$.param({action:"PROJECT-INSERT", project_id:project_id}),
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			error:function(err){console.log("Error from server:", err);},
			success:function(result){project.refresh();	},
			type:"POST",
			url:"/uploads"
		});	
	}
};

plog.prototype.update=function(row, rowid, flag){
	console.log("Project update ROW:",row," ROWID:", rowid);
	//TO DO...
};

plog.prototype.view=function(){
	var plog=
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({action:"PROJECT SELECT"}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			//casbah.renderFX("project-content", project.content, result, delta);
			$("#project-placeholder").html(project.template(result));
		},
		type:"POST",
		url:"/uploads"
	});
};



//////////////////////////////////////////
//END OF CLOSURE
return plog;}();}

console.log("plog.js loaded");
