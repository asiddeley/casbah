/**********************************
CASBAH * Contract Admin System Be Architectural Heroes *
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License

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
////////////////////////////////////////////////////
// rds - Room Deficiency Sheets 

const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"fs+"))
const casdocs = require(path.join(__dirname,"casdocs"))
const validate = require(path.join(__dirname,"validator"))
const sizeOf = require('image-size');

const frameType=function(image){
	var dims=sizeOf(image) 
	var ratio=dims.height/dims.width
	if (ratio >= 1) {return "portrait"}
	else if (ratio >= 0.5) {return "landscape"}
	else {return "wide"}
}

exports.foldersFiles=function(req, res){
	// responds with current site visit report info
	var casdok, ret={}, p, folders, root
	try {
		casdok=req.body.casdok
		console.log("SELECT foldersFiles...", casdok)

		// default return result
		ret={
			//svrs:[{docnum:"", jsonfile:"", jsontext:""}],
			folders:[{name:"", jsonfile:"", jsontext:""}],
			files:[],
			jsoc:{},
			branch:casdocs[casdok].base,
			err:null
		}		
		p=path.join(
			global.appRoot, 		
			req.body.casite,
			validate.pronum(req),
			validate.branch(req, casdocs[casdok].base)
		)
		root=path.join(req.body.casite, req.body.pronum, req.body.branch)
 		
		//check if path exists otherwise catch error
		fs.statSync (p)
		
		
		ret.files=fs.readdirSync(p).filter(function (file) {
			return fs.statSync(path.join(p,file)).isFile()
		})
		
		//jsonify file if it's the applicable json datafile for the casdoc
		ret.files.map(function(f){
			if (f == casdocs[casdok].json){
				ret.jsoc=JSON.parse(fs.readFileSync(path.join(p,f),"UTF-8"))
			}
		})
		
		/* Get list of directories and corresponding jsonfile. Since fourth argument is supplied, only information for than directory will be returned, not all 
		folders = fsp.dirSync_json(p, svr_jsonfile, svr_defrow, req.body.svr_id)
		folders = [{dir:"name", files:[], jsonfile:"name", jsontext:"{field:value, }"}, ...]
		*/		
		folders=fsp.dirSync_json({
			dir:p,
			json:casdocs[casdok].json,
			jsoc:casdocs[casdok].jsoc,
			subdir:validate.docnum(req), 
			filext:".jpg .png"
		})
	
		
		// get from each result, jsontext, parse it to an object then merge it into each result
		folders=fsp.jsonify(folders)
		
		// add to each result, svr_id property with it's value being the directory
		ret.folders=fsp.dirasid(folders, "docnum")

		/* Add image information to xdata - new files only
		folders = [{dir:"name", files:[], svr_id:"name", xdata:{...}, ...}, ...]
		xdata = {image:{frametype:"portrait", path:"...", caption:"title", date:""}, ...}*/
		ret.folders.map(function(svr){
			svr.files.map(function(f){
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
		res.json(ret)
		//console.log("SVR success:", rr)
	}
	catch(err){
		ret.err=err
		res.json(ret)
		console.log("explorer SELECT catch:", ret)
	}
}

exports.images=function(req, res){
	/****
	Returns a list of files in path matching extension. NOT RECURSIVE
	Prerequisites
	//req.body.pronum
	//req.body.filext = ".jpg .pgn .bmp"
	//req.body.docnum
	*/
	try {
		//part path...
		var pp=path.join(req.body.casite, req.body.pronum, casdocs.rds.base, req.body.docnum)
		console.log("SELECT IMAGES try...", pp)
		//var files=fsp.walkSync(path.join( //recursive and includes full path
		//returns current folder only and just filenames without path
		var files=fsp.getFilesSync(path.join (global.appRoot, pp)); 
		var images=[];
		var extarg=(typeof req.body.extension == "undefined")?".PNG .JPG":req.body.filext
		var ext;
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			ext=path.extname(files[i]).toUpperCase()
			if (extarg.toUpperCase().indexOf(ext)!=-1){images.push(path.join(pp, files[i]))}
		}
		res.json({images:images, project_id:req.body.pronum,})
	} 
	catch(err) {
		res.json({images:[], err:err, project_id:req.body.pronum})
		console.log("SELECT IMAGES catch...", err)
	}
}

//////////////
// Simpler approach for new casbah.Query

exports.dff=function(req, res){
	// default return result
	var ret={data:{}, files:[], folders:[], root:"", err:null};	
	
	try {
		console.log("SELECT FFData...")
		var casdok=req.body.casdok||null;
		var p=path.join(global.appRoot, req.body.casite, req.body.branch)
		ret.root=path.join(req.body.casite, req.body.pronum)
 		
		//check if path exists otherwise catch error
		fs.statSync (p)
		
		var ff=fs.readdirSync(p);
		
		//FILES
		ret.files=ff.filter(function (file) {
			return fs.statSync(path.join(p, file)).isFile()
		})
		
		//FOLDEERS
		ret.folders=ff.filter(function (file) {
			return fs.statSync(path.join(p, file)).isDirectory()
		})
		
		//DATA - jsonify file if it's the applicable json datafile for the casdoc
		if (casdok){
			ret.files.map(function(f){
				if (f == casdocs[casdok].json){
					ret.data=JSON.parse(fs.readFileSync(path.join(p,f),"UTF-8"))
				}
			})
		}
		res.json(ret)
	} 
	catch(err) {
		ret.err=err
		res.json(ret)
		console.log("SELECT catch:", ret)
	}
}
