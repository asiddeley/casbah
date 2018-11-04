
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
// Svr = Site Visit Report
// Client Side

// Add Svr creator function to casbah library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.svr=function(template_element){return new casbah.Svr(template_element);};

// Add Svr function to casbah library if missing
if (typeof casbah.Svr!="function"){casbah.Svr=function(){
	
// Site visit report
function svr(camel){

	//function svr(site$, branch){
	// site$=$("<div class='CASDOC'></div>")
	// branch = "prj-001/reports/site visit reports/SVR-A01"
	this.camel=camel;
	this.e$=camel.casdo$;
	//this.branch=camel.branch;

	// init text editor
	this.ed=new casbah.Editor();
	// init header
	this.header_template=Handlebars.compile(this.e$.find("#svr-header").html());
	// init context menu with jquery menu
	this.notes_menu=this.e$.find("#svr-notes-menu").menu();
	this.notes_menu.css("position","absolute", "width", "200px").hide();
	// init notes
	this.notes_template=Handlebars.compile(this.e$.find("#svr-notes-template").html());
	// init photos
	this.photos_template=Handlebars.compile(this.e$.find("#svr-photos-template").html());
	// init titleblocks
	this.titleblock_left_template=Handlebars.compile(this.e$.find("#svr-titleblock-left").html());
	this.titleblock_right_template=Handlebars.compile(this.e$.find("#svr-titleblock-right").html());
	// render 
	this.view();
};

svr.prototype.cache={};
svr.prototype.change=function(field, valu, callback){
	//console.log("CHANGE...", callback);
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"SVR CHANGE",
			pronum:this.camel.argo.pronum, //NEW!
			docnum:this.camel.argo.docnum, //NEW!
			field:field,
			valu:valu
		}),
		error: function(err){ 
			console.log("Server error...", err);
			callback();
		},
		success: function(result){ if (typeof callback =="function"){
			console.log("Server success...");
			callback();
		}},
		type:"POST",
		url:"/casite" //NEW!
	});
};

//svr.prototype.disclaimer={};
svr.prototype.disclaimer_view=function(){
	var h="<p>This report is a general review of progress and construction activities on site.  Architectural Work was visually reviewed on a random basis for general conformity with Architectural Contract Documents prepared by this firm.  Refer also to Mechanical and Electrical field reports issued separately.</p>";
	
	//screen version...
	this.e$.find("#svr-disclaimer-placeholder").html(h);
	//printable version...
	this.e$.find("#svr-disclaimer-printable").html(h);
};

svr.prototype.header={};

svr.prototype.header_edit=function(el){
	var svr=this;
	svr.ed.text(el, function(){
		var field=$(el).attr("field"); //eg. 'title'
		var text=svr.ed.val();
		svr.cache[field]=text;
		//svr.data[field][index]=; //eg. ['first comment','revised comment 2'...]
		console.log("FIELD",field, " UPDATED TEXT:", text);
		svr.change(field, svr.cache[field], function(){
			svr.ed.hide();
			//refresh (server request and render) or just render cache for now...
			//svr.titleblock.render(svr.data);
			var h=svr.header.template({svr:svr.cache});
			svr.e$.find("#svr-header-placeholder").html(h);
		});
	});
};

svr.prototype.notes={};

svr.prototype.notes_insert=function(){
	var svr=this;
	//this function is meant to be called from a context menu and without arguments
	var caller=svr.notes_menu.menu("option","caller");
	var sn=$(caller).attr("section_name");
	var si=$(caller).attr("section_index");
	var copy=$(caller).text();
	console.log("INSERT:", sn);
	//insert copy of text into section 
	svr.cache[sn].splice(si, 0, copy);
	svr.change(sn, svr.cache[sn], function(){svr.notes_view(svr);});
};

svr.prototype.notes_edit=function(el){

	svr=this;
	
	svr.ed.text(el, function(){
		var field=svr.ed.target_attr("section_name"); //eg. 'comments'
		var index=svr.ed.target_attr("section_index");
		var text=svr.ed.val();
		svr.cache[field][index]=text;
		//svr.cache[field][index]=; //eg. ['first comment','revised comment 2'...]
		console.log("FIELD",field, " UPDATED TEXT:", text);
		console.log("valu:",svr.cache[field]);
		svr.change(field, svr.cache[field], function(){
			console.log("Ed DONE...");
			svr.ed.hide();
			//refresh (server request and render) or just render cache for now...
			svr.notes_view(svr);
		});
	});
};

