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


// analyse the folder for the applicable casdoc, update r with result
const casdoc_check=function(r){
	console.log("casdoc_check:",r)

	// casdoc provided by client is valid
	if (Object.keys(casdocs).indexOf(r.casdok) != -1){
		//swap key for actual casdoc object
		r.casdoc=casdocs[r.casdok]
		return
	}

	// check if folder has a casdoc json files
	r.files.forEach(function(f){
		for (var k in casdocs){
			//console.log("camel checking ",f,"==",k)
			if (casdocs[k].json==f){
				//put result in r
				r.casdoc=casdocs[k]
				//done
				return
			}
		}
	})
	
	// check for clue in the branch
	// branch="reports/site visit reviews/SVR-A01"
	// FYI, path=uploads_dir + project_id + branch
	for (var k in casdocs){
		casdocs[k].clue.split(",").forEach(function(clue){
			if (r.branch.indexOf(casdocs[k].clue)!=-1){
				//clue found, put result in r
				r.casdoc=casdocs[k]
				//done
				return
			}
		})
	}
	
	// default
	//r.casdoc=casdocs.folder
	r.casdoc=casdocs.welcome
}

const df_create=function(datafile, row, callback){
	//row - {by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}
	//table - {"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}

	row["rowid"]="0"; //add rowid:value
	var table={"0":row}; 
	fs.writeFile(datafile, JSON.stringify(table), function(err){
		if (!err){ 
			console.log("DF-CREATE success"); 
			//result is an array of selected rows
			if (typeof callback=="function"){callback({rows:[row]});}
		} else { 
			console.log("DF-CREATE fail:", err); 
			//result is an array of selected rows
			if (typeof callback=="function"){
				callback({rows:[row], err:err})
			}
		}		
	});
};



const df_insert=function(df, row, callback){
	fs.readFile(df, function(err, data){
		//table is an object of rows eg...
		//{"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}
		var table=JSON.parse(data);
		var keys=Object.keys(table);
		var rowid=1+keys.reduce((acc, cur)=>Math.max(Number(acc), Number(cur)));
		row[rowid]=rowid; //inject rowid 
		table[rowid]=row;
		fs.writeFile(df, JSON.stringify(table), function(err){
			console.log("DF-INSERT success:", err);
			//result is an array of selected rows...
			//res.json({rows:[table[rowid]], err:err});	
			if (typeof callback=="function"){
				var selection=Object.values(table).filter( v => v!=null)
				callback({rows:selection, err:err, last:[row]})
			}
		})
	})
}

const df_select=function(df, callback){
	fs.readFile(df, "utf8", function(err, data){
		console.log("DF-SELECT success:", err);
		//table is an object of rows eg...
		//{"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}
		console.log("DATA:", data)
		var table=JSON.parse(data)
		//console.log("JSON parsed:", table)
		//result is an array of selected rows. All rows for now, refine selection method...
		var selection=Object.values(table).filter(v => v != null)
		if (typeof callback=="function"){callback( {rows:selection, err:err} )}					
	})
}

const df_update=function(df, rowid, row, callback){
	fs.readFile(df, function(err, data){
		//table is an object of rows eg...
		//{"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}
		var table=JSON.parse(data);
		var keys=Object.keys(table);
		row[rowid]=rowid; //inject rowid 
		table[rowid]=row;
		fs.writeFile(df, JSON.stringify(table), function(err){
			console.log("DF-UPDATE success:", err);
			//result is an array of selected rows...
			//res.json({rows:[table[rowid]], err:err});	
			if (typeof callback=="function"){
				var selection=Object.values(table).filter(v => v!=null)
				callback({rows:selection, err:err})
			}
		})
	})
}


const frameType=function(image){
	var dims=sizeOf(image) 
	var ratio=dims.height/dims.width
	if (ratio >= 1) {return "portrait"}
	else if (ratio >= 0.5) {return "landscape"}
	else {return "wide"}
}

const filedate=function(image){
	var d="2018-Feb-31"
	try{
		//eg. Thu Jun 14 2018
		//d=fs.statSync(image).birthtime.toDateString()
		
		//eg. 2018-06-14
		d=fs.statSync(image).ctime.toISOString().substring(0,10)

		//console.log("FILEDATE:", d)
	}	
	catch(err){console.log("filedate ", err)}
	return d
}

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

