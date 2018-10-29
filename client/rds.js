
/**********************************
CASBAH * Contract Administration System Be Architectural Heroes *

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

//////////////////////////
// Rds = Room Deficiency Sheets
// Client Side

// Add Rds creator function to casbah library
if (typeof casbah.creators == "undefined"){casbah.creators={};};
casbah.creators.rds=function(camel){return new casbah.Rds(camel);};

// Add Svr function to casbah library if missing
if (typeof casbah.Rds!="function"){casbah.Rds=function(){
	
var Rds=function(camel){
	var rds=this;
	rds.camel=camel;
	rds.view$=rds.camel.casdo$;
	
	//casbah.project.check();
	this.checklist=view$.find("#deficiency_sheets_checklist").html();
	this.comments=view$.find("#deficiency_sheets_comments").html();	
	this.tblock=view$.find("#deficiency_sheets_tblock").html();
	this.tools=view$.find("#deficiency_sheets_tools").html();
	this.template=Handlebars.compile($("#deficiency_sheets").html());
	this.colcount=0;	
	
	Handlebars.registerHelper("rds_checklist", function(str, options){return rds.checklist;});
	Handlebars.registerHelper("rds_comments", function(str, options){return rds.comments;});
	Handlebars.registerHelper("rds_tblock", function(str, options){return rds.tblock;});
	Handlebars.registerHelper("rds_tools", function(str, options){return rds.tools;});
	Handlebars.registerHelper("chop_extension", function(str, options){
		str=str.substring(0,str.indexOf("."));
		str=str.substring(str.lastIndexOf("\\")+1);
		return str;
	});
	Handlebars.registerHelper("columnize", function(str, options){
		var len=30; 
		str=str.substring(0,str.indexOf("."));
		str=str.substring(str.lastIndexOf("\\")+1);
		if (str.length>len) {var cont="...";} else {var cont="";}
		str="<span class='col-xs-4'>"+str.substring(0,len)+cont+"</span>";
		rds.colcount+=1;
		//end row and start next row for every 6 columns
		if (rds.colcount % 3 == 0) {str+="</div><div class='row'>";}
		return str;
	});		
	
	//previously deficiency_sheets.refresh()
	rds.view();
}

Rds.prototype.view=function(){
	//get images for deficiency sheets then refresh with success function()...
	rds=this;
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"RDS IMAGES",
			pronum:rds.camel.argo.pronum, //NEW!
			docnum:rds.camel.argo.docnum, //NEW!
			filext:".PNG .jpg", // NEW! previously extension
		}),
		error:function(err){console.log("Error:", err.message);},
		success:function(result){
			//console.log("result,", JSON.stringify(result));
			var html=rds.template(result);
			rds.view$.find("#deficiency_sheets_placeholder").html(html);
		},
		type: "POST",
		url:"/uploads"
	});
};


//////////////////////////////////////////
//END OF CLOSURE
return Rds;}();}

console.log("rds.js loaded");
