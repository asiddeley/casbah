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


casbah.tables.projects=function(){
	
	return {
		datafile:"project_data.json",
		defrow:function(){return {
			pnum:(localStorage.getItem("project_number") || "PROJ-001"),			
			pname:"The Casbah Building",
			address:"101 Boogie Street, Toronto, Ontario, Canada, M4X-2W6",
			client:"Client", 
			contractor:"CasbahCon",
			permit:"16 xxxxxx BLD 00 BA",
			date:"2018-May-10", //Date(),
			date_closed:"none",
			status:"status",
			xdata:"none"
		};},
		//default filter selects current projects
		filter:function(){return {pnum:localStorage.getItem("project_number")};},
		refresh:function(){console.log("Render function not yet defined.");}
	};
};

casbah.tables.site_comments=function(){
	
	return {
		table:"site_comments",
		datafile:function(){return(
			localStorage.getItem("project_number")+
			"\\"+
			localStorage.getItem("site_report_id")+
			"\\site_comments.json"
		);},
		defrow:function(){return {
			rowid:0, //this is inserted by default
			pnum:localStorage.getItem("project_number"), 
			comment:"New comment", 
			refs:[], 
			date:Date(), 
			by:localStorage.getItem("user_name")
		};},			
		filter:function(){return 
			{rowid:{$elemMatch:JSON.parse(localStorage.getItem("comment_ids"))}};
		},
		refresh:function(result, delta){}
	};
};

casbah.tables.site_issues=function(){
	
	return {
		table:"site_issues",
		datafile:function(){return (
			localStorage.getItem("project_number")+"\\"+
			localStorage.getItem("site_report_id")+"\\site_issues.json"
		);},
		defrow:function(){ return {
			pnum:localStorage.getItem("project_number"), 
			desc:"New issue", 
			date:Date(), 
			date_closed:null,
			//list of site_reports that reference this row
			refs:[],
			by:localStorage.getItem("user_name")
		};},
		//filter:" pnum = $pnum ",
		//returns mongodb filter object that returns site_issues related to current site_report
		filter:function(){return {
			pnum:(localStorage.getItem("project_number")),
			refs:{$elemMatch:(localStorage.getItem("site_report_id"))}
		};},
		refresh:function(){console.log("Render function not yet defined.");}
	};
};



casbah.tables.site_reports=function(){
	
	return {
		//table name in database
		datafile:"site_reports.json",
		//row definition ///// should be a function to provide latest params
		defrow:function(){return {
			project_number:localStorage.getItem("project_number"),			
			document_number:localStorage.getItem("document_number"),
			document_title:"document title",
			date:"2018-May-10", //Date(),
			date_issued:"none", 
			by:localStorage.getItem("user"),			
			comment_ids:"[1,2,3]", 
			issue_ids:"[1,2,3]",
			photo_ids:"[1,2,3]",
			xdata:"none"
		};},		
	};
}

casbah.tables.wiki=function(){
	
	return {
		//table name in database
		datafile:"wiki.json",
		//row definition ///// should be a function to provide latest params
		defrow:function(){ return {
			title:(localStorage.getItem("$wiki_title") || "Wiki article"),			
			intro:(localStorage.getItem("$wiki_intro") || casbah.lorem() ),
			tags:"[]",
			date:Date(),
			by:(params.$user || "admin"),			
			thumbnail:" ", 
			uploads:"[]",
			votesup:0,
			votesdn:0,
			xdata:"none"
		};},
		//filter:" rowid in ( $wiki_articles )",
		refresh:function(){console.log("Render function not yet defined.");}
	};
}