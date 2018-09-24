
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

// start of closure
if (typeof casbah.SVR!="function"){casbah.SVR=function(){
	
///////////////////////
// Site visit report
// 
function svr(element){
	//place for report
	this.$e=$(element);
	// init text editor
	this.ed=new casbah.Editor();
	// init header
	this.header.template=Handlebars.compile(this.$e.find("#svr-header").html());
	// init context menu with jquery menu
	this.notes.menu=this.$e.find("#svr-notes-menu").menu();
	this.notes.menu.css("position","absolute", "width", "200px").hide();
	// init notes
	this.notes.template=Handlebars.compile(this.$e.find("#svr-notes-template").html());
	// init photos
	this.photos.template=Handlebars.compile(this.$e.find("#svr-photos-template").html());
	// init titleblocks
	this.titleblock_left.template=Handlebars.compile(this.$e.find("#svr-titleblock-left").html());
	this.titleblock_right.template=Handlebars.compile(this.$e.find("#svr-titleblock-right").html());
	///////////////////////////////////////
	// Render 
	this.titleblock_left.render(); //renders titleblock_left IE project info
	this.disclaimer.render();
	this.refresh(); //renders header, notes & titleblock_right IE report info 
};

svr.prototype.cache={};
svr.prototype.change=function(field, valu, callback){
	//console.log("SVR_ID", localStorage.getItem("svr_id"))
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"SVR-CHANGE",
			project_id:localStorage.getItem("project_id"),
			svr_id:localStorage.getItem("svr_id"),
			field:field,
			valu:valu
		}),
		error: function(err){ console.log(err.message);},
		success: function(result){ if (typeof callback =="function"){callback();}},
		type:"POST",
		url:"/uploads"
	});
};

svr.prototype.disclaimer={};
svr.prototype.disclaimer.render=function(){
	var h="<p>This report is a general review of progress and construction activities on site.  Architectural Work was visually reviewed on a random basis for general conformity with Architectural Contract Documents prepared by this firm.  Refer also to Mechanical and Electrical field reports issued separately.</p>";
	
	//screen version...
	this.$e.find("#svr-disclaimer-placeholder").html(h);
	//printable version...
	this.$e.find("#svr-disclaimer-printable").html(h);
};


// text editor
//svr.prototype.ed=new casbah.Editor();

svr.prototype.header={};
//init header
//svr.header.template=Handlebars.compile($("#svr-header").html());
svr.prototype.header.edit=function(el){
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
			//screen
			svr.$e.find("#svr-header-placeholder").html(h);
			//printable version
			svr.$e.find("#svr-header-printable").html(h);
		});
	});
};

svr.prototype.notes={};

svr.prototype.notes.insert=function(){
	var svr=this;
	//this function is meant to be called from a context menu and without arguments
	var caller=svr.notes.menu.menu("option","caller");
	var sn=$(caller).attr("section_name");
	var si=$(caller).attr("section_index");
	var copy=$(caller).text();
	console.log("INSERT:", sn);
	//insert copy of text into section 
	svr.cache[sn].splice(si, 0, copy);
	svr.change(sn, svr.cache[sn], svr.notes.render);
};

// setup context menu
//svr.notes.menu=$("#svr-notes-menu").menu();
//svr.notes.menu.css("position","absolute", "width", "200px").hide();

svr.prototype.notes.edit=function(el){
	var svr=this;
	svr.ed.text(el, function(){
		var field=svr.ed.target_attr("section_name"); //eg. 'comments'
		var index=svr.ed.target_attr("section_index");
		var text=svr.ed.val();
		svr.cache[field][index]=text;
		//svr.data[field][index]=; //eg. ['first comment','revised comment 2'...]
		console.log("FIELD",field, " UPDATED TEXT:", text);
		svr.change(field, svr.cache[field], function(){
			svr.ed.hide();
			//refresh (server request and render) or just render cache for now...
			svr.notes.render(svr.cache);
		});
	});
};

svr.prototype.notes.ondragstart=function(el, ev){
	//note that "Text" argument is required by iexplorer, "text/plain" won't work...
	ev.dataTransfer.setData("Text", 
		"section_index:"+$(el).attr("section_index") + " " +
		"section_name:"+$(el).attr("section_name")
	);	
};

