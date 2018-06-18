/**********************************
CASBAH * Contract Admin Site * Be Architectural Heroes


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

const path = require("path")
const fs = require("fs")
const fsp = require(path.join(global.appRoot,"server","fs+"))
const sizeOf = require('image-size');
const reports_dir="reports"

/************************** FYI
	Stats {
	  dev: 2114,
	  ino: 48064969,
	  mode: 33188,
	  nlink: 1,
	  uid: 85,
	  gid: 100,
	  rdev: 0,
	  size: 527,
	  blksize: 4096,
	  blocks: 8,
	  atimeMs: 1318289051000.1,
	  mtimeMs: 1318289051000.1,
	  ctimeMs: 1318289051000.1,
	  birthtimeMs: 1318289051000.1,
	  atime: Mon, 10 Oct 2011 23:24:11 GMT,
	  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
	  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
	  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
******************************/
const frameType=function(image){
	var dims=sizeOf(image) 
	var ratio=dims.height/dims.width
	if (ratio >= 1) {return "portrait"}
	else if (ratio >= 0.5) {return "landscape"}
	else {return "wide"}
}

const filedate=function(image){
	var d="2018-Feb-31"
	try{
		//eg. Thu Jun 14 2018
		//d=fs.statSync(image).birthtime.toDateString()
		
		//eg. 2018-06-14
		d=fs.statSync(image).ctime.toISOString().substring(0,10)

		//console.log("FILEDATE:", d)
	}	
	catch(err){console.log("filedate ", err)}
	return d
}

////////////////////////////////////////////////////
// rdss - Room Deficiency Sheets LOG
const rdss_dir="deficiency sheets"
const rdss_jsonfile="__rdss.json"
const rdss_json={
	project_id:"!req.body.project_id",			
	rdss_id:"!req.body.rdss_id",
	rdss_title:"untittled",
	date:"2018-May-10",
	date_issued:"none",
	author:"localStorage.getItem('user')",	
	checklist:"[]",
	xdata:"none"
}

exports.rdss_insert=function(req, res){

	//Makes a folder, returns a list of folders including the new folder
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, rdss_dir);
	console.log("RDSS INSERT:", p, req.body.insert)
	try {
		fs.mkdirSync(path.join(p, req.body.insert))
		//result {dirs:[{dir:"name"}, {dir:"name"}...]}
		res.json({
			dirs:fsp.getDirsSync(p).map(i => {return {dir:i}}),
			project_id:req.body.project_id
		});
	}
	catch(err) {
		console.log(err);
		res.json({
			folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
			err:err,
			project_id:req.body.project_id
		})
	} 
}

exports.rdss_select=function(req, res){
	//returns all rdss
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, rdss_dir);
	//empty result
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}], json:rdss_json} 
	console.log("RDSS select:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			var rar=fsp.dirSync_json(p, rdss_jsonfile, rdss_json)
			//convert jsontext to object in result
			for (var i in rar){
				try{rar[i]=Object.assign(rar[i], JSON.parse(rar[i].jsontext))}
				catch(err){rar[i].err=err}
			}
			//include dirs field... {dirs:rar, defrow:{}}
			r.dirs=rar
			res.json(r)
			console.log("RDSS success:")
		} 
		else {res.json(r); console.log("RDSS error:", err.code)}
	})
}


exports.rdss_upload=function(req, res){
	
	if (!req.files) {
		var err="RDS-UPLOAD error, missing files"
		console.log(err)
		res.json({dirs:[], err:err}) 
		return
	}
	//required arguments...
	var p=path.join(
		global.appRoot, 
		req.body.uploads_dir, 
		req.body.project_id, 
		reports_dir, 
		rdss_dir,
		req.body.rdss_id
	)
	console.log("RDS-UPLOAD file(s):", Object.keys(req.files))
	console.log("RDS-UPLOAD to:", p)
	try {
		var dest, file;
		for (var f in req.files){
			file=req.files[f]
			dest=path.join(p, file.name)
			//console.log("RDS-UPLOAD file:", dest)
			//.mv function added by 'express-fileupload' middleware
			file.mv(dest, function(err) {
				if (err) {console.log ("RDS-UPLOAD failed to move:", dest, err)} 
				else {console.log ("RDS-UPLOAD file uploaded:", dest)}
			})
		}			
	}
	catch(err) {		
		res.json({dirs:[], err:err})
		console.log(err)
	}	
}


////////////////////////////////////////////////////
// rds - Room Deficiency Sheets 


exports.rds_images=function(req, res){
	/****
	Returns a list of files in path matching extension. NOT RECURSIVE
	Prerequisites
	//req.body.project_id
	//req.body.extension... ".jpg .pgn .bmp"
	//req.body.deficiency_sheets
	*/
	try {
		//part path...
		var pp=path.join(
			req.body.uploads_dir, 
			req.body.project_id, 
			reports_dir, 
			rdss_dir,
			req.body.rdss_id
		);
		console.log("RDS-IMAGES:", pp)
		//var files=fsp.walkSync(path.join( //recursive and includes full path
		//returns current folder only and just filenames without path
		var files=fsp.getFilesSync(path.join (global.appRoot, pp)); 
		var images=[];
		var extarg=(typeof req.body.extension == "undefined")?".PNG .JPG":req.body.extension
		var ext;
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			ext=path.extname(files[i]).toUpperCase()
			if (extarg.toUpperCase().indexOf(ext)!=-1){images.push(path.join(pp, files[i]))}
		}
		res.json({images:images, project_id:req.body.project_id,})
	} 
	catch(err) {
		res.json({images:[], err:err, project_id:req.body.project_id})
		console.log("RDS-IMAGES error:",err)
	}
}



