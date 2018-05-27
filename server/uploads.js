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
const project=require(path.join(global.appRoot,"server","projects"))
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


const uploads_dir="uploads"

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
	/***
	if (typeof req.body.project_id == "undefined") {
		var err="project_id undefined"
		console.log("UPLOAD handler error:", err)
		res.json({dirs:[], err:err})
		return;
	}
	const root=path.join(global.appRoot, uploads_dir, req.body.project_id)
	*/
	
	//inject uploads, 
	req.body.uploads_dir=uploads_dir
	
	//ensure uploads_dir exists
	var up=path.join(global.appRoot, uploads_dir)
	try {if (!fs.statSync(up).isDirectory()){fs.mkdirSync(up)}} 
	catch(err){if (err.code="ENOENT"){fs.mkdirSync(up)}}
	
	
	switch (req.body.action){
		
	case "DF-DELETE":
		//deletes row named rowid from table saved as datafile 
		//datafile - {0:{rowid:0, nam:val,...}, 1:{rowid:1, nam:val,...}, ...}
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile)
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile);
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile );
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile)
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile);
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile);
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
		var df=path.join(global.appRoot, uploads_dir, req.body.datafile);
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
				project_id:req.body.project_id
			});
		}
		catch(err) {
			console.log(err);
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				err:err,
				project_id:req.body.project_id
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
				project_id:req.body.project_id
			});
		}
		catch(err) {
			console.log(err);
			res.json({
				folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				err:err,
				project_id:req.body.project_id
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
				project_id:req.body.project_id
			});
		} 
		catch(err) {
			console.log(err);
			res.json({
				folders:[], 
				err:err, 
				project_id:req.body.project_id
			});
		}
	break;

	// Project log and project modal (aka dialog box)
	case "PROJECT-CHANGE":project.change(req, res); break; //TO DO
	case "PROJECT-IDLIST":project.idlist(req, res); break;
	case "PROJECT-INSERT":project.insert(req, res); break;	
	case "PROJECT-REMOVE":project.remove(req, res); break;	
	case "PROJECT-SELECT":project.select(req, res); break;	

	// Room Deficiency Sheets
	case "RDS-IMAGES":reports.rds_images(req, res); break;
	
	// Room Deficiency Sheets Log
	case "RDSS-INSERT":reports.rdss_insert(req, res); break;
	case "RDSS-SELECT":reports.rdss_select(req, res); break;
	case "RDSS-UPLOAD":reports.rdss_upload(req, res); break;
	
	// Site Review Reports
	case "SVR-SELECT":reports.svr_select(req, res); break;	

	// Site Review Reports Log
	case "SVRL-INSERT":reports.svrl_insert(req, res); break;	
	
	
	} //switch
	
}

