//move or copy this file to the working dir (appRoot) after npm install casbah
//ie. casbah is a dir in node_modules

//set global variables
global.appRoot=__dirname
global.uploads_dir="projects"
global.wiki_dir="wiki"

console.log("uploads_path:", global.appRoot + "\\" + global.uploads_dir)
console.log("wiki_path:", global.appRoot + "\\" + global.wiki_dir)

//start carbah server 
require("casbah")

//for this file to work in the parent dir of node_modules use...
//require("../casbah") 