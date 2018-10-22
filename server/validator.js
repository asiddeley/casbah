
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
const fs = require('fs');
const path = require('path');

exports.casite=function(req){
	console.log ("validate site:", req.body.uploads_dir)
	req.body.casite=req.body.uploads_dir
	return req.body.uploads_dir	
}

exports.pronum=function(req){
	console.log ("validate pronum:", req.body.pronum)
	return req.body.pronum	
}

exports.branch=function(req){
	console.log ("validate branch:", req.body.branch)
	return req.body.branch	
}

exports.docnum=function(req){
	//checks whether req.body.docnum is intended as an ordinal number
	//and if so then converts it to the nth directory name
	
	console.log ("validate docnum:", req.body.docnum)
	var dd, count=0, num=Number(req.body.docnum)
	var dir=path.join(req.body.uploads_dir, req.body.pronum, req.body.branch)
	if (typeof req.body.docnum=="string" && num){
		//docnum is a string and number 
		//now check whether docnum is intended to be an ordinal ie. a number and not found in dir
		try{
			fs.statSync(path.join(dir, req.body.docnum)).isDirectory()
		}
		catch(e) {
			dd=fs.readdirSync(dir).filter(function (file) {
				count+=1;
				return (fs.statSync(path.join(dir,file)).isDirectory() && (count==num))
			})
			//convert docnum from ordinal to nth directory name
			if (dd.length>0) {req.body.docnum=dd[0]}
		}
	}
	console.log ("--->", req.body.docnum)
	return req.body.docnum
}








