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

/* casdocs 
{...
	svr:{
		name:"site visit report",
		clue:"/SVR-",		
		desc:"A document with a project_block, doc_block, editable notes and an image drop", 
		html:"client/svr.html",
		icon:"client/svr.png",
		jscr:"client/svr.js",
		json:"__svrData.json",
		path:"reports/site reviews"
	}
}
*/

// analyse the folder for the applicable casdoc, update r with result
const casdoc_check=function(r){
	console.log("casdoc_check:",r)

	// casdoc provided by client is valid
	if (Object.keys(casdocs).indexOf(r.casdok) != -1){
		//swap key for actual casdoc object
		r.casdoc=casdocs[r.casdok]
		return
	}

	// check if folder has a casdoc json files
	r.files.forEach(function(f){
		for (var k in casdocs){
			//console.log("camel checking ",f,"==",k)
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
			if (r.branch.indexOf(casdocs[k].clue)!=-1){
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
	if (typeof req.body.branch == "undefined"){req.body.branch=null}
	if (typeof req.body.casdok == "undefined"){req.body.casdok=null} //req'd
	if (typeof req.body.docuid == "undefined"){req.body.docuid=null}
	if (typeof req.body.path   == "undefined"){req.body.path=null}
	if (typeof req.body.projid == "undefined"){req.body.projid=null} //req'd
	
	// determine server path p from whatever arguments are provided
	var p=null
	if (req.body.path){p=path.join(req.body.uploads_dir, req.body.path)}
	else if (!req.body.projid){p=req.body.uploads_dir}
	else if (req.body.branch){p=path.join(req.body.uploads_dir, req.body.projid, req.body.branch)}	
	else if (req.body.casdok){ 
		for (var k in casdocs){
			if (k==req.body.casdok){ //casdoc key, "svr" for "site report"
				req.body.branch=casdocs[k].base //eg. "reports/site reports"
				p=path.join(req.body.uploads_dir, req.body.projid, req.body.branch)
			}
		}
		if (!p){p=req.body.uploads_dir}
	}

	// init the return object
	var r={
		branch:req.body.branch, 
		folders:[], 
		files:[], 
		err:null, 
		casdoc:{},
		casdok:req.body.casdok
	}
	
	try{
		console.log("CAMEL VIEW try...", p)
		r.folders=fsp.getDirsSync(p) 
		r.files=fsp.getFilesSync(p)
		casdoc_check(r)
 		res.json(r)
	}
	catch(e){
		console.log("CAMEL VIEW catch...", e)
		r.err=e
		res.json(r); 
	}
}
