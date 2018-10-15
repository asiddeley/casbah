
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

exports.docnum=function(req_body){
	//checks whether req.body.docnum is intended as an ordinal number
	//and if so then converts it to the nth directory name
	
	console.log ("validator.docnum--->", req_body, "<---")
	var dd, count=0, num=Number(req_body.docnum)
	var dir=path.join(req_body.uploads_dir, req_body.pronum, req_body.branch)
	if (typeof req_body.docnum=="string" && num){
		//docnum is a string and number 
		//now check whether docnum is intended to be an ordinal ie. a number and not found in dir
		try{
			fs.statSync(path.join(dir, req_body.docnum)).isDirectory()
		}
		catch(e) {
			dd=fs.readdirSync(dir).filter(function (file) {
				count+=1;
				return (fs.statSync(path.join(dir,file)).isDirectory() && (count==num))
			})
			//convert docnum from ordinal to nth directory name
			if (dd.length>0) {req_body.docnum=dd[0]}
		}
	}
	// console.log ("validator.docnum result --->", req_body.docnum)
	return req_body.docnum
}

exports.pronum=function(req_body){
	return req_body.pronum	
}