//reserved for jquery menu widget, initialized by Constructor
svr.prototype.notes_menu={};

svr.prototype.notes_ondragstart=function(el, ev){
	//note that "Text" argument is required by iexplorer, "text/plain" won't work...
	ev.dataTransfer.setData("Text", 
		"section_index:"+$(el).attr("section_index") + " " +
		"section_name:"+$(el).attr("section_name")
	);	
};

svr.prototype.notes_ondrop=function(el, ev){
	var svr=this;
	console.log("DROP...");
	//var txt=ev.dataTransfer.getData("text/plain");
	//note that "Text" argument is required by iexplorer...
	var tx=ev.dataTransfer.getData("Text");
	var a1=tx.indexOf("section_index:");
	var a2=tx.indexOf("section_name:");
	if ( a1 > -1 && a2 > -1){
		//from row index
		var fsi=tx.slice(a1+"section_index:".length).split(/\s+/)[0];
		var fsn=tx.slice(a2+"section_name:".length).split(/\s+/)[0];
		//to row index
		var tsi=$(el).attr("section_index");
		var tsn=$(el).attr("section_name");
		//console.log("drag from:", fsi, fsn, " drop to:", tsi, tsn);
		if (fsn == tsn){
			//same section 
			casbah.array_fromindex_toindex(svr.cache[tsn], fsi, tsi);
			//save changes then callback render
			svr.change(tsn, svr.cache[tsn], function(){svr.notes_view(svr);});
		} else if (fsn != tsn) {
			//different sections 
			//insert item at 'to' section
			svr.cache[tsn].splice(tsi, 0, svr.cache[fsn][fsi]);
			//remove item at 'from' section
			svr.cache[fsn].splice(fsi, 1);
			//save change for 'to' sections, then save change for 'from' section then callback renderer
			svr.change(tsn, svr.cache[tsn], function(){ 
				svr.change(fsn, svr.cache[fsn], function(){
					svr.notes_view(svr);
				});
			});
		}
	}	
};

svr.prototype.notes_view=function(svr){
	
	if (typeof svr=="undefined"){ svr=this;}

	//r = result from server or undefined
	//eg. = {generals:[...], comments:["comment 1", "comment 2",...],...}
	
	// svr.notes.render called without argument means cache changed and server updated, no need to get result from server just use cache, otherwise update local cache with server results
	//if (typeof r=="undefined"){ r=svr.cache;} else { svr.cache=r;}
	
	var r=svr.cache;
	//console.log("svr.notes_view...",r);	
	
	//reformat result r to suit the notes template
	svr.cache.rows=[].concat(
		svr.notes_format(r.generals, "generals", 1, "General Notes"),
		svr.notes_format(r.comments, "comments", 2, "Comments & Observations"),
		svr.notes_format(r.issues_closed, "issues_closed", 3, "Closed Issues"),
		svr.notes_format(r.issues, "issues", 4, "New and Ongoing Issues")
	);
	//console.log("SVR data:", svr.data);
	//get updated HTML...
	var h=svr.header_template({svr:r});
	var rtb=svr.titleblock_right_template({svr:r});
	var n=svr.notes_template({rows:svr.cache.rows})
	//render...
	svr.e$.find("#svr-header-placeholder").html(h);
	svr.e$.find("#svr-titleblock-report-placeholder").html(rtb);
	svr.e$.find("#svr-notes-placeholder").html(n);
}

svr.prototype.notes_format=function(section, section_name, section_num, section_title){
	//console.log("reformat_notes:", section);
	var rows=[{section_heading:true, section_name:section_name, txt:section_title, section_num:section_num, section_index:0}];
	for (i in section){rows.push({
		txt:section[i],
		section_item:true,
		section_name:section_name,
		section_num:section_num,
		section_index:Number(i)
	});}
	return rows;
};

svr.prototype.notes_remove=function(el){
	var svr=this;
	//this function is meant to be called from a context menu and without arguments
	var caller=svr.notes.menu.menu("option","caller");
	var sn=$(caller).attr("section_name");
	var si=$(caller).attr("section_index");
	//delete note from section 
	svr.cache[sn].splice(si, 1);
	//save change for 'to' sections, then save change for 'from' section then callback renderer
	svr.change(sn, svr.cache[sn], function(){svr.notes_view(svr);});
};