//////////////////////////
// actions

const create=function(req, res){
	var err, p, folders, ret, json, jsoc
	try {		
		err=null
		json=casdocs[req.body.casdok].json
		jsoc=casdocs[req.body.casdok].jsoc
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.branch)
		console.log("explorer CREATE try:", path.join(p, req.body.docnum))
		fs.mkdirSync(path.join(p, req.body.docnum))
	}
	catch(e) {
		console.log("explorer CREATE catch:",e)
		console.log(e);
	} 
	finally {
		//return {svrs:[{svrs_id:"name"}, {dir:"name"}...]}
		folders=fsp.jsonify(fsp.dirSync_json(p, json, jsoc))
		ret={
			err:err,
			svrs:fsp.dirasid(svrs, "svr_id"),
			project_id:req.body.project_id
		}
		console.log("explorer CREATE finally:",r)
		res.json(ret);

	}
}


const select=function(req, res){
	// responds with current site visit report info
	var casdok, ret={}, p, folders, root
	try {
		casdok=req.body.casdok
		console.log("explorer SELECT try...", casdok)

		// default return result
		ret={
			//svrs:[{docnum:"", jsonfile:"", jsontext:""}],
			folders:[{name:"", jsonfile:"", jsontext:""}],
			files:[],
			jsoc:{},
			branch:casdocs[casdok].base,
			err:null
		}		
		p=path.join(
			global.appRoot, 		
			req.body.casite,
			validate.pronum(req),
			validate.branch(req, casdocs[casdok].base)
		)
		root=path.join(req.body.casite, req.body.pronum, req.body.branch)
 		
		//check if path exists otherwise catch error
		fs.statSync (p)
		
		
		ret.files=fs.readdirSync(p).filter(function (file) {
			return fs.statSync(path.join(p,file)).isFile()
		})
		
		//jsonify file if it's the applicable json datafile for the casdoc
		ret.files.map(function(f){
			if (f == casdocs[casdok].json){
				ret.jsoc=JSON.parse(fs.readFileSync(path.join(p,f),"UTF-8"))
			}
		})
		
		/* Get list of directories and corresponding jsonfile. Since fourth argument is supplied, only information for than directory will be returned, not all 
		folders = fsp.dirSync_json(p, svr_jsonfile, svr_defrow, req.body.svr_id)
		folders = [{dir:"name", files:[], jsonfile:"name", jsontext:"{field:value, }"}, ...]
		*/		
		folders=fsp.dirSync_json({
			dir:p,
			json:casdocs[casdok].json,
			jsoc:casdocs[casdok].jsoc,
			subdir:validate.docnum(req), 
			filext:".jpg .png"
		})
	
		
		// get from each result, jsontext, parse it to an object then merge it into each result
		folders=fsp.jsonify(folders)
		
		// add to each result, svr_id property with it's value being the directory
		ret.folders=fsp.dirasid(folders, "docnum")

		// Add image information to xdata - new files only
		// folders = [{dir:"name", files:[], svr_id:"name", xdata:{...}, ...}, ...]
		// xdata = {image:{frametype:"portrait", path:"...", caption:"title", date:""}, ...}
		ret.folders.map(function(svr){
			svr.files.map(function(f){
				var key, captions, p=path.join(root, svr.dir, f)

				if (f.indexOf("__")!=-1){
					//break filename into key and array of captions
					//filename="key__caption1__caption2__caption3.ext"
					key=f.substring(0, f.indexOf("__"))
					captions=f.substring(f.indexOf("__")+2, f.lastIndexOf(".")).split("__")
				} else {
					//short filename so make caption same as key
					key=f.substring(0, f.lastIndexOf("."))
					captions=f.substring(0, f.lastIndexOf("."))
				}
				console.log("f:",f, " key:",key)
				if (typeof(svr.xdata[key])=="undefined" ){
					svr.xdata[key]={
						available:true,
						captions:captions,
						format:frameType(p),
						key:key,
						path:p
					}
					//set frametype as a property, better for handlebars eg. {{if this.portrait}}...
					svr.xdata[key][frameType(p)]=true
				}
			})
			//console.log ("SVR xdata:", svr.xdata)
		})	
		res.json(ret)
		//console.log("SVR success:", rr)
	}
	catch(err){
		ret.err=err
		res.json(ret)
		console.log("explorer SELECT catch:", ret)
	}
}