/////////////////
// site visit reviews
const svr_dir="site reviews"
const svr_jsonfile="__svrData.json"
const svr_json={
	project_id:"$project_id",
	svr_id:"$dir",
	title:"Field Review Report",
	date:"2018-May-10",
	date_issued:"none",
	author:"$user",
	comments:["Comment", "Another comment"],
	generals:["General note"],
	issues:["Issue", "Another issue"],
	issues_closed:["Closed issue", "Another closed issue"],
	//files:[], added after json read
	xdata:{}
}

exports.svr_select=function(req, res){
	//returns all site reviews
	var p, root, rr

	try {
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
		console.log("SVR select:", p);	
		root=path.join(req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
		rr={
			svrs:[{svr_id:"", jsonfile:"", jsontext:""}],
			project_id:req.body.project_id,
			root:"place-holder/for/root/path",
			err:null
		} 
		
		//check if exists - catch error otherwise
		fs.statSync (p)
		/******
		Get list of directories and corresponding jsonfile
		since fourth argument is supplied, only information for than directory will be returned, not all 
		var svrs=fsp.dirSync_json(p, svr_jsonfile, svr_defrow, req.body.svr_id)
		svrs = [{dir:"name", files:[], jsonfile:"name", jsontext:"{field:value, }"}, ...]
		*/		
		
		var svrs=fsp.dirSync_json({
			dir:p,
			jsonfile:svr_jsonfile,
			json:svr_json,
			id:req.body.svr_id,
			extensions:".jpg .png"
		})
		
		//get from each result, jsontext, parse it to an object then merge it into each result
		svrs=fsp.jsonify(svrs)
		
		//add to each result, svr_id property with it's value being the directory
		rr.svrs=fsp.dirasid(svrs, "svr_id")
		
		/**
		Add image information to xdata - new files only
		svrs = [{dir:"name", files:[], svr_id:"name", xdata:{...}, ...}, ...]
		xdata = {image:{frametype:"portrait", path:"...", caption:"title", date:""}, ...}
		**/
		rr.svrs.map(function(svr){
			svr.files.map(function(f){
				//f!="uploads/project_dir/reports/site visit/FRR-001/image1__caption1__caption2.jpg"
				//f="image1__caption1__caption2.jpg"
				//key=image1

				var key, captions, p=path.join(root, svr.dir, f)

				if (f.indexOf("__")!=-1){
					//break filenam into key and array of captions
					//filename="key__caption1__caption2__caption3.ext"
					key=f.substring(0, f.indexOf("__"))
					captions=f.substring(f.indexOf("__")+2, f.lastIndexOf(".")).split("__")
				} else {
					//short filename so make caption same as key
					key=f.substring(0, f.lastIndexOf("."))
					captions=f.substring(0, f.lastIndexOf("."))
				}
				console.log("f:",f, " key:",key)
				//if (typeof(svr.xdata[f])=="undefined" ){
				if (typeof(svr.xdata[key])=="undefined" ){
					svr.xdata[key]={
						available:true,
						captions:captions,
						format:frameType(p),
						key:key,
						path:p
					}
					//set frametype as a property, better for handlebars eg. {{if this.portrait}}...
					svr.xdata[key][frameType(p)]=true
				}
			})
			//console.log ("SVR xdata:", svr.xdata)
		})
		
		res.json(rr)
		console.log("SVR success:", rr)
	}
	catch(err){
		rr.err=err
		res.json(rr)
		console.log("SVR catch:", rr)
	}
}

exports.svr_change=function(req, res){
	var p, field, valu, stat, json

	try{
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir, req.body.svr_id, svr_jsonfile)
		field=req.body.field
		valu=req.body.valu
		stat="OK"
		console.log("SVR CHANGE:", field, " VALUE TO:",valu, " IN:", p)	
		json=JSON.parse(fs.readFileSync(p))
		json[field]=valu
		fs.writeFileSync(p,JSON.stringify(json))
	}
	catch(err) {
		stat=err
		console.log("SVR_CHANGE Catch:",err)
	} 
	finally {
		var result={data:[json],stat:stat}
		res.json(result);
		console.log("SVR_CHANGE finally:", result)
	}
}

exports.svrl_insert=function(req, res){

	var err, p
	try {
		//Make a folder then returns a list of folders including the new folder
		err=null
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
		console.log("SVRL INSERT:", p, req.body.svr_id)
		fs.mkdirSync(path.join(p, req.body.svr_id))
	}
	catch(e) {err=e; console.log(err);} 
	finally {
		//return {svrs:[{svrs_id:"name"}, {dir:"name"}...]}
		var svrs=fsp.jsonify(fsp.dirSync_json(p, svr_jsonfile, svr_json))
		var r={
			err:err,
			svrs:fsp.dirasid(svrs, "svr_id"),
			project_id:req.body.project_id
		}
		res.json(r);
		console.log("SVRL INSERT finally:",r)
	}
}
