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

const fsp = require(__dirname+"\\fs+");


exports.deficiencySheets=function (req, res) {
	console.log("deficiency Sheets:", req.body.path)
	//console.log("__dirname:", __dirname, __dirname.length)
	const pth=req.body.path;
	const cdir=__dirname.substring(0,__dirname.lastIndexOf("\\")); 
 
	try {
		var files=fsp.walkSync(cdir+pth);
		//console.log("files:", files)
		var f=[];
		//remove __dirname from each, leaving just path
		for (var i=0; i<files.length; i++){
			//console.log("file:", files[i])
			//console.log("shortened:", files[i].substring(__dirname.length))
			files[i]=files[i].substring(cdir.length);
			//console.log ("shortened files:",f)
		}
		res.json({files:files});
	} 
	catch(err) {console.log(err); }
}