
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
