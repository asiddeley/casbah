
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
// Rds = Room Deficiency Sheets LOG
// Client Side

// Add Rds creator function to casbah library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.rds=function(camel){return new casbah.RdsLog(camel);};

// Add following constructor to casbah library if missing
if (typeof casbah.RdsLog!="function"){casbah.RdsLog=function(){
	
var RdsLog=function(camel){
	var rdsLog=this;
	rdsLog.camel=camel;
	//casbah.project.check();
	//var deficiency_sheets_log={};
	
	
	rdsLog.head=$("#deficiency_sheets_log_head").html();
	rdsLog.template=Handlebars.compile($("#deficiency_sheets_log").html());
	rdsLog.view();
};

// Create new svr (site visit review) document
rdsLog.prototype.create=function(){
	var name=prompt("Name of new deficiency sheetset");
	if (name == "" || name == null){return;}
	else {
	//var fd=new FormData();
	//fd.append("action","ADD");
	//fd.append("project_number", localStorage.getItem("project_number"));
	//fd.append("tab","reports");
	//fd.append("folder","deficiency_sheets");
	//fd.append("subfolder", name);
	
	$.ajax({
		data:$.param({
			action:"RDS CREATE",
			project_id:localStorage.getItem("project_id"),
			insert:name
		}),
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		error:function(err){console.log("Error adding deficiency sheetset:",err);},
		success:function(result){
			var html=deficiency_sheets_log.template(result);
			$("#deficiency_sheets_log_placeholder").html(html);
		},
		type:"POST",
		url:"/uploads"
	});	
}};

rdsLog.prototype.drop=function(ev){
	/***
	https://msdn.microsoft.com/en-us/ie/ms536929(v=vs.94)
	You must cancel the default action for ondragenter and ondragover in order for ondrop to fire. In the case of a div, the default action is not to drop. This can be contrasted with the case of an input type=text element, where the default action is to drop. In order to allow a drag-and-drop action on a div, you must cancel the default action by specifying window.event.returnValue=false in both the ondragenter and ondragover event handlers. Only then will ondrop fire.
	
	https://stackoverflow.com/questions/2320069/jquery-ajax-file-upload
	Re. processData:false solves 'append called on an object that does not implement interface FormData'

	***/
	//ev.preventDefault();
	
	var fd=new FormData();
	//load up form data with dropped files...
	for (var i = 0; i < ev.dataTransfer.files.length; i++) {
		//console.log("name:", ev.dataTransfer.files[i].name);
		//console.log("filetype:", ev.dataTransfer.files[i].type);
		fd.append(ev.dataTransfer.files[i].name, ev.dataTransfer.files[i]);
	}
	fd.append("action","RDSS-UPLOAD");
	fd.append("project_id", localStorage.getItem("project_id"));
	fd.append("rdss_id",$(ev.target).text());
	fd.append("upload_file",true);
	
	$.ajax({	
		data:fd,
		contentType:false,
		error:function(err){console.log("Error uploading:",err);},
		processData:false, 
		success:function(result){console.log("Success uploading");},
		type:"POST",
		url:"/uploads"
	});	
};

rdsLog.prototype.select=function(ev){
	//localStorage.setItem("rdss_id", $(ev.target).text());
	//casbah.view("deficiency_sheets.html");
	var selected_docnum=$(ev.target).text();
	this.camel.argoSave({docnum:selected_docnum});
	this.camel.view("svr");
};


rdsLog.prototype.view=function(){

	//var fd=new FormData();
	//fd.append("action", "LOG");
	//fd.append("project_number", localStorage.getItem("project_number"));
	//fd.append("report_type", "deficiency_sheets");
	//fd.append("extension", ".png");
	//console.log("refresh", fd);

	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"RDSS-SELECT",
			project_id:localStorage.getItem("project_id")
		}),
		//data: fd,
		//contentType: false,
		error: function(err){ console.log("Ajax failed, server error", err); },
		success: function(result){
			var html=deficiency_sheets_log.template(result);
			$("#deficiency_sheets_log_placeholder").html(html);
		},
		type:"POST",
		url:"/uploads"
	});	
};



//////////////////////////////////////////
//END OF CLOSURE
return RdsLog;}();}

console.log("rdsLog.js loaded");








