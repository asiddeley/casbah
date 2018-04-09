
//https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs

const fs = require('fs');
const path = require('path');

/*
exports.getDirs = function(rootDir, cb) { 
    fs.readdir(rootDir, function(err, files) { 
        var dirs = []; 
        for (var index = 0; index < files.length; ++index) { 
            var file = files[index]; 
            if (file[0] !== '.') { 
                var filePath = rootDir + '/' + file; 
                fs.stat(filePath, function(err, stat) {
                    if (stat.isDirectory()) { 
                        dirs.push(this.file); 
                    } 
                    if (files.length === (this.index + 1)) { 
                        return cb(dirs); 
                    } 
                }.bind({index: index, file: file})); 
            }
        }
    });
}



function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirsRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirsRecursive))];
}

exports.getDirsRecursive=function(srcpath){return getDirsRecursive(srcpath);}
*/


//https://gist.github.com/kethinov/6658166
const walkSync = (dir, filelist = []) => {
 fs.readdirSync(dir).forEach(file => {
 filelist = fs.statSync(path.join(dir, file)).isDirectory()
  ? walkSync(path.join(dir, file), filelist):filelist.concat(path.join(dir, file));
 });
 return filelist;
}
exports.walkSync=walkSync;

const walkSyncTree = (dir, filelist = []) => 	
	fs.readdirSync(dir).map(file => 
		fs.statSync(path.join(dir, file)).isDirectory() ? walkSync(path.join(dir, file), filelist):filelist.concat(path.join(dir, file))[0])
		
exports.walkSyncTree=walkSyncTree;