exports.upload=function(req, res){
	if (!req.files) {
		var err="UPLOAD files not found"
		console.log(err)
		res.json({dirs:[], err:err}) 
		return
	}
	try {
		console.log("explorer UPLOAD try...")
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
		console.log("SVR UPLOAD catch:", err)
	}	
}

const camel_view=function(req, res){
	
	// check arguments...
	if (typeof req.body.branch == "undefined"){req.body.branch=null}
	if (typeof req.body.casdok == "undefined"){req.body.casdok=null} //req'd
	if (typeof req.body.docnum == "undefined"){req.body.docnum=null}
	if (typeof req.body.path   == "undefined"){req.body.path=null}
	
	//TO DO differenciate string number that is meant to be a name rather than ordinal  
	if (typeof req.body.pronum == "undefined"){req.body.pronum=null} 
	else if (Number(req.body.pronum)){
		// change pronum from an ordinal number to the nth folder name
		req.body.pronum=fsp.getDirsSync(req.body.uploads_dir)[Number(req.body.pronum)]
	}
	
	// determine server path p from whatever arguments are provided
	var p=null
	if (req.body.path){p=path.join(req.body.uploads_dir, req.body.path)}
	else if (!req.body.pronum){p=req.body.uploads_dir}
	else if (req.body.branch){p=path.join(req.body.uploads_dir, req.body.pronum, req.body.branch)}	
	else if (req.body.casdok){ 
		for (var k in casdocs){
			if (k==req.body.casdok){ //casdoc key, "svr" for "site visit report"
				req.body.branch=casdocs[k].base //eg. "reports/site reports"
				p=path.join(req.body.uploads_dir, req.body.pronum, req.body.branch)
			}
		}
		if (!p){p=req.body.uploads_dir}
	}

	// init the return object
	var r={
		//provided
		branch:req.body.branch, 
		casdok:req.body.casdok,
		docnum:req.body.docnum,
		pronum:req.body.pronum,	
		//derived
		folders:[], 
		files:[], 
		err:null, 
		casdoc:{}
	}
	
	try {
		console.log("CAMEL VIEW try...", p)
		r.folders=fsp.getDirsSync(p) 
		r.files=fsp.getFilesSync(p)
		casdoc_check(r)
 		res.json(r)
	} catch(e){
		console.log("CAMEL VIEW catch...", e)
		r.err=e
		res.json(r); 
	}
}



////////////////////////////
// Exports

exports.handler=function (req, res) {
	/***********
	Prerequisites (to be passed in ajax data):
	req.body.action... ADD, DIR, FILES, UPLOAD, 
	req.body.project_number... 
	req.body.tab... Gallery | reports
	req.body.folder... Collection | deficiency Sheet set
	req.body.extension
	req.files... populated by middle-ware from ajaxed formData
	**********/
	
	//inject uploads, 
	// DEP
	req.body.uploads_dir=global.casite
	// NEW!
	req.body.casite=global.casite
	
	//ensure uploads_dir exists
	var up=path.join(global.appRoot, global.casite)
	try {if (!fs.statSync(up).isDirectory()){fs.mkdirSync(up)}} 
	catch(err){if (err.code="ENOENT"){fs.mkdirSync(up)}}
	
	
	switch (req.body.action){
		
		// Camel
		case "CAMEL VIEW":camel_view(req, res); break;	
	
		case "CHANGE":change(req, res); break; //needs testing
		//case "LEDGER":ledger(req, res); break; //NEW!  instead of SVRL or svr log
		case "SELECT":select(req, res); break; //needs testing
		case "UPLOAD":upload(req, res); break; //needs testing
		case "CREATE":create(req, res); break; //needs testing
	
	} 
}

