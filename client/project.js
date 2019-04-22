/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
**********/


// PUBLIC
exports.activate=function(CASBAH){
	casbah=CASBAH;
	casbah.creators.project=function(view){return new Project(view);};
	casbah.creators.prolog=function(view){return new Project(view);};
	
	//casbah.project.idlist_template=Handlebars.compile($("#project-idlist-template").html());
};

exports.check=function(){
	//ensure project number set.  
	console.log("project_number check:",localStorage.getItem("project_number"));
	if (typeof localStorage.getItem("project_number") == "undefined") {
		casbah.project.select();
		return;
	} 
	$("#browser_tab").text("CASBAH - "+localStorage.getItem("project_number"));
};

exports.modal=function(callback){
	$.ajax({
		data:$.param({
			action:"PROJECT-IDLIST",
			project_id:"dummy"
		}),
		//contentType:false,
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		error:function(err){console.log("Error:",err);},
		processData:false, 
		success:function(result){ 
			//result - [{pnum:"", pname:"", ...},{...},{...}...]
			console.log("Project modal:", result);
			//var h=casbah.project.ids_template(result);
			var h=casbah.project.idlist_template(result);
			//set callback
			$("#project_modal").one("hide.bs.modal", function (e) {
				if (typeof callback=="function"){callback();}
			});
			$("#project_modal_content").html(h);
			$("#project_modal").modal("show");
		},
		type:"POST",
		url:"/uploads"
	});	
};

//exports.Project=Project;

exports.select=function(){
	var pnum=prompt("Project number");
	if (pnum !== "" && pnum != null){
		localStorage.setItem("project_id", pnum);
		$("#browser_tab").text("CASBAH - "+pnum);
	};
	//casbah.project_dialog.show();
};

// PRIVATE STATIC
var casbah;
var Project=function(view){
	
	var pro=this;
	pro.view=view;
	
	// text editor
	pro.ed=new casbah.Editor();	
	
	pro.el$=view.casdo$;	
	//load templates and render...
	pro.el$.load("client/project.html", function(htm){
		pro.el$.html(htm);
		pro.header_template=Handlebars.compile(htm);
		pro.el$.find("#project-header-placeholder").html(pro.header_template({doc_type:"Project Log"}));
		// jquery wrapped element initialized as a jquery menu... 
		pro.m$=pro.el$.find("#project-menu").menu().css("position","absolute", "width", "200px").hide();		
		pro.template=Handlebars.compile(pro.el$.find("#project-template").html());
		pro.render();			
	});
};


Project.prototype.change=function(pronum, field, valu, callback){
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

Project.prototype.current=function(caller){
	
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
	this.view.localSave({"pronum":pronum});
};

// Open text editor...
Project.prototype.edit=function(el){
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
			pro.render();
		})	
	});
};

//pro.prototype.insert_menu=function(){
Project.prototype.create=function(){
	// Creates a new project folder
	
	var pro=this;

	var pronum=prompt("New Project Number (or cancel for next logical name)");
	
	$.ajax({
		data:$.param({action:"PRO CREATE", pronum:pronum}),
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		error:function(err){console.log("Error from server:", err);},
		success:function(result){pro.render();},
		type:"POST",
		url:"/uploads"
	});	

};

Project.prototype.update=function(row, rowid, flag){
	console.log("Project update ROW:",row," ROWID:", rowid);
	//TO DO...
};

Project.prototype.render=function(){
	console.log("project.render()...");
	var pro=this;
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({action:"SELECT", casdok:"project", docnum:1}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			pro.el$.find("#project-placeholder").html(pro.template(result));
		},
		type:"POST",
		url:"/uploads"
	});
};

