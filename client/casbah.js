/**********************************
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley

MIT License

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

window.casbah=function(){

	var casbah={};

	casbah.activate=function(){
		this.components.activate(this);		
		
	};		

	$.extend(casbah, require("./array++"));
	$.extend(casbah, require("./editor"));
	//Vue components
	casbah.components=require("./components");

	casbah.project={};
	casbah.project.select=function(){
		var pnum=prompt("Project number");
		if (pnum !== "" && pnum != null){
			localStorage.setItem("project_id", pnum);
			$("#browser_tab").text("CASBAH - "+pnum);
		};
		//casbah.project_dialog.show();
	};
	casbah.project.check=function(){
		//ensure project number set.  
		console.log("project_number check:",localStorage.getItem("project_number"));
		if (typeof localStorage.getItem("project_number") == "undefined") {
			casbah.project.select();
			return;
		} 
		$("#browser_tab").text("CASBAH - "+localStorage.getItem("project_number"));
	};

	casbah.project.modal=function(callback){
		$.ajax({
			data:$.param({
				action:"PROJECT-IDLIST",
				project_id:"dummy"
			}),
			//contentType:false,
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			error:function(err){console.log("Error:",err);},
			processData:false, 
			success:function(result){ 
				//result - [{pnum:"", pname:"", ...},{...},{...}...]
				console.log("Project modal:", result);
				//var h=casbah.project.ids_template(result);
				var h=casbah.project.idlist_template(result);
				//set callback
				$("#project_modal").one("hide.bs.modal", function (e) {
					if (typeof callback=="function"){callback();}
				});
				$("#project_modal_content").html(h);
				$("#project_modal").modal("show");
			},
			type:"POST",
			url:"/uploads"
		});	
	};	

	/*
	casbah.renderFX=function(placeholderID, templateFN, result, delta){
		//as returned from sqlite query...
		//result {rows:[{field:value, field:value...},{...},...]}
		if (typeof delta == "undefined"){delta={count:0};};
		if (placeholderID.indexOf("#")!=0){placeholderID="#"+placeholderID;}
		switch(delta.count){
			case(1):
				////Grand Reveal for added row then run callback function to render result
				$(placeholderID).html(templateFN(result));
				//var cr$=$('#comments-row'+delta.rowids[0]);
				var cr$=$(placeholderID+" > div").find($("[rowid="+delta.rowids[0]+"]"));
				cr$.css('background','gold').hide().show(500, function(){cr$.css('background','white');});
			break;
			case(-1):
				var cr$=$(placeholderID+" > div").find($("[rowid="+delta.rowids[0]+"]"));
				////Grand send-off for deleted row then run callback function to render result
				cr$.css('background','gold').hide(500, function(){
					$(placeholderID).html(templateFN(result));
				});
			break;
			default: 
				$(placeholderID).html(templateFN(result));
		};		
	}
	*/

	casbah.showMenu=function(menu$, ev){
		//first call texteditor with no arguments to turn it off just in case its on
		//ed.hide();
		menu$.show().position({my:'left top',	at:'left bottom', of:ev});
		//remember caller, that is the <div> or <p> element that launched the contextMenu
		menu$.menu('option', 'caller', ev.target);
		return false;
	};

	/*
	casbah.tool=function(htmlfile){
		console.log("toolchange");	
		//heads up - close open editors etc
		//$(document).trigger("toolchange", htmlfile);
		const id="TOOLBAR";
		if (!$("#"+id).length){
			$("#NAVBAR").append($("<div class='container'></div>").attr("id",id));		
		}
		if (typeof htmlfile == "undefined"){$("#"+id).hide();}
		else {$("#"+id).show().load("client/"+htmlfile);}
	};

	casbah.__views={};

	casbah.view=function(htmlfile){
		//htmlfile eg. deficiency_sheets_log.html
		
		console.log("viewchange:", htmlfile);	
		//heads up - close open editors etc
		$(document).trigger("viewchange", htmlfile);
		
		//init - ensure placeholder exists
		var id="VIEW";
		if (!$("#"+id).length){
			var el=$("<div></div>").addr("id",id);
			$("body").append($("<div></div>").attr("id",id));		
		}
		$("#"+id).load("client/"+htmlfile);

	};
	*/
	
return casbah;}();

/////////////////////
// POLYFILL

if (!Object.values) { 
	Object.values = function(obj){
		return Object.keys(obj).map(function(e){return obj[e]});
	}
}

