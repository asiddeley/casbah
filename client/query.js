/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
***********/

// PRIVATE STATIC


// PUBLIC

exports.activate=function(casbah){

	//register queries in casbah.queries.  Default new Query is projects
	new casbah.Query("projects");
	
	new casbah.Query("project", {
		alias:"project",
		action:"SELECT",
		casdok:"project",	
		docnum:"",
		pronum:function(){return casdok.current("pronum")}, 
		success:function(r){console.log("Query success...", r);},
		title:"Project information, for matching pronum"
	});	
	
	new casbah.Query("XQ1", {
		alias:"project",
		action:"SELECT",
		casdok:"projects",	
		docnum:"",
		pronum:function(){return casdok.current("pronum")}, 
		success:function(r){
			console.log("Query success...");
			//keyword 'this' should work as intended here because success is called
			r.folders.forEach(function(f){
				if (f==this.options.pronum){
					//run nexted query
					this.query.options.branch=f;
					this.query.run();				
				}
			});
		},
		title:"experimental query with nested query",
		query:new casbah.Query()
	});	
};

exports.Query=function(){
	/**
	arguments are any number of option objects {}, {}... which are merged and used as options for an ajax call to the server to access the database.
	If a string is provided (any order) it's taken to mean the name of the query and that the query is to be saved and available for use in casbah.queries.
	*/

	this.options={
		alias:"projects",
		//action:"SELECT",
		//branch:"", //like path
		//casdok:"projects", //identifies the datafile
		//docnum:"", //not applicable
		error:function(err){
			console.log("Query.options.error()...", err);
		},
		//pronum:"", //not applicable
		success:function(result){
			console.log("Query.options.success()...", result);
			//console.log("Project data...", result.data);
			//console.log("Project files...", result.files);
			//console.log("Project folders...", result.folders);
			//result.folders.forEach(function(name){console.log(name);});
		},
		//title:"List of all project names",
		//field:"none", //not applicable
		//valu:"none" //not applicable
		graphql:"{pronum}"
	};
	
	for (var a in arguments){
		if (typeof arguments[a]=="object") {$.extend(this.options, arguments[a]);}
		else if (typeof arguments[a]=="string"){
			//Register the query in casbah.queries
			//casbah.queries[arguments[a]]=this;
			casbah.query(arguments[a], this);
		}
	};
	
	this.run=function(){
		//arguments: override option object(s) and/or success function for one time use
		//reworked for graphql
		
		var query=this;
		//make a copy this.options
		var options=$.extend({}, query.options);
		var a, i;
		
		for (i in arguments){
			a=arguments[i];
			if (typeof  a== "object"){$.extend(options, a);}
			else if (typeof a == "function"){options.success=a;}
		};

		$.ajax({
			//contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			contentType: "application/json",
			//data:(override)?$.param(overrides):$.param(query.options),
			data:JSON.stringify({query:options.graphql}),
			error: function(err){ 
				console.log("Server error...", err);
				options.error(err);
			},
			success: function(result){
				console.log("Query.success, calling success function...", result);
				return options.success.call(query, result);
			},
			type:"POST",
			//url:"/casite"
			url:"http://localhost:4000/graphql"
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
