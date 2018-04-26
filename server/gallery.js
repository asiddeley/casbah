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

exports.handler=function (req, res) {

	const gallery_root=path.join(global.appRoot,"uploads", req.body.project_number, "gallery")

	switch (body.req.command){
		
	case "UPLOAD":
		//UPLOAD images to collection	
		if (!req.files){break;}
		console.log("Upload file(s):", Object.keys(req.files))
		console.log("to folder:", req.body.collection_name)
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(gallery_root, req.body.collection_Name, file.name)
				//mv method added by app.use(fileUpload())
				file.mv(dest, function(err) {
					if (err) {console.log ("failed to move:", dest)} 
					else {console.log ("file uploaded as:", dest)}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	break;
	
	case "ADD":
		//Make new collection ie create new folder on server 
		console.log("Request to add collection to:", gallery_root)
		try {
			fs.mkdirSync(path.join(gallery_root, req.body.collection_name));
			res.json({collection_names:fsp.getDirsSync(p)})}
		catch(err) {
			console.log(err);
			res.json({collection_names:fsp.getDirsSync(p), err:err})
		} 
	break;
	
	//DIRS return list of folders
	case "LOG":
		console.log("Request for collection Log:", gallery_root)
		try {res.json({collection_names:fsp.getDirsSync(gallery_root)})} 
		catch(err) {
			console.log(err);
			res.json({collection_names:[], err:err}) 
		}
	break;
	
	case "FILES":
		//Prerequisites
		//req.body.project_number
		//req.body.collection_name
		//req.body.extension
		try {
			console.log("Request for files in:", gallery_root, req.body.collection_name)
			var files=fsp.walkSync(path.join(gallery_root, req.body.collection_name))
			var filtered_files=[]
			var ext
			//remove app root dir from each file, uploads/reports/... part of path
			for (var i=0; i<files.length; i++){
				ext=path.extname(files[i]).toUpperCase()
				//if (ext == ".PNG" || ext==".JPG"){
				if (ext == req.body.extension.toUpperCase()){	
					//files[i]=files[i].substring(global.appRoot.length)
					filtered_files.push(files[i].substring(global.appRoot.length))
				}
			}
			res.json({files:filtered_files})
		} 
		catch(err) {
			console.log(err)
			res.json({files:[], err:err}) //return empty on failure
		}
	break;
	}
}




