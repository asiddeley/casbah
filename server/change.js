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
const validate = require(path.join(__dirname,"validator"))
const casdocs=require(path.join(__dirname,"casdocs"))
const fsx = require("fs-extra")



exports.jsonKeyValue=function(req, res){
	var p, json, stat
	
	try{
		req.body.branch=casdocs[req.body.casdok].base //NEW!
		p=path.join(
			global.appRoot, 
			req.body.casite, 
			validate.pronum(req),
			req.body.branch,
			validate.docnum(req),
			casdocs[req.body.casdok].json )
		console.log("CHANGE:", req.body.field, " VALUE TO:", req.body.valu, " IN:", p)	
		json=JSON.parse(fs.readFileSync(p))
		json[req.body.field]=req.body.valu
		fs.writeFileSync(p,JSON.stringify(json))
		stat="OK"
	}
	catch(err) {stat=err; console.log("SVR CHANGE Catch:", err)} 
	finally { 
		res.json({data:[json], stat:stat}); 
		console.log("SVR CHANGE finally:", {data:[json], stat:stat} )
	}
}
