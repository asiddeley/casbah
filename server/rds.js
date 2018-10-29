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
////////////////////////////////////////////////////
// rds - Room Deficiency Sheets 

const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"fs+"))
const sizeOf = require('image-size')
const casdocs = require(path.join(__dirname,"casdocs"))

//previously  rdss_insert
exports.create=function(req, res){

	// Makes a new dir for rds then returns a list of folders including the new folder
	var p
	
	// Ensure rds parent directory exists...		
	try { 		
		p=path.join(global.appRoot, global.casite, req.body.pronum, casdocs.rds.base)
		if (!fs.statSync(p).isDirectory()){fs.mkdirSync(p)}
	} 
	catch(err){if (err.code="ENOENT"){fs.mkdirSync(p)}}
	// Make new dir...
	try {
		console.log("RDS CREATE try:", p, req.body.insert)
		
		fs.mkdirSync(path.join(p, req.body.insert))
		//result {dirs:[{dir:"name"}, {dir:"name"}...]}
		res.json({
			dirs:fsp.getDirsSync(p).map(i => {return {dir:i}}),
			//project_id:req.body.project_id
			pronum:req.body.pronum
		});
	}
	catch(err) {
		console.log("RDS CRAETE catch:", err);
		res.json({
			folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
			err:err,
			//project_id:req.body.project_id
			pronum:req.body.pronum
		})
	} 
}

exports.ledger=function(req, res){
	
	//returns all rds
	var p=path.join(
		global.appRoot, 
		req.body.uploads_dir,
		req.body.pronum,
		req.body.branch
	)	

	//empty result
	var r={
		dirs:[{dir:"", jsonfile:"", jsontext:""}], 
		//json:rdss_json,
		json:casdocs.rds.json,
		//project_id:req.body.project_id
		pronum:req.body.pronum		
	} 
	console.log("RDS SELECT...", p);
	fs.stat(p, function(err, stat){
		if (!err){
			var rar=fsp.dirSync_json(p, casdocs.rds.json, casdocs.rds.jsoc)
			//convert jsontext to object in result
			for (var i in rar){
				try{rar[i]=Object.assign(rar[i], JSON.parse(rar[i].jsontext))}
				catch(err){rar[i].err=err}
			}
			//include dirs field... {dirs:rar, defrow:{}}
			r.dirs=rar
			res.json(r)
			console.log("RDS SELECT success...")
		} 
		else {res.json(r); console.log("RDS SELECT error...", err.code)}
	})
}

exports.upload=function(req, res){
	
	if (!req.files) {
		var err="RDS UPLOAD files not found."
		console.log(err)
		res.json({dirs:[], err:err}) 
		return
	}
	try {
		console.log("RDS UPLOAD try...")
		var home=path.join(global.appRoot, 
			req.body.casite, 
			req.body.pronum, 
			casdocs.rds.base, 
			req.body.docnum
		)	
		filemover(Object.keys(req.files), home, req, res) 
	}
	catch(err) {		
		res.json({dirs:[], err:err})
		console.log("RDS UPLOAD catch...",err)
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
		console.log("RDS IMAGES try...", pp)
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
		console.log("RDS IMAGES catch...", err)
	}
}
