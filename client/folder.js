/**********************************
CASBAH * Contract Admin System Be Architectural Heroes *


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

////////////////
// Folder
// client side

function Folder(element){
	this.e$=$(element);
	//init menu
	this.menu$=e$.find("#folder-menu").menu().css("position","absolute", "width", "200px").hide();

	this.templates={};
	this.templates.folder=Handlebars.compile(e$.find("#folder-template").html());
	this.templates.file=Handlebars.compile(e$.find("#file-template").html());
	
	// Render page...
	this.refresh();
};

Folder.prototype.insert=function(ev){
	// Inserts a new folder into current folder  
	var folder=this;
	// Called from Menu 	
	var caller=folder.menu$.menu("option","caller");
	// path info stored in element 
	var path=$(caller).attr("path");
	// casdoc or folder's purpose set in menu
	var casdoc=folder.menu$.menu("option","casdoc");
	// user prompted for name
	var folder_insert=prompt("Name of new folder to insert");
	
	if (folder_insert != "" && folder_insert != null){
		$.ajax({
			data:$.param({
				action:"FOLDER-INSERT", 
				folder_insert:folder_insert, 
				path:path, 
				casdoc:casdoc
			}),
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			error:function(err){console.log("Error from server:", err);},
			success:function(result){folder.refresh();	},
			type:"POST",
			url:"/uploads"
		});	
	}
};


Folder.prototype.refresh=function(el){
	var folder_path;
	if (typeof el=="undefined") {folder_path=localStorage.getItem("folder_path");}
	else {folder_path=$(el).attr("folder_path")+"\\"+$(el).text();}
	
	if (typeof folder_path=="undefined") {folder_path="";}
	
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
};

Folder.prototype.refresh_data=function(folder_path, folder_name){
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"FOLDER-DATA",
			folder_path:folder_path,
			folder_name:folder_name
		}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			//result={folder_name:"somename", folder_type:"", desc:""}
			//note using multiple selectors without comma means AND... 
			$("[folder_name='"+result.folder_name+"'][folder_type]").text(result.folder_type);
			$("[folder_name='"+result.folder_name+"'][folder_desc]").text(result.folder_desc);
		},
		type:"POST",
		url:"/uploads"
	});
};

Folder.prototype.render=function(result){

	//result={folder_path:"uploads/prj-001", folders:[], files:[]}
	//render list of folders
	$("#folder-placeholder").html(folder.templates.folder(result));
	$("#file-placeholder").html(folder.templates.file(result));
	
	
	//then render data related to each folder
	for (var i in result.folders){				
		//folder.refresh_data(result.folder_path, result.folders[i])
	} 
}



Folder.prototype.up=function(el){
	// goes to the parent folder 
	var folder_path;
	if (typeof el=="undefined"){folder_path="";}
	else {folder_path=$(el).text();		
		folder_path=folder_path.split("\\");
		folder_path.pop();
		folder_path=folder_path.join("\\");
	}
	
	if (folder != "" && folder != null){
		$.ajax({
			data: $.param({
				action:"FOLDER-SELECT",
				folder_path:folder_path,
				project_id:localStorage.getItem("project_id")
			}),			
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			error:function(err){console.log("Error from server:", err);},
			success:function(result){folder.render(result);},
			type:"POST",
			url:"/uploads"
		});	
	}
}


/****
</script>
</head>
<body>

<!-- PAGE -->

<div class="container">
	<div id="folder-placeholder">placeholder</div>
	<div id="file-placeholder">placeholder</div>
	<br><br><br><br>
</div>

<template id="folder-template" type="text/x-handlebars-template">
	<div class="row">
		<h3 
		class="col-xs-12"
		onclick="folder.up(this)"
		oncontextmenu="casbah.showMenu(folder.menu$, event)"
		onmouseenter="$(this).addClass('highlight')"
		onmouseleave="$(this).removeClass('highlight')"
		path="{{folder_path}}"
		title="click to go up a folder, right-click for menu..."
		>{{folder_path}}</h3>
	</div>

	<div class="row zebra row__">
		<span class="col-xs-6 row-head">Folders ({{folders.length}})</span>
		<span class="col-xs-1 row-head">Type</span>
		<span class="col-xs-5 row-head">Description</span>
	</div>		

	{{#each folders }}

	<div class="row">
	<p 	class="col-xs-6"
		onmouseenter="$(this).addClass('highlight')"
		onmouseleave="$(this).removeClass('highlight')"
		title="Click to view"
		folder_path="{{../folder_path}}"
		onclick="folder.refresh(this);">{{this}}</p>

	<p 	class="col-xs-1 marz"
		folder_type
		folder_path="{{../folder_path}}"
		folder_name="{{this}}">--</p>

	<p 	class="col-xs-5 marz"
		folder_desc
		folder_path="{{../folder_path}}"
		folder_name="{{this}}">--</p>


	</div>
	{{/each}}
</template>


<template id="file-template" type="text/x-handlebars-template">
	
	<div class="row zebra" >
		<span class="col-xs-6 row-head">Files ({{files.length}})</span>
		<span class="col-xs-1 row-head">Type</span>
		<span class="col-xs-5 row-head">Description</span>
	</div>		
	
	{{#each files }}

	<div class="row marz">
	<p 	class="col-xs-6"
		onmouseenter="$(this).addClass('highlight')"
		onmouseleave="$(this).removeClass('highlight')"
		title="Click to view"
		folder_path="{{../folder_path}}"
		onclick="folder.refresh(this);">{{this}}</p>
		
	<p 	class="col-xs-1"
		file_type
		folder_path="{{../folder_path}}"
		folder_name="{{this}}">--</p>
	
	<p 	class="col-xs-5"
		file_desc
		folder_path="{{../folder_path}}"
		folder_name="{{this}}">--</p>
	</div>
	{{/each}}
	
</template>


<!-- MENUS -->
<ul id="folder-menu" onmouseleave="folder.menu.hide()" class="hide9999">
<li onclick="folder.insert();">New Folder</li>
<li onclick="folder.refresh();">Refresh Page</li>
<li onclick="folder.menu$.hide()">Exit Menu</li>
</ul >

****/

