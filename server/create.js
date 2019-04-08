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
//const fileUpload = require('express-fileupload')
const fsp = require(path.join(__dirname,"fs+"))
//const sizeOf = require('image-size');
//const validate = require(path.join(__dirname,"validator"))
const casdocs=require(path.join(__dirname,"casdocs"))
//const fsx = require("fs-extra")
//const select = require(path.join(__dirname,"select"))
//const change = require(path.join(__dirname,"change"))
//const upload = require(path.join(__dirname,"upload"))


exports.folder=function(req, res){
	var err, p, folders, ret, json, jsoc
	try {		
		err=null
		json=casdocs[req.body.casdok].json
		jsoc=casdocs[req.body.casdok].jsoc
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.branch)
		console.log("CREATE.folder try:", path.join(p, req.body.docnum))
		fs.mkdirSync(path.join(p, req.body.docnum))
	}
	catch(e) {console.log("CREATE.folder catch:",e)}
	finally {
		//return {svrs:[{svrs_id:"name"}, {dir:"name"}...]}
		folders=fsp.jsonify(fsp.dirSync_json(p, json, jsoc))
		ret={
			err:err,
			//svrs:fsp.dirasid(svrs, "svr_id"),
			//folders:fsp.dirasid(folders, "id"),
			project_id:req.body.project_id
		}
		console.log("CREATE.folder finally:",r)
		res.json(ret);
	}
}

