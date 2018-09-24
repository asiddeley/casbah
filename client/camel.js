
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

// Start of closure
if (typeof casbah.Camel!="function"){casbah.Camel=function(){
	
///////////////////////
// CAMEL = Contract Admin Main Explorer & Lister

function Camel(argo){
	//argument object
	this.argo=$.extend({
		//folder to render
		path:"uploads\", 
		//element for all camels
		_base:null,
		name:null,
	}, argo);
	
	//init static base element where all camels display
	if (!this.argo._base){
		Camel.prototype._base=$("<div></div>");
		$("body").append(Camel.prototype._base);		
	}

	//init or else update static list of all Camels that have been instanciated
	if (typeof Camel.prototype._camels=="undefined"){Camel.prototype._camels=[this];}
	else {Camel.prototype._camels.push(this);}
	
	//init or else update static Camel menu
	if (typeof Camel.prototype._menue=="undefined"){
		Camel.prototype._menue=$("<div></div>");
		var li=$("<li>"+this.argo.name+"</li>").click(function(){this.run();});
		li.appentTo(Camel.prototype._menue);
		Camel.prototype._menu=$.menu(Camel.prototype._menue);
	} else {
		$("<li>"+this.argo.name+"</li>").appentTo(Camel.prototype._menue);
		Camel.prototype._menu.menu("refresh");
	}	
	

};

Camel.prototype.nato=["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"];

Camel.prototype.list=function(){
	//show list of all camels
	
}

Camel.prototype.run=function(){
	//focus on this camel, render path
	
}



//end of closure
return Camel;}();}
