/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/

const FS = require("fs")
const FSP = require("fs-plus")
const PATH = require("path")
const DRR=require("./DRRschema")

//DRR folders and files 
const BRANCH=PATH.join("reports", "deficiency reviews")
const CASITE=PATH.join(global.appRoot, global.casite)
const FILENAME_HEAD="head.json"
const FILENAME_NOTES="notes.json"
const FILENAME_DEFICS="deficiencies.json"
const FILENAME_PLANS="plans.json"
const FILENAME_PHOTOS="photos.json"
const FOLDER_PLANS="plans"
const FOLDER_PHOTOS="photos"

///////////////////////////////////////////////
// DBonFS (data-base on file system) prototypes: jsonFiler, txtFiler, uploadBucket, 

// jsonFiler
function jsonFiler(path){
	//initialize
	path=path||this.path
	if (FSP.existsSync(path)){
		this.deserialize(path)	
	} else {
		FS.mkdirSync(PATH.dirname(path))
		this.serialize(path)	
	}	
}

jsonFiler.prototype.deserialize=function(path){
	try {
		path=path||this.path
		console.log("trying " + this.constructor.name + ".deserialize...")
		Object.assign(this,	JSON.parse(FS.readFileSync(path)))
	} catch(e) {
		console.log("error:", e, "/////////////////////////////")
	}
}

jsonFiler.prototype.getData=function(){
	//returns own properties of parent object
	var j={}
	for (var p in this){
		if (this.hasOwnProperty(p)) {
			j[p]=this[p]
		}
	}
	return j
}

jsonFiler.prototype.serialize=function(path){
	try {
		path=path||this.path
		console.log("trying " + this.constructor.name + ".serialize...")
		FS.writeFileSync(path, JSON.stringify(this.getData()))
	} catch(e) {
		console.log("error:", e, "/////////////////////////////")
	}	
}

// imageFiler
function imageFiler(dir, list){
	// initialize
	dir=dir||this.dir
	// [{image:"imgName", caption:"caption"...}, {info2}...]
	list=list||[{}]
	// image extensions to look for
	const EXTS=["JPG", "PNG"]
	// update list with info on images in dir...
	var images
	if (FSP.existsSync(dir)){
		// image folder exists so proceed...
		images=FS.readdirSync(dir).filter(function (file) {
			return (
				FS.statSync(PATH.join(dir, file)).isFile() &&
				EXTS.includes(file.split(".").pop().toUpperCase())
			)
		})
		images.forEach(function(file){
			// search list for info on {image:file}
			if (!list.find(function(i){return i.image==file})){
				var stats=FS.statSync(PATH.join(dir, file))
				list.push({
					//remove the extension
 					caption:file.split(".")[0], 
					//date:atime, //accessed
					//date:ctime, //status changed
					//date:mtime, //modified
					date:stats.birthtime.toString().substring(0,15),
					image:file,					
					photoId:cryptoId(file)
				})
			}
		})
	} else {
		// image folder not found so create it
		// this.serialize(dir)	
	}
}




////////////////////////////////
//Resolvers
//function names relate to queryField names
exports.resolvers={

	drrIds(projectId){
		console.log("drrId resolver...", projectId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var p=PATH.join(CASITE, projectId, BRANCH)
			ids=FS.readdirSync(p).filter(function (file) {
				return FS.statSync(PATH.join(p,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	
	drrHead(projectId, drrId){
		console.log("drrHead resolver...")
		var data
		try {
			var p=PATH.join(CASITE,	projectId, BRANCH, drrId, FILENAME_HEAD)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrHead(projectId, drrId)).getData()
		}
		return data
	},

	drrNotes(projectId, drrId){
		console.log("drrNotes resolver...")		
		var data
		try {
			var p=PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_NOTES)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrNote(projectId, drrId)).getData()
		}
		return data
	},

	createDrr(projectId){
		console.log("drrCreate resolver...")
		var	result
		try {
			var drr=new Drr(projectId, null)
			drr.serialize()
			result=drr.getOwn()
		} 
		catch(e){
			console.log("error:",e)	
			result={err:e}			
		}
		//return default data
		return result

	}
}


