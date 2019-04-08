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

const path = require("path")
const fs = require("fs")
const fileUpload = require('express-fileupload')
const fsp = require(path.join(__dirname,"fs+"))
const sizeOf = require('image-size');
const validate = require(path.join(__dirname,"validator"))
const casdocs=require(path.join(__dirname,"casdocs"))
const fsx = require("fs-extra")
const select = require(path.join(__dirname,"select"))
const change = require(path.join(__dirname,"change"))


const filemover=function(files, dest, req, res){
	//this recursive filemover required because file.mv(dest, callback) is synchronous
	//files - array of files eg. from req.files, which was prepared by express middleware
	//path - destination path eg. "uploads/prj-001/reports/site reviews/svr-001"
	//callback - function to call back after all files moved eg. res.json(...)
	console.log("filemover:",files.length);
	if (files.length>0){
		var key=files.shift()
		var file=req.files[key]
		file.mv(path.join(dest, file.name), function(){
			filemover(files, dest, req, res)
		})
	}
	//no more files so execute callback
	else if (typeof res != "undefined") {res.json({dirs:[], err:null})}
}


exports.files=function(req, res){
	if (!req.files) {
		var err="UPLOAD files not found"
		console.log(err)
		res.json({dirs:[], err:err}) 
		return
	}
	try {
		console.log("UPLOAD try...")
		var home=path.join(
			global.appRoot,
			req.body.uploads_dir, 
			req.body.pronum, 
			req.body.branch,
			req.body.docnum
		)		
		filemover(Object.keys(req.files), home, req, res) 
	}
	catch(err) {		
		res.json({dirs:[], err:err})
		console.log("UPLOAD catch:", err)
	}	
}

