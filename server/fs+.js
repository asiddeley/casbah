
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

exports.dirSync_json=function(dir, jsonfile, defrow) {
	/**
	returns a list of directories along with contents of a specified jsonfile within each of the directories
	Used for a file system type of database where the jsonfile carries data pertaining to its parents directory.
	**/
	var dd=fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir,file)).isDirectory()
	})
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
