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

//////////////////////////
// svr = site visit report
// Server side

// import node libraries
const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"fs+"))
const sizeOf = require('image-size');

// common functions
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

const filemover=function(files, dest, req, res){
	//this recursive filemover required because file.mv(dest, callback) is synchronous
	//files - array of files eg. from req.files, which was prepared by express middleware
	//path - destination path eg. "uploads/prj-001/reports/site reviews/svr-001"
	//callback - function to call back after all files moved eg. res.json(...)
	console.log("filemover:",files.length);
	if (files.length>0){
		var key=files.shift()
		var file=req.files[key]
		file.mv(path.join(dest, file.name), function(){
			filemover(files, dest, req, res)
		})
	}
	//no more files so execute callback
	else if (typeof res != "undefined") {res.json({dirs:[], err:null})}
}



//const svr_dir="site reviews"
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

exports.change=function(req, res){
	var p, field, valu, stat, json

	try{
		p=path.join(
			global.appRoot, 
			//req.body.uploads_dir, 
			//req.body.project_id, 
			//reports_dir, 
			//svr_dir, 
			//req.body.svr_id, 
			req.body.branch,
			svr_jsonfile )
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
		console.log("SVR CHANGE Catch:",err)
	} 
	finally {
		var result={data:[json],stat:stat}
		res.json(result);
		console.log("SVR CHANGE finally:", result)
	}
}

//FORMERLY svrl_insert
exports.create=function(req, res){

	var err, p
	p=path.join(global.appRoot, req.body.uploads_dir, req.body.branch)
	
	//ensure reports_dir exists...
	//try {		
		//p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir)
		//if (!fs.statSync(p).isDirectory()){fs.mkdirSync(p)}
	//} 
	//catch(err){if (err.code="ENOENT"){fs.mkdirSync(p)}}
	
	//ensure site_reviews dir exists...
	//try {		
	//	p=path.join(p, svr_dir)
	//	if (!fs.statSync(p).isDirectory()){fs.mkdirSync(p)}
	//} 
	//catch(err){if (err.code="ENOENT"){fs.mkdirSync(p)}}
	
	//Make a folder then returns a list of folders including the new folder...
	try {		
		err=null
		console.log("SVR CREATE try:", path.join(p, req.body.svr_id))
		fs.mkdirSync(path.join(p, req.body.svr_id))
	}
	catch(e) {
		console.log("SVR CREATE catch:",e)
		console.log(e);
	} 
	finally {
		//return {svrs:[{svrs_id:"name"}, {dir:"name"}...]}
		var svrs=fsp.jsonify(fsp.dirSync_json(p, svr_jsonfile, svr_json))
		var r={
			err:err,
			svrs:fsp.dirasid(svrs, "svr_id"),
			project_id:req.body.project_id
		}
		res.json(r);
		console.log("SVR CREATE finally:",r)
	}
}

exports.select=function(req, res){
	//returns all site reviews
	var p, root, rr

	try {
		//p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.projid, req.body.branch)
		
		console.log("SVR SELECT try...", p);	
		//root=path.join(req.body.uploads_dir, req.body.project_id, reports_dir, svr_dir)
		rr={
			svrs:[{svr_id:"", jsonfile:"", jsontext:""}],
			//project_id:req.body.project_id,
			//root:"place-holder/for/root/of/path",
			branch:"placeholer",
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
		
		// get from each result, jsontext, parse it to an object then merge it into each result
		svrs=fsp.jsonify(svrs)
		
		// add to each result, svr_id property with it's value being the directory
		rr.svrs=fsp.dirasid(svrs, "svr_id")

		// Add image information to xdata - new files only
		// svrs = [{dir:"name", files:[], svr_id:"name", xdata:{...}, ...}, ...]
		// xdata = {image:{frametype:"portrait", path:"...", caption:"title", date:""}, ...}
		rr.svrs.map(function(svr){
			svr.files.map(function(f){
				// f!="uploads/project_dir/reports/site visit/FRR-001/image1__caption1__caption2.jpg"
				// f="image1__caption1__caption2.jpg"
				// key=image1

				var key, captions, p=path.join(root, svr.dir, f)

				if (f.indexOf("__")!=-1){
					//break filename into key and array of captions
					//filename="key__caption1__caption2__caption3.ext"
					key=f.substring(0, f.indexOf("__"))
					captions=f.substring(f.indexOf("__")+2, f.lastIndexOf(".")).split("__")
				} else {
					//short filename so make caption same as key
					key=f.substring(0, f.lastIndexOf("."))
					captions=f.substring(0, f.lastIndexOf("."))
				}
				console.log("f:",f, " key:",key)
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
		//console.log("SVR success:", rr)
	}
	catch(err){
		rr.err=err
		res.json(rr)
		console.log("SVR SELECT catch:", rr)
	}
}


exports.upload=function(req, res){
	
	if (!req.files) {
		var err="SVR-UPLOAD files not found"
		console.log(err)
		res.json({dirs:[], err:err}) 
		return
	}
	try {
		console.log("SVR-UPLOAD try...")
		var home=path.join(
			global.appRoot, 
			req.body.uploads_dir, 
			req.body.project_id, 
			reports_dir, 
			svr_dir,
			req.body.svr_id
		)		
		filemover(Object.keys(req.files), home, req, res) 
	}
	catch(err) {		
		res.json({dirs:[], err:err})
		console.log("SVR-UPLOAD catch:", err)
	}	
}
