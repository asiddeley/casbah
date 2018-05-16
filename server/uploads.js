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
const reports=require(path.join(global.appRoot,"server","reports"))

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

const dirSync_json=function(dir, jsonfile, defrow) {
	/**
	returns a list of directories along with contents of a specified jsonfile within each of the directories
	Used for a file system type of database where the jsonfile carries data pertaining to its parents directory.
	**/
	var dd=fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir,file)).isDirectory()
	})
	//TODO - go thru d, add content of datafiles in each dir
	var  jc, jp, result, ss
	for (var i in dd){
		jp=path.join(dir, dd[i], jsonfile)
		ss=fs.statSync(jp)
		if (!ss.err){
			jc=JSON.parse(fs.readFileSync(jp,"charset=UTF-8"))
		} else if (ss.err.code=="ENOENT"){
			//create file if none exists
			jc=(defrow || {})
			fs.writeSync(jp, JSON.stringify(jc))			
		}
		jc.dir=dd[i] //inject dir:name
		result.push(jc)
	}
	//result {dirs:[{dir:"name", jsonfile:"name", jsontext:"{field:value, }" }, ...]}
	return result
}

const uploads="uploads"

////////////////////////////
//Exports

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
	
	if (typeof req.body.project_number == "undefined") {
		var err="Upload handler error: project_number undefined"
		console.log(err)
		res.json({dirs:[], err:""})
		return;
	}
	const root=path.join(global.appRoot,"uploads", req.body.project_number)

	switch (req.body.action){
		
	case "DF-DELETE":
		//deletes row named rowid from table saved as datafile 
		//datafile - {0:{rowid:0, nam:val,...}, 1:{rowid:1, nam:val,...}, ...}
		var df=path.join(global.appRoot, uploads, req.body.datafile)
		console.log("DF-DELETE:",req.body.rowid, " from:", df)
		fs.stat(df, function(err, stat){
			if (!err){
				//datafile found
				fs.readFile(df, function(err, data){
					//{"0":{field1:field1, ...}, "1":{field1:field1, ...} ...}
					var table=JSON.parse(data)
					//delete table[req.body.rowid]
					//preserve rowids!!! just null the value
					table[req.body.rowid]=null;
					fs.writeFile(df, JSON.stringify(table),	function(err){
						console.log("DBFS-DELETE success")
						//return all rows except null rows	
						res.json({rows:Object.values(table).filter(v != null), err:err})
					})
				})
			} else if (err.code=="ENOENT"){
				console.log("DF-DELETE error:", err.code)
				res.json({err:err, rows:[]})	
			} else {
				console.log("DF-DELETE some other error:", err.code)		
				res.json({err:err, rows:[]})				
			}
		})
	break;

	case "DF-CREATE":
		//creates a tables from defrow and saves it as datafile 
		//defrow - {nam:val,...}
		//datafile - {0:{rowid:0, nam:val,...}}
		var df=path.join(global.appRoot,uploads,req.body.datafile);
		console.log("DF-CREATE:", df, " defrow:", req.body.defrow)
		fs.stat(df, function(err, stat){
			if (!err){
				console.log("DF-CREATE datafile already exists")
			} else if (err.code=="ENOENT"){
				console.log("DF-CREATE OK to create datafile...")
				df_create(df, req.body.defrow, function(result){
					res.json(result)
				})
			} else {
				console.log("DF-CREATE some other error:", err.code)		
				res.json({err:err, rows:[]})				
			}
		})
	break;	

	case "DF-INSERT":
		var df=path.join(global.appRoot,uploads,req.body.datafile );
		console.log("DF-INSERT:", df, " row:", req.body.row)
		fs.stat(df, function(err, stat){
			if (!err){
				df_insert(df, req.body.row, function(result){
					//result - {rows:[all_rows], err:err, last:inserted_row}
					res.json(result)
				});
			} else if (err.code=="ENOENT"){
				//datafile not found
				df_create(df, req.body.row, function(result){
					//result - {rows:[inserted_row], err:err}
					//consider returning all rows so client can refresh in one operation 
					res.json(result)
				});
			} else {
				console.log("DF-INSERT some other error:", err.code)
				res.json({err:err, rows:[]})				
			}		
		})
	break
	
	case "DF-SELECT":
		//Selects all rows from datafile table.
		var df=path.join(global.appRoot,uploads,req.body.datafile)
		console.log("DF-SELECT:", df, " defrow(just in case datafile missing)", req.body.defrow);
		fs.stat(df, function(err, stat){
			if (!err){
				//file exists so select all
				df_select(df, function(result){res.json(result)})
			} else if (err.code=="ENOENT") {
				//datafile doesn't exist so create
				df_create(df, req.body.defrow, function(result){
					res.json(result)
				})
			} else {
				console.log("DF-SELECT some other error:", err.code)
				res.json({err:err, rows:[]})				
			}
		})
	break

	case "DF-SELECT-FIRST":
		//Selects first row from datafile table.
		var df=path.join(global.appRoot,uploads,req.body.datafile);
		console.log("DF-SELECT-FIRST:", df, " defrow", req.body.defrow);
		fs.stat(df, function(err, stat){
			if (!err){
				//file exists so select all
				df_select(df, function(result){
					//select 1st row from all rows in result
					//req.json({rows:[result.rows[0]]})
					res.json({rows:[Object.values(result.rows).shift()]})
				})
			} else if (err.code=="ENOENT") {
				//datafile doesn't exist so create
				df_create(df, req.body.defrow, function(result){
					res.json(result)
				})
			} else {
				console.log("DF-SELECT-FIRST some other error:", err.code)	
				res.json({err:err, rows:[]})				
			}
		})
	break
	
	case "DF-SELECT-LAST":
		//Selects Last row from datafile table.
		var df=path.join(global.appRoot,uploads,req.body.datafile);
		console.log("DF-SELECT-LAST:", df, " defrow(just in case datafile missing)", req.body.defrow);
		fs.stat(df, function(err, stat){
			if (!err){
				//file exists so select all
				df_select(df, function(result){
					//select last row from all rows in result
					res.json({rows:[Object.values(result.rows).pop()]})
				})
			} else if (err.code=="ENOENT") {
				//datafile doesn't exist so create
				df_create(df, req.body.defrow, function(result){
					res.json(result)
				})
			} else {
				console.log("DF-SELECT-LAST some other error:", err.code)	
				res.json({err:err, rows:[]})				
			}
		})
	break

	case "DF-UPDATE":
		var df=path.join(global.appRoot,uploads,req.body.datafile);
		console.log("DF-UPDATE:", df, " row:", req.body.row, " ROWID:", req.body.rowid)
		fs.stat(df, function(err, stat){
			if (!err){
				df_update(df, req.body.rowid, req.body.row, function(result){
					//result - {rows:[all_rows], err:err, last:inserted_row}
					res.json(result)
				});
			} else if (err.code=="ENOENT"){
				console.log("DF-UPDATE datafile not found:", err.code)
				res.json({err:err, rows:[]})
			} else {
				console.log("DF-UPDATE some other error:", err.code)
				res.json({err:err, rows:[]})				
			}
		})
	break
	
	case "MAKE":
		//Makes a folder, returns a list of folders including the new folder
		var df=path.join(root, req.body.tab, req.body.folder);
		console.log("MAKE folder:", df);
		try {
			fs.mkdirSync(df);
			res.json({
				folders:fsp.getDirsSync(path.join(df, "..")),
				project_number:req.body.project_number
			});
		}
		catch(err) {
			console.log(err);
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				err:err,
				project_number:req.body.project_number
			})
		} 
	break;
	
	case "MAKEFILE":
		//needs: 
		//reg.body.project_number
		//req.body.tab, 
		//req.body.folder
		//req.body.filename
		//req.body.content
		console.log("MAKEFILE:", path.join(
			root, 
			req.body.tab, 
			req.body.folder, 
			req.body.filename
		));
		try {
			var filepath=path.join(root, req.body.tab, req.body.folder, req.body.filename)
			fs.writeFile(filepath, filecontent, (err) => {
				if (err) throw err;
				console.log("The file was succesfully saved!");
			}); 
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder, "..")),
				project_number:req.body.project_number
			});
		}
		catch(err) {
			console.log(err);
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				err:err,
				project_number:req.body.project_number
			})
		} 
	break;
	
	case "FOLDERS":
		//reg.body.project_number
		//req.body.tab, 
		//req.body.folder
		console.log("Request for folders in:", root, req.body.tab, req.body.folder);
		try {
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				project_number:req.body.project_number
			});
		} 
		catch(err) {
			console.log(err);
			res.json({
				folders:[], 
				err:err, 
				project_number:req.body.project_number
			});
		}
	break;


	
	case "FILES":
		//Returns a list of files in path matching extension 
		//NOT RECURSIVE
		//Prerequisites
		//req.body.project_number
		//req.body.tab
		//req.body.folder
		//req.body.extension... ".jpg .pgn .bmp"
		try {
			var df=path.join(root, req.body.tab, req.body.folder);
			console.log("Request for files in:", df)
			//var files=fsp.walkSync(path.join( //recursive and includes full path
			var files=fsp.getFilesSync(df); //current folder only and just filenames without path
			var filtered_files=[];
			var ext;
			//remove app root dir from each file, uploads/reports/... part of path
			for (var i=0; i<files.length; i++){
				ext=path.extname(files[i]).toUpperCase()
				if (req.body.extension.toUpperCase().indexOf(ext)!=-1){	
					//chop of the roots
					//filtered_files.push(files[i].substring(global.appRoot.length))
					var pj=path.join(uploads, req.body.project_number, req.body.tab, req.body.folder,files[i])
					filtered_files.push(pj)
				}
			}
			res.json({
				files:filtered_files,
				project_number:req.body.project_number,
				folder:req.body.folder
			})
		} 
		catch(err) {
			console.log("FILES error:",err)
			res.json({
				files:[], 
				err:err,
				project_number:req.body.project_number,
				folder:req.body.folder
			})
		}
	break;
	
	case "PROJECT_DIRS":
		//Returns a list of project folders
		console.log("PROJECTS:", global.appRoot,uploads);
		var ro={};
		var ras=(typeof req.body.resultas =="undefined")?"dirs":req.body.resultas;
		try {
			//getDirsSync returns an array of folders.  Each is just a short name, not path
			ro[ras]=fsp.getDirsSync(path.join(global.appRoot,"uploads"));
			res.json(ro);
		} 
		catch(err) {
			console.log("PROJECTS err",err);
			ro[ras]=[]; ro[err]=err;
			res.json(ro);
		}	
	break;

	case "PROJECT_DATA":
		//Returns a list of project folders
		console.log("PROJECT DATA:", global.appRoot,uploads);
		var ro={};
		var ras=(typeof req.body.resultas =="undefined")?"data":req.body.resultas;
		try {
			//getDirsSync returns an array of folders.  Each is just a short name, not path
			//ro[ras]=fsp.getDirsSync(path.join(global.appRoot,"uploads"));
			//TODO read json file
			res.json(ro);
		} 
		catch(err) {
			console.log("PROJECTS err",err);
			ro[ras]=[]; ro[err]=err;
			res.json(ro);
		}	
	break;	
	
	case "SITE_REVIEWS":
		//returns all site reviews
		//p=path.join(global.appRoot,uploads,req.body.tab, req.body.folder);
		var p=path.join(global.appRoot, uploads, reports.dir, reports.site_reviews.dir);
		var r={dirs:[{dir:"", jsonfile:"", jsontext:""}]} //empty result
		console.log("DIR+ in:", p);
		fs.stat(p, function(err, stat){
			if (!err){
				r=dirSync_json(p, reports.site_reviews.datafile, reports.site_reviews.defrow)
				r.defrow=reports.site_reviews.defrow //may be needed by client
				console.log("SITE_REVIEWS success:", r)
				res.json(r)
			} else if (err.code=="ENOENT") {
				//folder doesn't exist so create
				mkdirSync(p)
				console.log("SITE_REVIEWS folder created:", err.code)	
				res.json(r)				
			} else {
				console.log("SITE_REVIEWS error:", err.code)	
				res.json(r)				
			}
		})
	break;	
	
	case "UPLOAD":
		if (!req.files) {console.log("Missing files for upload"); break;}
		console.log("Upload request file(s):", Object.keys(req.files))
		console.log("TO:", path.join(root, req.body.tab, req.body.folder))
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(root, req.body.tab, req.body.folder, file.name)
				console.log("DEST:",dest)
				//.mv function added by 'express-fileupload' middleware
				file.mv(dest, function(err) {
					if (err) {console.log ("Failed to move:", dest, JSON.stringify(err))} 
					else {console.log ("File uploaded as:", dest)}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	break; 	
	
	} //switch
	
}

