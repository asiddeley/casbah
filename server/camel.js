/*******************************************************
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

/////////////////////////////////////////////////
// camel = contract admin many exploratory llamas
// Server side

//required node modules
const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"fs+"))
const fsx = require("fs-extra")
const casdocs = require(path.join(__dirname,"casdocs"))

/*
casdocs.svr={
	name:"site visit report",
	clue:"/SVR-",		
	desc:"A document with a project_block, doc_block, editable notes and an image drop", 
	html:"client/svr.html",
	icon:"client/svr.png",
	jscr:"client/svr.js",
	json:"__svrData.json",
	path:"reports/site reviews"
}
*/

// analyses the folder for the applicable casdoc, finding put in r
const casdoc_check=function(r){
	
	// check if folder has a casdoc json files
	r.files.forEach(function(f){
		for (var k in casdocs){
			if (casdocs[k].json==f){
				//put result in r
				r.casdoc=casdocs[k]
				//done
				return
			}
		}
	})
	
	// check for clue in the branch
	// branch="reports/site visit reviews/SVR-A01"
	// FYI, path=uploads_dir + project_id + branch
	for (var k in casdocs){
		casdocs[k].clue.split(",").forEach(function(clue){
			if (branch.indexOf(casdocs[k].clue)i!=-1){
				//clue found, put result in r
				r.casdoc=casdocs[k]
				//done
				return
			}			
		})
	}
	
	// default
	r.casdoc=casdocs.folder
}

//////////////////////
// EXPORTS

exports.view=function(req, res){
	
	// check arguments...
	//if (typeof req.body.branch == "undefined"){req.body.branch=null}
	//if (typeof req.body.casdoc == "undefined"){req.body.casdoc=null}
	//if (typeof req.body.docuid == "undefined"){req.body.docuid=null}
	//if (typeof req.body.path == "undefined"){req.body.path=null}
	//if (typeof req.body.projid == "undefined"){req.body.projid=null}
	
	// determine server path p from whatever arguments are provided
	var p=null
	if (req.body.path){p=path.join(req.body.uploads_dir, req.body.path)}
	else if (!req.body.projid){p=req.body.uploads_dir}
	else if (req.body.branch){p=path.join(req.body.uploads_dir, req.body.projid, req.body.branch)}	
	else if (req.body.casdoc){ //this casdoc is actually casdoc name
		for (var c in casdocs){
			if (casdocs[c].name==req.body.casdoc){ //eg. "site report" == "site report"
				req.body.branch=casdocs[c].base //eg. "reports/site reports"
				p=path.join(req.body.uploads_dir, req.body.projid, req.body.branch)
			}
		}
		if (!p){p=req.body.uploads_dir}
	}

	// init the return object
	var r={branch:req.body.branch, folders:[], files:[], err:null, casdoc:{}}
	
	try{
		console.log("FOLDER SELECT try...", p)
		r.folders=fsp.getDirsSync(p) 
		r.files=fsp.getFilesSync(p)
		casdoc_check(r)
 		res.json(r)
	}
	catch(e){
		r.err=e
		res.json(r); 
		console.log("FOLDER SELECT catch..", e)
	}
}
