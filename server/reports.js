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

const reports_dir="reports"

////////////////////////////////////////////////////
// rdss - Room Deficiency Sheets LOG
const rdss_dir="deficiency_sheets"
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
		//part path..
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
const svr_dir="site_reviews"
const svr_jsonfile="__svrData.json"
const svr_json={
	project_id:"$project_id",
	svr_id:"$dir",
	title:"untitled",
	date:"2018-May-10",
	date_issued:"none",
	author:"$user",
	comments:["Comment", "Another comment"],
	generals:["General note"],
	issues:["Issue", "Another issue"],
	xissues:["Closed issue", "Another closed issue"],
	//photos:[{filename:"", caption:""}],
	photos:"$filenames .jpg .png",
	//filenames without extensions, includes .jpg, png and saves to captions //TO COMPLEX
	initializer:"$filenamesWox .jpg .png :captions",
	captions:[],
	root:"$root",
	xdata:{}
}

exports.svr_select=function(req, res){
	//returns all site reviews
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
	var root=path.join(req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
	//empty result
	var rr={
		svrs:[{svr_id:"", jsonfile:"", jsontext:""}],
		project_id:req.body.project_id,
		root:"place-holder/for/root/path",
		err:null
	} 
	console.log("SVR select:", p);
	try {
		//check if exists
		fs.statSync (p)
		//get list of directories and corresponding jsonfile
		//since fourth argument is supplied, only information for than directory will be returned, not all 
		//var svrs=fsp.dirSync_json(p, svr_jsonfile, svr_defrow, req.body.svr_id)
		var svrs=fsp.dirSync_json({
			dir:p,
			jsonfile:svr_jsonfile,
			json:svr_json,
			id:req.body.svr_id,
			extensions:".jpg .png"
			//result:{root:root, svr_id:"$dir", jsonfile:"$jsonfile", photos:"$files .jpg .png"}
		})
		//get from each result, jsontext, parse it to an object then merge it into each result
		svrs=fsp.jsonify(svrs)
		//add to each result, svr_id property with it's value being the directory
		rr.svrs=fsp.dirasid(svrs, "svr_id")
		//add to results, root property as needed for images
		rr.svrs.map(function(i){i.root=root; return i})
		res.json(rr)
		console.log("SVR success:", rr)
	}
	catch(err){
		rr.err=err
		res.json(rr)
		console.log("SVRL catch:", rr)
	}
}


exports.svrl_insert=function(req, res){

	//Make a folder then returns a list of folders including the new folder
	var err=null
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
	console.log("SVRL INSERT:", p, req.body.svr_id)
	try {fs.mkdirSync(path.join(p, req.body.svr_id))}
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
