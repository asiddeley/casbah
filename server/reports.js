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
	project_id:"localStorage.getItem('project_id')",			
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

exports.site_reviews_handler=function(req, res){
	//returns all site reviews
	var p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id, reports_dir, site_reviews_dir);
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}]} //empty result
	console.log("SITE REVIEWS handler:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			r=fsp.dirSync_json(p, site_reviews_datafile, site_reviews_defrow)
			r.defrow=reports.site_reviews_defrow //may be needed by client
			console.log("SITE_REVIEWS success:", r)
			res.json(r)
		} else if (err.code=="ENOENT") {
			//folder doesn't exist so create
			mkdirSync(p)
			console.log("SITE_REVIEWS folder created:", err.code)	
			res.json(r)				
		} else {
			console.log("SITE_REVIEWS error:", err.code)	
			res.json(r)				
		}
	})
}