svr.prototype.notes.ondrop=function(el, ev){
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
			svr.change(tsn, svr.cache[tsn], svr.notes.render );
		} else if (fsn != tsn) {
			//different sections 
			//insert item at 'to' section
			svr.cache[tsn].splice(tsi, 0, svr.cache[fsn][fsi]);
			//remove item at 'from' section
			svr.cache[fsn].splice(fsi, 1);
			//save change for 'to' sections, then save change for 'from' section then callback renderer
			svr.change(tsn, svr.cache[tsn], function(){ svr.change(fsn, svr.cache[fsn], svr.notes.render);});
		}
	}	
};


svr.prototype.notes.render=function(r){
	var svr=this;
	//result from server or undefined
	//r={generals:[...], comments:["comment 1", "comment 2",...],...}

	// svr.notes.render called without argument means cache changed and server updated, no need to get result from server just use cache, otherwise update local cache with server results
	if(typeof r == "undefined"){ r=svr.cache;} else { svr.cache=r;}
	
	//reformat result r to suit the notes template
	svr.cache.rows=[].concat(
		svr.notes.reformat(r.generals, "generals", 1, "General Notes"),
		svr.notes.reformat(r.comments, "comments", 2, "Comments & Observations"),
		svr.notes.reformat(r.issues_closed, "issues_closed", 3, "Closed Issues"),
		svr.notes.reformat(r.issues, "issues", 4, "New and Ongoing Issues")
	);
	//console.log("SVR data:", svr.data);
	//get updated HTML...
	var h=svr.header.template({svr:r});
	var rtb=svr.titleblock_right.template({svr:r});
	var n=svr.notes.template({rows:svr.cache.rows})
	//put it to screen...
	svr.$e.find("#svr-header-placeholder").html(h);
	svr.$e.find("#svr-titleblock-right-placeholder").html(rtb);
	svr.$e.find("#svr-notes-placeholder").html(n);
	//put it to printable...
	svr.$e.find("#svr-header-printable").html(h);
	svr.$e.find("#svr-titleblock-report-printable").html(rtb);
	svr.$e.find("#svr-notes-printable").html(n);
}

svr.prototype.notes.reformat=function(section, section_name, section_num, section_title){
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

svr.prototype.notes.remove=function(el){
	var svr=this;
	//this function is meant to be called from a context menu and without arguments
	var caller=svr.notes.menu.menu("option","caller");
	var sn=$(caller).attr("section_name");
	var si=$(caller).attr("section_index");
	//delete note from section 
	svr.cache[sn].splice(si, 1);
	//save change for 'to' sections, then save change for 'from' section then callback renderer
	svr.change(sn, svr.cache[sn], svr.notes.render);
};

//init notes
//svr.notes.template=Handlebars.compile($("#svr-notes-template").html());
svr.prototype.notes.update=function(row, rowid){
	console.log("comments update ROWID:\n", rowid, "ROW:\n",row)
};

/////////////////
// PHOTOS
svr.prototype.photos={}

svr.prototype.photos.ondrop=function(ev){
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
	fd.append("action","SVR-UPLOAD");
	fd.append("project_id", localStorage.getItem("project_id"));
	fd.append("svr_id",localStorage.getItem("svr_id"));
	fd.append("upload_file",true);
	
	$.ajax({	
		data:fd,
		contentType:false,
		error:function(err){console.log("Error uploading:",err);},
		processData:false, 
		success:function(result){
			console.log("Success uploading, refresh everything...");
			svr.refresh();
		},
		type:"POST",
		url:"/uploads"
	});	

};

svr.prototype.photos.formats={};

svr.prototype.photos.formats.filler=function(rx, i, row){
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
				svr.photos.formats.landscape(rx, keys[j], row);
			}
			else if (vals[j].format=="portrait"&& svr.photos.cc+3<=12){
				svr.photos.formats.portrait(rx, keys[j], row);}
		}
		j+=1;
	}
	svr.photos.cc=0; //assume row filled so reset column count
};


