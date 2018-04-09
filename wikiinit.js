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

function ext1_listed_ext2_not(fi, files, ext1, ext2){
	//returns true if file in list files[fi] has 
	//extension ext ".sld" and has no corresopnding ext1 ".png" in the list
	var i=files[fi].indexOf(".")
	var x=files[fi].substring(i)
	var n=files[fi].substring(0,i)
	//console.log("checking files[i]:", files[fi])
	//ext ".sld"
	if (x==ext1 && files.indexOf(n+ext2)==-1) {return true;}
	else {return false;}	
}

var files=fsp.walkSync(__dirname+"\\uploads\\wiki");
//console.log (dirs)


for (var fi=0; fi<45; fi++){
	//Ensure sld has corresponding png
	if (ext1_listed_ext2_not(fi, files, ".sld", ".png")){
		//console.log("MAKE", files[i])
		s2p.make_png(files[fi], 9)
	}	
}




