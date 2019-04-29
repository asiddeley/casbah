/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
***********/

// PRIVATE STATIC



// PUBLIC

exports.activate=function(casbah){
	//projects is the default new
	casbah.queries.projects=new casbah.Query();
	casbah.queries.project=new casbah.Query({
		alias:"project",
		action:"select",
		casdok:"projects",	
		desc:"Project information, for matching pronum",
		docnum:"",
		pronum:"(overriden)", 
		success:function(r){
			r.files.forEach(f){
				(if f==this.options.pronum){}
			}
		}
	});	
};

exports.Query=function(){
	/**
	arguments are any number of option objects {}, {}... which are merged and used as options for an ajax call to the server to access the database.
	If a string is provided (any order) it's taken to mean the name of the query and that the query is to be saved and available for use in casbah.queries.
	*/
	
	this.options={
		alias:"projects",
		action:"select",
		casdok:"projects",
		desc:"Returns a list of available project names",
		docnum:"",
		error:function(){
			console.log("Query.options.error()...");
		},
		pronum:"", //wildcard had no effect and is ignored
		success:function(result){
			console.log("Query.options.success()...");
			console.log("Project data...", result.data);
			console.log("Project folders...", result.folders);
			//result.folders.forEach(function(name){console.log(name);});
		},
		field:"none",
		valu:"none"
	};
	
	for (var a in arguments){
		if (typeof arguments[a]=="object") {$.extend(this.options, arguments[a]);}
		else if (typeof arguments[a]=="string"){
			//Register the query in casbah.queries
			casbah.queries[arguments[a]]=this;
		}
	};
	
	this.run=function(){
		var query=this;
		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: $.param(query.options),
			error: function(err){ 
				console.log("Server error...", err);
				query.options.error(result);
			},
			success: function(result){ 
				console.log("Query.success...");
				query.options.success.call(query, result);
			},
			type:"POST",
			url:"/casite" 
		});	
	};
	
	this.clone=function(options){
		//returns a copy of this query with overrides provided in options
		//options eg. {success:function(r){....}}
		var q=$.extend({},this);	
		$.extend(q.options, options);
		return q;
	};
	
};