//init notes
//svr.notes.template=Handlebars.compile($("#svr-notes-template").html());
svr.prototype.notes_update=function(row, rowid){
	console.log("comments update ROWID:\n", rowid, "ROW:\n",row)
};

svr.prototype.photos={}

svr.prototype.photos_onclick=function(ev){}

svr.prototype.photos_ondrop=function(ev){
	var svr=this;
	/***
	https://msdn.microsoft.com/en-us/ie/ms536929(v=vs.94)
	You must cancel the default action for ondragenter and ondragover in order for ondrop to fire. In the case of a div, the default action is not to drop. This can be contrasted with the case of an input type=text element, where the default action is to drop. In order to allow a drag-and-drop action on a div, you must cancel the default action by specifying window.event.returnValue=false in both the ondragenter and ondragover event handlers. Only then will ondrop fire.
	
	https://stackoverflow.com/questions/2320069/jquery-ajax-file-upload
	Re. processData:false solves 'append called on an object that does not implement interface FormData'

	***/
	//ev.preventDefault();
	console.log("ONDROP...");
	var fd=new FormData();
	//load up form data with dropped files...
	for (var i = 0; i < ev.dataTransfer.files.length; i++) {
		//console.log("name:", ev.dataTransfer.files[i].name);
		//console.log("filetype:", ev.dataTransfer.files[i].type);
		fd.append(ev.dataTransfer.files[i].name, ev.dataTransfer.files[i]);
	}
	fd.append("action","SVR UPLOAD");
	fd.append("branch", svr.branch); //NEW!!
	fd.append("upload_file",true);
	
	$.ajax({	
		data:fd,
		contentType:false,
		error:function(err){console.log("Error uploading:",err);},
		processData:false, 
		success:function(result){
			//console.log("Success uploading, refresh everything...");
			//svr.refresh();
			console.log("Success uploading, rendering just photos...");
			svr.photos_view(svr);
		},
		type:"POST",
		url:"/casite"
	});
};

svr.prototype.photos_formats_filler=function(rx, i, row){
	var svr=this;
	var keys=Object.keys(rx);
	var vals=Object.values(rx);
	var j=keys.indexOf(i)+1;
	var len=keys.length;
	var span;
	//console.log("VALS:", vals);
	while (j<len && svr.photos.cc<12){
		//span=Number(vals[j].col.split("-")[2]); //col-xs-2 => 2
		if(vals[j].available==true ){
			if(vals[j].format=="landscape" && svr.photos.cc+5<=12) {
				svr.photos_formats_landscape(rx, keys[j], row);
			}
			else if (vals[j].format=="portrait"&& svr.photos.cc+3<=12){
				svr.photos_formats_portrait(rx, keys[j], row);}
		}
		j+=1;
	}
	svr.photos.cc=0; //assume row filled so reset column count
};

svr.prototype.photos_formats_landscape=function(rx, i, row){
	var svr=this;
	row.push({
		fig:true, 
		captions:rx[i].captions, 
		col:"col-xs-2", 
		index:svr.photos.index,
		key:rx[i].key
	});
	row.push({img:rx[i].path, col:"col-xs-4", index:svr.photos.index});
	svr.photos.cc+=6;
	svr.photos.index+=1;
	rx[i].available=false;
};

svr.prototype.photos_formats_portrait=function(rx, i, row){
	var svr=this;
	row.push({
		fig:true, 
		captions:rx[i].captions, 
		col:"col-xs-2", 
		index:svr.photos.index,
		key:rx[i].key
	})					
	row.push({img:rx[i].path, col:"col-xs-3", index:svr.photos.index});
	svr.photos.cc+=5;
	svr.photos.index+=1;
	rx[i].available=false;
};

svr.prototype.photos_formats_wide=function(rx, i, row){
	var svr=this;
	row.push({
		fig:true, 
		captions:rx[i].captions, 
		col:"col-xs-2", 
		index:svr.photos.index,
		key:rx[i].key
	})
	row.push({img:rx[i].path, col:"col-xs-10", index:svr.photos.index});
	svr.photos.cc+=12;
	svr.photos.index+=1;	
	rx[i].available=false;
};

