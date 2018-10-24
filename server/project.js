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

const path=require("path")
const fs=require("fs")
const fsp=require(path.join(__dirname,"fs+"))
const fsx=require("fs-extra")
const valid=require(path.join(__dirname,"validator"))
const casdocs=require(path.join(__dirname,"casdocs"))

//////////////////////
// EXPORTS
exports.change=function(req, res){
	var p, field, valu, stat, json
	/*
	try{
		p=path.join(
			global.appRoot, 
			req.body.uploads_dir, 
			req.body.project_id, 
			project_jsonfile
		)
		field=req.body.field
		valu=req.body.valu
		stat="OK"
		console.log("PROJECT CHANGE:", field, " VALUE TO:",valu, " IN:", p)	
		json=JSON.parse(fs.readFileSync(p))
		json[field]=valu
		fs.writeFileSync(p,JSON.stringify(json))
	}
	catch(err) {
		stat=err
		console.log("PRO CHANGE Catch:",err)
	} 
	finally {
		var result={data:[json],stat:stat}
		res.json(result);
		console.log("PRO CHANGE finally:", result)
	}
	*/
}

exports.create=function(req, res){
	
	/*
	var err=null, p
	try {
		console.log("PROJECT INSERT Try...")
		//Make a new project folder...
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id)
		//fs.mkdirSync(p)
		fsx.ensureDirSync(p)
		console.log("PROJECT INSERT Created folder:",p)
		res.json({msg:"Project created", err:err});
	}
	catch(e) {	
		err=e
		res.json({err:err});
		console.log("PROJECT INSERT CATCH:",err)	
	} 
	*/
}

exports.idlist=function(req, res){
	//Returns a list of project folders	
	//MOVE INTO LEDGER
	/*
	try {
		var p=path.join(global.appRoot, req.body.uploads_dir)
		console.log("PROJECT-IDLIST:", p)		
		//getDirsSync returns an array of folders.  Each is just a short name, not path
		var ids=fsp.getDirsSync(p);
		res.json({ids:ids});
	}
	catch(err) {
		console.log("PROJECTS err", err);
		res.json({ids:[]});
	}	
	*/
}

exports.ledger=function(req, res){

	//select all projects 
	var p=path.join(global.appRoot, req.body.uploads_dir);
	//empty result
	var r={
		projects:[{dir:"", jsonfile:"", jsontext:"", pronum:""}], 
		jsoc:casdocs.project.jsoc
	} 
	console.log("PRO LEDGER...");
	fs.stat(p, function(err, stat){
		if (!err){
			//if req.body.project_id is undefined then all info for all projects returned
			//var rar=fsp.dirSync_json(p, casdocs.plog.json, casdocs.plog.jsoc, valid.pronum(req.body))
			//3 arguments means return info from all project folders
			var rar=fsp.dirSync_json(p, casdocs.project.json, casdocs.project.jsoc, valid.pronum(req))
			rar=fsp.jsonify(rar)
			r.projects=fsp.dirasid(rar, "project_id")
 			res.json(r)
			console.log("PROJECT select success")
		}
		else {res.json(r); console.log("PROJECT select error:", err.code)}
	})
}


exports.remove=function(req, res){
	
	
	
	
	
}



// NEW with req.body.path instead of req.body.project_id
exports.select=function(req, res){

	//TO DO... Revised to return project status (for a single project), not a log.  Use Ledger for list of all projects
	//select all projects 
	var p=path.join(global.appRoot, req.body.uploads_dir);
	//empty result
	var r={
		projects:[{dir:"", jsonfile:"", jsontext:"", pronum:""}], 
		jsoc:casdocs.project.jsoc
	} 
	console.log("PRO SELECT...");
	fs.stat(p, function(err, stat){
		if (!err){
			//if req.body.project_id is undefined then all info for all projects returned
			//var rar=fsp.dirSync_json(p, casdocs.plog.json, casdocs.plog.jsoc, valid.pronum(req.body))
			//3 arguments means return info from all project folders
			var rar=fsp.dirSync_json(p, casdocs.project.json, casdocs.project.jsoc, valid.pronum(req))
			rar=fsp.jsonify(rar)
			r.projects=fsp.dirasid(rar, "project_id")
 			res.json(r)
			console.log("PROJECT select success")
		}
		else {res.json(r); console.log("PROJECT select error:", err.code)}
	})
}

