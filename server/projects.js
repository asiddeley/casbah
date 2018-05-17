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

//const projects_dir="projects"
const project_datafile="__projects.json"
const project_defrow={
	project_id:"(localStorage.getItem('project_id') || 'PROJ-001')",			
	projrct_name:"The Casbah Building",
	address:"101 Desert Way, The Ville, RTC-RTC",
	client:"Client", 
	contractor:"CasbahCon",
	permit:"16 xxxxxx BLD 00 BA",
	date:"2018-May-10", //Date(),
	date_closed:"none",
	status:"status",
	xdata:"none"
}

exports.handler=function(req, res){
	//returns all site reviews
	var p=path.join(global.appRoot, req.body.uploads_dir);
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}]} //empty result
	console.log("PROJECTS handler:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			r=fsp.dirSync_json(p, projects_datafile, projects_defrow)
			//returns {dirs[{dir:"name", jsontext:"{...}", jsonfile:"filename"},...]}
			r.defrow=project_defrow //send back in case it's needed by client
			console.log("PROJECTS success:", r)
			res.json(r)
		} else if (err.code=="ENOENT") {
			//folder doesn't exist so create
			mkdirSync(p)		
			console.log("PROJECTS (UPLOAD) folder created:")	
			res.json(r)				
		} else {
			console.log("PROJECTS error:", err.code)	
			res.json(r)				
		}
	})
}


