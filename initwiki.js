/**********************************
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

/**********
wikify
walks wiki folders and prepares wiki from available files folders
Rules:
1. folder words become tags which are applied to contents of folder
eg /cad/clng detail/.. contents will be tagged with cad, clng & detail
2. sld slides will have a corresponding png made
3. each filename becomes a wiki article, different extensions

************/

const s2p = require(__dirname+"\\server\\sld2png")
const fs=require("fs")
const fsp=require(__dirname+"\\server\\fs+")
const path=require("path")

var background_colour=9; //grey
var fi;
var files=fsp.walkSync(__dirname+"\\uploads\\wiki");
var file;
//console.log (dirs)
const md_content=" is an autoCAD block..."
var json;
var json_content={
	comments:[],
	tags:[],
	voteups:0,
	votedns:0
}
var local
var out;

for (fi=0; fi<files.length; fi++){
	
	file=files[fi];
	
	/////Make PNG
	if (ext1_listed_ext2_not(fi, files, ".sld", ".png")){
	//if (path.extname(file)==".sld"){
		//console.log ("SLD ",fi," of ", files.length)
		s2p.make_png(file, background_colour)
	}
	
	/////Make MD
	if (ext1_listed_ext2_not(fi, files, ".sld", ".md")){
	//if (path.extname(file)==".sld"){
		//console.log("overwriting ", path.dirname(file)+"\\"+path.basename(file,".sld")+".md")
		out=fs.createWriteStream(path.dirname(file)+"\\"+path.basename(file,".sld")+".md");
		out.write(path.basename(file,".sld")+md_content);
		out.end();
	}
	
	/////Make JSON
	if (ext1_listed_ext2_not(fi, files, ".sld", ".json")){
	//if (path.extname(file)==".sld"){
		tagstr=file.substring((__dirname+"\\uploads\\wiki\\").length); //chop of anything above wiki
		tagstr=path.dirname(tagstr);
		json_content.tags=tagstr.split(/[ \\]+/); //split at space or backslash
		out=fs.createWriteStream(path.dirname(file)+"\\"+path.basename(file,".sld")+".json");
		out.write(JSON.stringify(json_content));
		out.end();		
	}	
	
}

////////////////////////////////////////////

function ext1_listed_ext2_not(fi, files, ext, ext1){
	//Returns true if file at index fi in list of files satisfies following:
	//has extension ext and
	//has no corresponding file in the list with extension ext1
	var i=files[fi].indexOf(".")
	var x=files[fi].substring(i)
	var n=files[fi].substring(0,i)
	if (x==ext && files.indexOf(n+ext1)==-1) {return true;}
	else {return false;}		
	/*
	//this method using path doesn't work
	if (ext.indexOf(".")!=0) {ext="."+ext}
	if (ext1.indexOf(".")!=0) {ext1="."+ext1}
	var file=files[fi];
	//drop extension...
	var common=path.dirname(file)+"\\"+path.basename(file, path.extname(file));
	console.log("COMMON ext, ext1:", common, ext, ext1)
	if (path.extname(file)==ext && !files.indexOf(common+ext1) ){console.log("TRUE");return true;}
	else {console.log("FALSE");return false;}
	*/
}
