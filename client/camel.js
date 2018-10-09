
/******************************************************************
* CASBAH * Contract Administration System Be Architectural Heroes *

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

	
/////////////////////////////////////////////////
// Camel = Contract Admin Many Exploratory Llamas 
// Client side

function Camel(argo){
	that=this;
	
	//init name. If not provided in argo, default name is the next nato code
	if (typeof argo=="object" && typeof argo.name=="string"){this.name=argo.name} 
	else {this.name=this.nato[Camel.prototype.camels.length-1];}
	
	//argument object
	argoSave(argo);
	
	//only one camel active at a time, this camel is now the main one 
	Camel.prototype.mainCamel=this;

	//update static list of all instantiated camels
	Camel.prototype.camels.push(this);
	
	//init camel names list if necessary
	if (typeof Camel.prototype.name$=="undefined"){Camel.prototype.name$=$("#camel-names");}
	
	//branch for this camel to view eg. "/PRJ-001/reports/site visit report/SVR-A01"  
	//this.branch=argo.branch;
	
	//init just once and for all camels, jquery element for displaying camel content
	if (argo.view$){Camel.prototype.view$=argo.view$;}
	if (!Camel.prototype.view$) {Camel.prototype.view$=$("#camel-view");}
	
	this.casdoc=""; //document - "site visit report"
	this.casdoo=null; //document object - new casbah.Svr();
	this.casdo$=$("<div class='CASDOC'></div>"); //jquery element or place for document templates 
	
	//render
	//update list of all instantiated camel names.  Ensure it comes after name$ is defined
	this.list();
	//update camel contents
	this.view();
};

Camel.prototype.argo={};
Camel.prototype.argoSave=function(argo){
	//argument update
	//relies on camel.name, must be set!
	
	//casdoc = casdoc.name eg. "site visit report" (=> casdoc.base "reports/site reviews/" by casdoc)
	//branch = pro_id + casdoc.base + doc_id (as calculated and returned by casbah)
	//path = pro_id + casdoc.base+doc_id
	
	argo=$.extend(
		//local storage.  localStorage returns null if item not found
		{
			casdoc:localStorage.getItem("camel-casdoc-"+this.name),
			docuid:localStorage.getItem("camel-docuid-"+this.name),
			projid:localStorage.getItem("camel-projid-"+this.name)
		},
		//existing 		
		this.argo,
		//new 
		((typeof argo=="undefined")?{}:argo)
	);
	
	this.argo=argo;
	localStorage.setItem("camel-casdoc-"+this.name, argo.casdoc);
	localStorage.setItem("camel-docuid-"+this.name, argo.docuid);
	localStorage.setItem("camel-projid-"+this.name, argo.projid);
	
	
};

//result of argo.casdoc, argo.doc_id & argo.pro_id as provided by ajax call
Camel.prototype.branch=null;

Camel.prototype.list(){
	//delete existing list
	$(".CAMELNAME").remove();
	
	//Recreate list of all instantiated camel names for the CASBAH admin menu	
	this.camels.forEach(function(n){
		var li=$("<li class='CAMELNAME'><a href='#'>"+n+"</a></li>");
		li.appendTo(Camel.prototype.name$);
		li.click(function(){ that.main(that.argo.name);});
	});
};


Camel.prototype.main=function(name){
	//Make named camel the main camel. Returns main camel if called without argument
	if (typeof name=="undefined") {return Camel.prototype.mainCamel;}
	//find camel with name
	var mc=this.camels.filter(function(c){return (c.name==name);});
	//update mainCamel property in all camels...
	if (mc.length==1){Camel.prototype.mainCamel=mc[0];}
	console.log("Main camel is " + Camel.prototype.mainCamel);	
	this.view();
};

Camel.prototype.mainCamel=null;

//list of all intantiated camels
Camel.prototype.camels=[];

Camel.prototype.name="unnamed";

Camel.prototype.nato=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];
	
Camel.prototype.retire=funtion(name){
	//remove camel by name
	Camel.prototype.camels=Camel.prototype.camels.filter(function(c){return (c.name!=name);});
	//redo the CASBAH admin tab camel list
	this.list();
};

Camel.prototype.view=function(argo){

	//with current camel, render the branch as per its assigned CASDOC
	//var camel=this;
	var camel=this.mainCamel;	
	
	//update arguments
	argoSave(argo);
	
	//reset the camel view
	Camel.prototype.view$.empty();
	//append any camel info here
	
	//add the div element that will hold the document contents
	Camel.prototype.view$.append(camel.casdo$);

	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param({
			action:"CAMEL VIEW",
			branch:camel.branch, //null or result of args below
			casdoc:camel.argo.casdoc,
			docuid:camel.argo.docuid,
			projid:camel.argo.projid
		}),
		error: function(err){ console.log(err.message);},
		success: function(r){ 
			//r={branch:"", folders:[], files:[], err:null, casdoc:{}} 
			//cadsoc={name:"site visit report", jscr:"client/svr.js", html:"client/svr.html"}
			camel.branch=r.branch;
			//load and execute script...
			$.getScript(r.casdoc.jscr, function(data, textStatus, jqxhr ){
				console.log( "camel $getScript:" + r.casdoc.jscr);	
				//console.log( data ); // Data returned
				//console.log( textStatus ); // Success
				//console.log( jqxhr.status ); // 200
				
				//then load template
				$.load(r.casdoc.html, function(h){
					console.log( "camel $load:" + r.casdoc.html);	
					//reset jquery element casdo$ with applicable document templates
					camel.casdo$.html(h);
					//create document object passing jquery element casdo$
					camel.casdoo=casbah.creators[r.casdoc.name](that.casdo$, r.branch);
					camel.casdoo.view();					
				});
			});
		},
		type:"POST",
		url:"/uploads"
	});
};

Camel.prototype.view$=null;

