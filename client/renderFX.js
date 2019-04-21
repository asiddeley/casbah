/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
**********/

exports.renderFX=function(placeholderID, templateFN, result, delta){
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
};

exports.tool=function(htmlfile){
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

