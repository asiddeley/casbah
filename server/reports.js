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

/////////////////
// Site Reviews
const site_reviews_dir="site_reviews"
const site_reviews_datafile="__datafile.json"
const site_reviews_defrow={
	project_id:"!req.body.project_id",			
	report_id:"localStorage.getItem('report_id')",
	report_title:"untittled",
	date:"2018-May-10", 
	date_issued:"none", 
	author:"localStorage.getItem('user')",			
	comment_ids:"[]", 
	issue_ids:"[]",
	photo_ids:"[]",
	xdata:"none"
}

exports.site_reviews_select=function(req, res){
	//returns all site reviews
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, site_reviews_dir);
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}], defrow:site_review_defrow} //empty result
	console.log("SITE REVIEWS select:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			var rar=fsp.dirSync_json(p, site_reviews_datafile, site_reviews_defrow)
			//convert jsontext to object in result
			for (var i in rar){
				try{rar[i]=Object.assign(rar[i], JSON.parse(rar[i].jsontext))}
				catch(err){rar[i].err=err}
			}
			//include dirs field... {dirs:rar, defrow:{}}
			r.dirs=rar
			res.json(r)
			console.log("SITE_REVIEWS success:")
		} 
		else {res.json(r); console.log("SITE_REVIEWS error:", err.code)}
	})
}

////////////////////////////////////////////////////
// rdss - Room Deficiency Sheets LOG
const rdss_dir="deficiency_sheets"
const rdss_datafile="__rdss.json"
const rdss_defrow={
	project_id:"!req.body.project_id",			
	rdss_id:"!req.body.rds_id",
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
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}], defrow:rdss_defrow} 
	console.log("RDSS select:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			var rar=fsp.dirSync_json(p, rdss_datafile, rdss_defrow)
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


////////////////////////////////////////////////////
// rds - Room Deficiency Sheets 


exports.rds_select=function(req, res){
	//Returns a list of files in path matching extension 
	//NOT RECURSIVE
	//Prerequisites
	//req.body.project_id
	//req.body.extension... ".jpg .pgn .bmp"
	try {
		var p=path.join(global.appRoot, 
			req.body.uploads_dir, 
			req.body.project_id, 
			reports_dir, 
			rdss_dir,
			req.body.deficiency_sheets
		);
		console.log("RDS-SELECT:",p)
		//var files=fsp.walkSync(path.join( //recursive and includes full path
		var files=fsp.getFilesSync(p); //current folder only and just filenames without path
		var filtered_files=[];
		var ext;
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			ext=path.extname(files[i]).toUpperCase()
			if (req.body.extension.toUpperCase().indexOf(ext)!=-1){	
				//chop of the roots
				//filtered_files.push(files[i].substring(global.appRoot.length))
				var pj=path.join(
					req.body.uploads_dir, 
					req.body.project_id, 
					reports_dir, 
					rdss_dir,
					req.body.deficiency_sheets,
					files[i]
				)
				filtered_files.push(pj)
			}
		}
		res.json({
			files:filtered_files,
			project_id:req.body.project_id,
			folder:req.body.folder
		})
	} 
	catch(err) {
		res.json({
			files:[], 
			err:err,
			project_id:req.body.project_id,
			folder:req.body.folder
		})
		console.log("RDS-SELECT error:",err)
	}
}