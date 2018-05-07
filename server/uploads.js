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


const dbfs_create=function(datafile, row, callback){
	//row - {by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}
	//table - {"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}

	row["rowid"]="0"; //add rowid:value
	var table={"0":row}; 
	fs.writeFile(datafile, JSON.stringify(table), function(err){
		if (!err){ 
			console.log("DBFS-CREATE success"); 
			//result is an array of selected rows
			if (typeof callback=="function"){callback({rows:[row]});}
		} else { 
			console.log("DBFS-CREATE fail:", err); 
			//result is an array of selected rows
			if (typeof callback=="function"){callback({rows:[row], err:err});}
		}		
	});
};

const ddfs_insert=function(df, row, callback){
	fs.readFile(df, function(err, data){
		//table is an object of rows eg...
		//{"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}
		var table=JSON.parse(data);
		var keys=Object.keys(table);
		var rowid=1+keys.reduce((acc, cur)=>Math.max(Number(acc), Number(cur)));
		row[rowid]=rowid; //
		table[rowid]=row;
		fs.writeFile(df, JSON.stringify(table), function(err){
			console.log("DBFS-INSERT success:", err);
			//result is an array of selected rows...
			//res.json({rows:[table[rowid]], err:err});	
			if (typeof callback=="function"){callback({rows:[row], err:err});}
		});
	});
}

//////////////////////////////////////////////////////////////////////////////
//Exports

exports.handler=function (req, res) {
	//Prerequisites (to be passed in ajax data):
	//req.body.action... ADD, DIR, FILES, UPLOAD, 
	//req.body.project_number... 
	//req.body.tab... Gallery | reports
	//req.body.folder... Collection | deficiency Sheet set
	//req.body.extension
	//req.files... populated by middle-ware from ajaxed formData
	var project_number=req.body.project_number;
	
	if (typeof project_number == "undefined") {
		console.log("Upload handler error: project_number undefined"); 
		res.json({dirs:[],err:err});
		return;
	}
	const root=path.join(global.appRoot,"uploads", req.body.project_number);

	switch (req.body.action){
		
	case "DBFS-DELETE":
		//prerequisites: 
		//reg.body.project_number
		//req.body.tab, 
		//req.body.folder
		//req.body.datafile
		//rowid
		console.log(
			"DBFS-DELETE:", 
			path.join(root, req.body.tab, req.body.folder, req.body.datafile), 
			req.body.rowid
		);
		try {
			fs.readFile(
				path.join(root, req.body.tab, req.body.folder, req.body.datafile), 
				function(err, data){
					//{"0":{field1:field1, ...}, "1":{field1:field1, ...} ...}
					var table=JSON.parse(data); 
					delete table.rowid;
					fs.writeFile(
						path.join(root, req.body.tab, req.body.folder, req.body.datafile), 
						JSON.stringify(table),
						function(err){
							console.log("DBFS-DELETE success");
							res.json({rows:[], err:err});
						}
					)
				}
			);
		}
		catch(err) {
			console.log(err);
			res.json({
				err:err,
				project_number:req.body.project_number
			})
		} 	
	break;

	case "DBFS-CREATE":
		var df=path.join(rootglobal.appRoot,"uploads", 
			req.body.project_number, req.body.tab, req.body.folder, req.body.datafile
		);
		console.log("DBFS-CREATE:", df, " defrow:", req.body.defrow);
		//result - {rows:[row], err:err}
		dbfs_create(df, req.body.defrow, function(result){res.json(result);});
	break;	

	case "DBFS-INSERT":
		var df=path.join(rootglobal.appRoot,"uploads", 
			req.body.project_number, req.body.tab, req.body.folder, req.body.datafile
		);
		console.log("DBFS-INSERT:", df, " row:", req.body.row);
		fs.stat(df, function(err, stat){
			if (!err){
				ddfs_insert(df, req.body.row, function(result){
					//result - {rows:[inserted_row], err:err}
					//consider returning all rows so client can refresh in one operation 
					req.json(result);
				});
			} else if (err.code=="ENOENT"){
				//datafile not found
				dbfs_create(df, req.body.row, function(result){
					//result - {rows:[inserted_row], err:err}
					//consider returning all rows so client can refresh in one operation 
					req.json(result);
				});
			}			
		});
	break;
	
	case "DBFS-SELECT":
	var df=path.join(rootglobal.appRoot,"uploads", 
		req.body.project_number,req.body.tab, req.body.folder, req.body.datafile
	);
	console.log("DBFS-SELECT:", df, " defrow(just in case datafile missing)", req.body.defrow);
	fs.stat	(df, function(err, stat){
		if (err==null){
			//file exists so read
			fs.readFile(df, function(err, data){
				console.log("DBFS-SELECT success:", err);
				//table is an object of rows eg...
				//{"0":{rowid:0, by:"asiddeley", date:"..."}, "1":{rowid:0, by:"asiddeley", date:"..."}...}
				var table=JSON.parse(data);
				//result is an array of selected rows. All rows for now, refine selection method...
				var selection=Object.keys(table).map(k=>table(k));
				res.json(rows:selection);			
			});				
		} else if (err.code=="ENOENT") {
			//datafile doesn't exist so create
			dbfs_create(df, req.body.defrow, function(result){
				res.json(result);
			});
		} else {
			//some other error			
		}
	}
	break;	
	
	
	case "MAKE":
		//needs: 
		//reg.body.project_number
		//req.body.tab, 
		//req.body.folder
		console.log("MAKE:", path.join(root, req.body.tab, req.body.folder));
		try {
			fs.mkdirSync(path.join(root, req.body.tab, req.body.folder));
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
		//NOT RECURSIVE
		//Prerequisites
		//req.body.project_number
		//req.body.tab
		//req.body.folder
		//req.body.extension... ".jpg .pgn .bmp"
		try {
			console.log("Request for files in:", path.join(root, req.body.tab, req.body.folder))
			//var files=fsp.walkSync(path.join( //recursive
			var files=fsp.getFilesSync(path.join( 
				req.body.tab, 
				req.body.folder
			));
			var filtered_files=[]
			var ext
			//remove app root dir from each file, uploads/reports/... part of path
			for (var i=0; i<files.length; i++){
				ext=path.extname(files[i]).toUpperCase()
				//if (ext == ".PNG" || ext==".JPG"){
				if (req.body.extension.toUpperCase().indexOf(ext)!=-1){	
					//files[i]=files[i].substring(global.appRoot.length)
					filtered_files.push(files[i].substring(global.appRoot.length))
				}
			}
			res.json({
				files:filtered_files,
				project_number:req.body.project_number,
				folder:req.body.folder
			})
		} 
		catch(err) {
			console.log(err)
			res.json({
				files:[], 
				err:err,
				project_number:req.body.project_number,
				folder:req.body.folder
			})
		}
	break;
	
	case "project_numbers":
		console.log("Request for project numbers:", global.appRoot,"uploads");
		
		try {
			var ro={};
			var bin=(typeof req.body.backin =="undefined")?"dirs":req.body.backin;
			//getDirsSync returns an array of folders.  Each is just a short name, not path
			ro[bin]=fsp.getDirsSync(path.join(global.appRoot,"uploads"));
			res.json(ro);
		} 
		catch(err) {
			console.log(err);
			res.json({dirs:[],err:err});
		}	
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
	
	}
	
}

