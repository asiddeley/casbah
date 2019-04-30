/*******************************************************
CASBAH 
Contract Admin System Be Architectural Heroes
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

////////////////////////////////
// casdocs are CASbah DOCuments

function extend(obj, src) {
	Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
	return obj;
}

///////////////////
// Common

var project={
	name:"Project",
	base:"",
	clue:"/PRJ-",
	desc:"Project folder",
	html:"client/project.html",
	icon:"client/project.png",
	jscr:"client/project.js",
	json:"__projectData.json",
	jsoc:{
		project_id:"PRO-001",			
		project_name:"The Casbah Building",
		address:"101 Desert Way, The Ville, RTC-RTC",
		owner:"Owner",
		contractor:"CasbahCon",
		permit:"16 xxxxxx BLD 00 BA",
		date:"2018-May-10", 
		date_closed:"none",
		status:"status",
		xdata:"none"
	},
	seed:"PRJ-###"
}
 
//////////////////////
// Exports

exports.folder={
	name:"Folder",
	base:"",
	clue:"",
	desc:"Generic folder",
	html:"client/folder.html",
	icon:"client/folder.png",
	jscr:"client/folder.js",
	json:"__folder.json"
}

// project & prolog.  Prolog is same data structure and branch as project, but it's another view 
exports.project=project
exports.projects=extend(project, {
	name:"Projects",
	desc:"Project folder log",
	html:"client/prolog.html",
})

exports.rds={
	name:"room deficiency sheets",
	//default base or location in filesystem under uploads/project_id
	base:"reports/deficinecy sheets",
	clue:"/RDS-",		
	desc:"A collection of room sheets with checklists, one per dropped image (i.e. room plan)", 
	html:"client/rds.html",
	icon:"client/rds.png",
	jscr:"client/rds.js",
	json:"__rdss.json",
	//json file contents
	jsoc:{
		project_id:"!req.body.project_id",			
		rdss_id:"!req.body.rdss_id",
		rdss_title:"untittled",
		date:"2018-May-10",
		date_issued:"none",
		author:"localStorage.getItem('user')",	
		checklist:"[]",
		xdata:"none"
	},	
	seed:"RDS-A##"
}

exports.svr={
	name:"site visit report",
	base:"reports/site reviews",
	clue:"/SVR-",		
	desc:"A document with a project_block, doc_block, editable notes and an image drop", 
	html:"client/svr.html",
	icon:"client/svr.png",
	jscr:"client/svr.js",
	json:"__svrData.json",
	jsoc:{
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
	},
	seed:"SVR-A##"
}

exports.welcome={
	name:"welcome",
	base:"",
	clue:"",		
	desc:"Welcome splash page", 
	html:"client/welcome.html",
	icon:"",
	jscr:"",
	json:"",
	seed:""
}