svr.prototype.photos_layouts_azEasy=function(svr){
	//var svr=this;
	if (typeof svr=="undefined"){svr=this;}

	//reformat result for photos template...
	//svrdata.xdata = {img01:{caption:"", date:"", format:"", path:"..."}, ...}		
	svr.photos.index=0;
	svr.photos.cc=0; //column counter	
	
	//var rx=svrdata.xdata;
	var rx=svr.cache.xdata;
	var rows=[], row=[]; 
	
	for (var i in rx){
		if(rx[i].available==true){
			if(rx[i].format=="landscape") {
				if (svr.photos.cc > 6) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos_formats_landscape(rx, i, row);
			} else if (rx[i].format=="portrait") {
				if (svr.photos.cc > 7) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos_formats_portrait(rx, i, row);
			} else if (rx[i].format=="wide") {
				if (svr.photos.cc > 1) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos_formats_wide(rx, i, row);
			}
		};
	};			
	rows.push(row); 
	return rows;
}

//svr.prototype.photos_layouts_azTight=function(svrdata){
svr.prototype.photos_layouts_azTight=function(svr){

	if (typeof svr=="undefined"){svr=this;}
	
	//svr.cache.xdata = {img01:{caption:"", date:"", format:"", path:"..."}, ...}		
	svr.photos.index=0; //image counter
	svr.photos.cc=0; //column counter, 12 columns is 1 row in bootstrap
	
	//var rx=svrdata.xdata;
	var rx=svr.cache.xdata;
	var rows=[],row=[];

	for (var i in rx){
		if(rx[i].available==true){
			if(rx[i].format=="landscape") {
				svr.photos_formats_landscape(rx, i, row);
				svr.photos_formats_filler(rx, i, row);
				rows.push(row); row=[];
			} else if (rx[i].format=="portrait") {
				svr.photos_formats_portrait(rx, i, row);
				svr.photos_formats_filler(rx, i, row);
				rows.push(row); row=[];
			} else if (rx[i].format=="wide") {
				svr.photos_formats_wide(rx, i, row);
				svr.photos_formats_filler(rx, i, row);
				rows.push(row); row=[];				
			}
		};
	};			
	return rows;
}

//svr.prototype.photos_view=function(svrdata){
svr.prototype.photos_view=function(svr){

	if (typeof svr=="undefined"){svr=this;}

	//layout photos in svrdata.xdata to photorows as required for handlebar template
	//svr.cache.photorows=svr.photos_layouts_azTight(svrdata);
	svr.cache.photorows=svr.photos_layouts_azTight(svr);
	//get updated html
	var h=svr.photos_template({rows:svr.cache.photorows})
	//render...
	svr.e$.find("#svr-photos-placeholder").html(h);
};

svr.prototype.titleblock_right_edit=function(el){
	var svr=this;
	svr.ed.text(el, function(){
		var field=$(el).attr("field"); //eg. 'date'
		var text=svr.ed.val();
		svr.cache[field]=text;
		//svr.data[field][index]=; //eg. ['first comment','revised comment 2'...]
		console.log("FIELD",field, " UPDATED TEXT:", text);
		svr.change(field, svr.cache[field], function(){
			svr.ed.hide();
			//refresh (server request and render) or just render cache for now...
			var h=svr.titleblock_right_template({svr:svr.cache});
			//svr.titleblock.render(svr.data);
			svr.e$.find("#svr-titleblock-report-placeholder").html(h);			
		});
	});
};

svr.prototype.titleblock_left_view=function(){
	var svr=this;
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data:$.param({
			action:"PRO SELECT", //get project information for titleblock
			//branch:svr.camel.argo.branch, 
			pronum:svr.camel.argo.pronum,
			docnum:svr.camel.argo.docnum
		}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			//update html
			var h=svr.titleblock_left_template(result);
			//render
			svr.e$.find("#svr-titleblock-project-placeholder").html(h);
		},
		type:"POST",
		url:"/casite"
	});
};

// view or render everything, includes data project and document refreshes
svr.prototype.view=function(){
	
	var svr=this;	
	
	//renders titleblock_left IE project info
	svr.titleblock_left_view(); 
	svr.disclaimer_view();
	
	//renders header, notes & titleblock_right IE report info 
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"SVR SELECT",
			pronum:svr.camel.argo.pronum,
			docnum:svr.camel.argo.docnum
		}),
		error: function(err){ console.log(err.message);},
		success: function(result){
			svr.cache=result.svrs[0];
			console.log("SVR SELECT success...", svr.cache);
			svr.notes_view(svr);
			svr.photos_view(svr);
		},
		type:"POST",
		url:"/casite"
	});	
};

//END OF CLOSURE
return svr;}();}

console.log("svr.js loaded");