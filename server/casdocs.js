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

//////////////////////
// Exports
// casdocs are CASbah DOCuments
 
exports.folder={
	name:"folder",
	base:"",
	clue:null,
	desc:"A indexed holder of casdoc folders or regular folders",
	html:"client/folder.html",
	icon:"client/folder.png",
	jscr:"client/folder.js",
	json:"__folder.json"
}

exports.rdss={
	name:"room deficiency sheets",
	//default base or location in filesystem under uploads/project_id
	base:"reports/deficinecy sheets",
	clue:"/RDSS-",		
	desc:"A collection of room sheets with checklists, one per dropped image (i.e. room plan)", 
	html:"client/rdss.html",
	icon:"client/rdss.png",
	jscr:"client/rdss.js",
	json:"__rdss.json",
	seed:"RDSS-##"
}

exports.svr={
	name:"site visit report",
	base:"reports/site reviews",
	clue:"/SVR-A",		
	desc:"A document with a project_block, doc_block, editable notes and an image drop", 
	html:"client/svr.html",
	icon:"client/svr.png",
	jscr:"client/svr.js",
	json:"__svrData.json",
	seed:"SVR-A##"
}


