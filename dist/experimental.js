(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**********************************
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
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

window.casbahVue=function(){
	var r={};
	
	r.casdocs=require("./casdocs");

	return r;
}();

},{"./casdocs":2}],2:[function(require,module,exports){

/**********************************
CASBAH 
Contract Administration System Be Architectural Heroes
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

//var Vue=require("../node_modules/vue");
var drr=require("./drr");
var cas;
//var casdocsHTML=

var casdoc=function(template$){
	var html=template$.find("#casdoc-template").html();
	console.log("casdoc", html);
	Vue.component("casdoc", {
	//var vue=new Vue({
		data:function(){return {title:"casdoc"};},
		//el:"#casdoc-placeholder",
		methods:{
			logo_click:function(ev){alert("change logo...");},
			change_title:function(){this.title=prompt("title:");}
		},
		template:html
	});	
	return vue;
};

var project_block=function(template$){
	var html=template$.find("#project-block-template").html();
	Vue.component("project-block", {
		data:function(){return {};},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});	
}

var title_block=function(template$){
	var html=template$.find("#title-block-template").html();
	Vue.component("title-block", {
		data:function(){return {};},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});	
}

var comment_section=function(template$){
	var html=template$.find("#comment-item-template").html();
	
	Vue.component("comment-item",{
		props:["comment"],
		template:html
	});

	var html=template$.find("#comment-section-template").html();
	
	Vue.component("comment-section", {
		data:function(){return {comments:[{no:1, text:"hello", ref:"--"}]};},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});
}

var image_section=function(template$){
	var html=template$.find("#image-section-template").html();
	Vue.component("image-section",{
		props:["comment"],
		template:html
	});
};

var signature=function(template$){
	var html=template$.find("#signature-template").html();
	Vue.component("signature",{
		template:html
	});
};


exports.activate=function(casbah){
	console.log("casdocs.activate() started...");
	cas=casbah;
	var template$=$("<div></div>").appendTo("body");
	template$.attr("id","casdoc-templates");
	template$.css("display","none");
	template$.load("client/casdocs.html", function(){	
		//register components...
		//casdoc(template$);
		project_block(template$);
		title_block(template$);
		comment_section(template$);
		image_section(template$);
		signature(template$);
		drr.activate(casbah, template$);
		console.log("casdocs.activate() done.");
	});
	//return app
};







},{"./drr":3}],3:[function(require,module,exports){

/**********************************
CASBAH 
Contract Administration System Be Architectural Heroes
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

//var Vue=require("../node_modules/vue");
var cas;




exports.activate=function(casbah, template$){
	cas=casbah;
	var html=template$.find("#deficiency-review-report-template").html();
	var app=new Vue({
	//register a global component...  
	//Vue.component("DRR", {
		data:function(){return {};},
		el:"#casdoc-placeholder",
		methods:{
			change_title:function(ev){alert("change title")},
			defic_click:function(ev){cas.edit(ev);},
			defic_delete:function(){}
		},
		template:html
	});	

	
	return app
};







},{}]},{},[1]);
