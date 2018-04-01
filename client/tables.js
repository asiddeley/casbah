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

if (typeof casbah=="undefined") {casbah={};}


casbah.lorem=function(){
	return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
}

///////////////////////
// Casbah tables

// FYI - SQL to retrieve a database table column names or fields:
// pragma table_info(svrs)

casbah.tables={};
casbah.tables.comments=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		//table name in database
		table:"comments",
		//row definition
		defrow:{
			pnum:(params.$pnum || "BLDG-001"), 
			comment:"New comment", 
			refs:"[ ]", 
			date:Date(), 
			by:(params.$user || "none")
		},			
		filter:" rowid IN ( $comment_ids )",
		params:params,
		refresh:function(result, delta){}
	};
};


casbah.tables.issues=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		table:"issues",
		defrow:{
			pnum:(params.$pnum || "BLDG-001"), 
			desc:"New issue", 
			open:Date(), 
			shut:"none", 
			refs:"[ ]", 
			by:(params.$user || "unknown")
		},
		filter:" pnum = $pnum ",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
};



casbah.tables.projects=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		//table name in database
		table:"projects",
		//row definition
		defrow:{
			pnum:(params.$pnum || "BLDG-001"),			
			pname:"The Casbah Building",
			address:"101 Boogie Street, Toronto, Ontario, Canada, Postal-code",
			client:"Client", 
			contractor:"CasbahCon",
			permit:"16 xxxxxx BLD 00 BA",
			date:Date(),
			date_closed:"none",
			status:"status",
			xdata:"none"
		},
		//default filter selects current projects
		filter:" pnum = $pnum ",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
};

casbah.tables.siteVisitReports=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}
	
	return {
		//table name in database
		table:"svrs",
		//row definition ///// should be a function to provide latest params
		defrow:{
			pnum:(params.$pnum || "BLDG-001"),			
			dnum:(params.$dnum || "SVR-A01"),
			dtitle:"document title",
			date:Date(),
			date_issued:"none", 
			by:(params.$user || "admin"),			
			comment_ids:"[1,2,3]", 
			issue_ids:"[1,2,3]",
			photo_ids:"[1,2,3]",
			xdata:"none"
		},
		filter:" dnum = $dnum AND pnum = $pnum",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
}

casbah.tables.wiki=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}
	
	return {
		//table name in database
		table:"wiki",
		//row definition ///// should be a function to provide latest params
		defrow:{
			title:(params.$wiki_title || "new wiki article"),			
			intro:(params.$wiki_intro || casbah.lorem() ),
			tags:"[]",
			date:Date(),
			by:(params.$user || "admin"),			
			thumbnail:" ", 
			uploads:"[]",
			votesup:0,
			votesdn:0,
			xdata:"none"
		},
		filter:" rowid in ( $wiki_articles )",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
}