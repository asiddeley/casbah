
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

	
///////////////////////
// CAMEL = Contract Admin Multi-ELevator.  Brings up requested pages

function Camel(argo){
	that=this;
	
	//argument object
	this.argo=$.extend({
		//element for all camels
		name:null,
		//folder to render
		path:"uploads" 
	}, argo);
	
	//init view as static variable to all Camels
	if (!Camel.prototype.view$) {Camel.prototype.view$=$("#camel-view");}

	//init or else update static list of all instantiated camels
	if (typeof Camel.prototype.camels=="undefined"){Camel.prototype.camels=[this];}
	else {Camel.prototype.camels.push(this);}
	
	//init name - if not provided in argo, default name is a nato code
	if (!this.argo.name){this.argo.name=this.nato[Camel.prototype.camels.length-1];}
	
	//init camel names list if necessary
	if (typeof Camel.prototype.name$=="undefined"){Camel.prototype.name$=$("#camel-names");}
	//update camel names, list of all instantiated camel names	
	var li=$("<li id='camel-"+this.argo.name+"'><a href='#'>"+this.argo.name+"</a></li>");
	li.appendTo(Camel.prototype.name$);
	li.click(function(){ that.run(that.argo.name);});
	//alert("Run camel run");

};

Camel.prototype.nato=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"];


Camel.prototype.run=function(name){
	//name becomes active camel
	alert("run " + name + " run");
};


