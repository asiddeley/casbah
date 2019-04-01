
const fs = require('fs');
const path = require('path');


//https://gist.github.com/kethinov/6658166
//Returns a flat array of strings representing the paths to all the files 
//in the provided directory and all subdirectories
const walkSync = (dir, filelist = []) => {
 fs.readdirSync(dir).forEach(file => {
 filelist = fs.statSync(path.join(dir, file)).isDirectory()
  ? walkSync(path.join(dir, file), filelist):filelist.concat(path.join(dir, file));
 });
 return filelist;
}
exports.walkSync=walkSync;

//https://gist.github.com/kethinov/6658166
//Returns a tree like array of the directory structure where
//files are presented as string paths and directories as arrays
const walkSyncTree = (dir, filelist = []) => 	
	fs.readdirSync(dir).map(file => 
		fs.statSync(path.join(dir, file)).isDirectory() ? walkSync(path.join(dir, file), filelist):filelist.concat(path.join(dir, file))[0])
		
exports.walkSyncTree=walkSyncTree;

exports.getDirsSync=function(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir,file)).isDirectory();
  });
}

exports.getFilesSync=function(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir,file)).isFile();
  });
}


/**********************************
CASBAH 
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley

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

exports.dirSync_json=function(dir, json, jsoc, subdir, exts) {
	/*
	Returns a list of folders in folder dir, along with contents of jsonfile and any other file-names specified by exts if provided.  (DEPRICATED... If no jsonfile is found, one is created by default with contents provided in json. )
	Used for a file system type of database where the json file carries data pertaining to its parents directory.
	Optionally, if exts is specified, the result includes a list of files of specified extensions 
	Optionally, if subdir is specified and is found in directory dir then only subdir, its json file and any file names with spec'd extensions be returned
	**/
	
	// arguments can be passed individually or all in first argument...
	if (typeof dir == "object"){
		json=dir.json
		jsoc=dir.jsoc
		//look for dir.id or dir.subdir
		subdir=(typeof dir.id!="undefined")?dir.id:dir.subdir 
		exts=dir.filext || null
		dir=dir.dir
	}

	// else if (typeof variant == "string"){dir=variant}
		
	var  dd, jp, jt, ff=[], result=[], ss
	
	if (typeof subdir == "string"){
		//subdir provided so return only information from it
		dd=fs.readdirSync(dir).filter(function (file) {
			return (fs.statSync(path.join(dir,file)).isDirectory() && (file==subdir))
		})		
	} else {
		//subdir not provided so return all dir_items
		dd=fs.readdirSync(dir).filter(function (file) {
			return fs.statSync(path.join(dir,file)).isDirectory()
		})		
	}
	
	for (var i in dd){
		jp=path.join(dir, dd[i], json)		
		try {
			//optional - get list of files
			if (typeof exts == "string"){
				ff=fs.readdirSync(path.join(dir, dd[i])).filter(function(f){
					//console.log("checking file:", dir, dd[i], f)
					//check if file matches any of the extensions specified
					//var ok=exts.split(" ").some(x=>f.indexOf(x)!=-1)
					var ok=(exts.toUpperCase().indexOf(path.extname(f).toUpperCase())!=-1)
					//return only files with specified extensions
					return (fs.statSync(path.join(dir, dd[i], f))).isFile() && ok
				})				
			}
			//do this last so if it fails, list of files ff will be ok
			console.log("dirSync_json... trying jsonfile")
			jt=fs.readFileSync(jp,"UTF-8")
		} 
		catch (err){
			console.log("dirSync_json... jsonfile read failed:", err)
			//DEPRECATED Create file if not found
			//jt=JSON.stringify(jsoc || {})
			//if (err.code=="ENOENT") {fs.writeFileSync(jp, jt)}
		}
		finally {
			result.push({dir:dd[i], files:ff, jsonfile:json, jsontext:jt})
			console.log("FS+ DIRSYNC_JSON finally")
		}
	}
	//result = [{dir:"name", files:[], jsonfile:"name", jsontext:"{field:value, }"}, ...]
	return result
}

exports.jsonify=function(rar){
	/**
	Convert and merge jsontext to object in array objects
	rar = [{dir:"name", jsontext:"{field:value, ... }" }, ...]
	ret = [{dir:"name", field:value, ... }, ...]
	**/

	for (var i in rar){
		try{rar[i]=Object.assign(rar[i], JSON.parse(rar[i].jsontext)); delete rar[i].jsontext; }
		catch(err){rar[i].err=err}
	}
	return rar
}

exports.dirasid=function(rar, id){
	/**
	Add id property to object in result and set it to dir
	id = "some_id"
	rar = [{dir:"some_dir", jsonfile:"name", ... }, ...]
	ret = [{dir:"some_dir", jsonfile:"name", some_id:"some_dir", ... }, ...]
	**/

	return rar.map(function(i) {
		var prop={}
		prop[id]=i.dir
		return Object.assign(i, prop)
	})
}