svr.prototype.photos.formats.landscape=function(rx, i, row){
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

svr.prototype.photos.formats.portrait=function(rx, i, row){
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

svr.prototype.photos.formats.wide=function(rx, i, row){
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

svr.prototype.photos.layouts={};

svr.prototype.photos.layouts.azEasy=function(svrdata){
	var svr=this;
	//reformat result for photos template...
	//svrdata.xdata = {img01:{caption:"", date:"", format:"", path:"..."}, ...}		
	svr.photos.index=0;
	svr.photos.cc=0; //column counter	
	var rx=svrdata.xdata;
	var rows=[], row=[]; 
	
	for (var i in rx){
		if(rx[i].available==true){
			if(rx[i].format=="landscape") {
				if (svr.photos.cc > 6) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos.formats.landscape(rx, i, row);
			} else if (rx[i].format=="portrait") {
				if (svr.photos.cc > 7) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos.formats.portrait(rx, i, row);
			} else if (rx[i].format=="wide") {
				if (svr.photos.cc > 1) {rows.push(row); row=[]; svr.photos.cc=0;}
				svr.photos.formats.wide(rx, i, row);
			}
		};
	};			
	rows.push(row); 
	return rows;
}

svr.prototype.photos.layouts.azTight=function(svrdata){
	var svr=this;
	//svrdata.xdata = {img01:{caption:"", date:"", format:"", path:"..."}, ...}		
	svr.photos.index=0; //image counter
	svr.photos.cc=0; //column counter, 12 columns is 1 row in bootstrap
	var rx=svrdata.xdata;
	var rows=[],row=[];

	for (var i in rx){
		if(rx[i].available==true){
			if(rx[i].format=="landscape") {
				svr.photos.formats.landscape(rx, i, row);
				svr.photos.formats.filler(rx, i, row);
				rows.push(row); row=[];
			} else if (rx[i].format=="portrait") {
				svr.photos.formats.portrait(rx, i, row);
				svr.photos.formats.filler(rx, i, row);
				rows.push(row); row=[];
			} else if (rx[i].format=="wide") {
				svr.photos.formats.wide(rx, i, row);
				svr.photos.formats.filler(rx, i, row);
				rows.push(row); row=[];				
			}
		};
	};			
	return rows;
}

svr.prototype.photos.render=function(svrdata){
	var svr=this;
	//layout photos in svrdata.xdata to photorows as required for handlebar template
	//svr.data.photorows=svr.layouts.azEasy(svrdata)
	svr.cache.photorows=svr.photos.layouts.azTight(svrdata);
	//get updated html
	var h=svr.photos.template({rows:svr.cache.photorows})
	//put it to screen...
	svr.$e.find("#svr-photos-placeholder").html(h);
	//put it to printable...
	svr.$e.find("#svr-photos-printable").html(h);
}

//init photos
//svr.photos.template=Handlebars.compile($("#svr-photos-template").html());


/////////////////////
// Refresh

svr.prototype.refresh=function(result, delta){
	var svr=this;
	//console.log("SVR_ID", localStorage.getItem("svr_id"))
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"SVR-SELECT",
			project_id:localStorage.getItem("project_id"),
			svr_id:localStorage.getItem("svr_id")
		}),
		error: function(err){ console.log(err.message);},
		success: function(result){
			console.log("SVR-SUCCESS");
			svr.notes.render(result.svrs[0]);
			svr.photos.render(result.svrs[0]);
		},
		type:"POST",
		url:"/uploads"
	});
};


/////////////
// titleblocks
svr.prototype.titleblock_left={};
svr.prototype.titleblock_right={};

svr.prototype.titleblock_right.edit=function(el){
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
			var h=svr.titleblock_right.template({svr:svr.cache});
			//svr.titleblock.render(svr.data);
			svr.$e.find("#svr-titleblock-right-placeholder").html(h);
			
			//untested
			svr.$e.find("#svr-titleblock-report-printable").html(h);			
		});
	});
};

svr.prototype.titleblock_left.render=function(){
	var svr=this;
	//console.log("PROJECT SELECT");
	//var svr_id=localStorage.getItem("svr_id");
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"PROJECT-SELECT",
			//select info for this project only...
			project_id:localStorage.getItem("project_id")
		}),
		error: function(err){ console.log("Error", err);},
		success: function(result){
			//update html
			var h=svr.titleblock_left.template(result);
			//put it to screen
			svr.$e.find("#svr-titleblock-left-placeholder").html(h);
			//put it to printable
			svr.$e.find("#svr-titleblock-project-printable").html(h);
		},
		type:"POST",
		url:"/uploads"
	});
};

// init titleblocks
//svr.titleblock_left.template=Handlebars.compile($("#svr-titleblock-left").html());
//svr.titleblock_right.template=Handlebars.compile($("#svr-titleblock-right").html());

///////////////////////////////////////
// Render page 
//svr.titleblock_left.render(); //renders titleblock_left IE project info
//svr.disclaimer.render();
//svr.refresh(); //renders header, notes & titleblock_right IE report info 




//END OF CLOSURE
return svr;}();}
