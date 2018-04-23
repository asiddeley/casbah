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
const fileUpload = require('express-fileupload')


exports.gallery_collection_images=function (req, res) {

	var gccname=req.body.gallery_collection_name
	var pnum=req.body.project_num
	const p=path.join(global.appRoot,"uploads", pnum, "gallery", gccname)
 
	try {
		console.log("request for images in:", gccname)
		var files=fsp.walkSync(p)
		var images=[]
		var ext
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			ext=path.extname(files[i]).toUpperCase()
			if (ext == ".PNG" || ext==".JPG"){
				//files[i]=files[i].substring(global.appRoot.length)
				images.push(files[i].substring(global.appRoot.length))
			}
		}
		//res.json({files:files})
		res.json({images:images})
	} 
	catch(err) {console.log(err)}
}

exports.gallery_collection_log=function (req, res) {
	//what about project?
	var name=req.body.photo_album_name
	var pnum=req.body.project_num
	
	const p=path.join(global.appRoot,"uploads", pnum, "gallery", )
	//UPLOAD
	if (req.files){
		console.log("Upload file(s):", Object.keys(req.files))
		console.log("to folder:", req.body.deficiencySheetsName)
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(p, req.body.deficiencySheetsName, file.name)
				//mv method added by app.use(fileUpload())
				file.mv(dest, function(err) {
					if (err) {
						console.log ("failed to move:", dest)
						//return res.status(500).send(err)
						//res.json({status:"failed to upload:"+file.name})
					} 
					else {
						//res.send('File uploaded!')
						console.log ("file uploaded as:", dest)
						//res.json({status:"Success uploading:"+file.name})
					}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	} 
	//ADD sheetset ie create new folder on server 
	else if (req.body.action == "ADD"){
		console.log("Request to add album to:", p)
		try {
			fs.mkdirSync(path.join(p, req.body.new_photo_album_name));
			res.json({dirs:fsp.getDirsSync(p)})}
		catch(err) {console.log(err);res.json({dirs:fsp.getDirsSync(p), err:err}) } 
	}
	//DIRS return list of sheetsets or folders
	else if (req.body.action == "DIRS"){
		console.log("Request for Sheetsets Log:", p)
		try {res.json({dirs:fsp.getDirsSync(p)})} 
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }
	}
}




