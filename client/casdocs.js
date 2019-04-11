
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

var Vue=require("../node_modules/vue");
var drr=require("./drr");
var cas;
//var casdocsHTML=

var casdoc=function(template$){
	var html=template$.find("#casdoc-template");
	Vue.component("casdoc", {
		data:{title:"casdoc"},
		el:"casdoc_placeholder",
		methods:{
			logo_click:function(ev){alert("change logo...");},
			change_title:function(){this.title=prompt("title:");}
		},
		template:html
	});	
};

var project_block=function(template$){
	var html=template$.find("#project-block-template");
	Vue.component("project-block", {
		data:{},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});	
}

var title_block=function(template$){
	var html=template$.find("#title-block-template");
	Vue.component("title-block", {
		data:{},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});	
}

var comment_section=function(template$){
	var html=template$.find("#comment-item-template");
	
	Vue.component("comment-item",{
		props:["comment"],
		template:html
	});

	var html=template$.find("#comment-section-template");
	
	Vue.component("comment-section", {
		data:{comments:[{no:1, text:"hello", ref:"--"}]},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});
}

var image_section=function(template$){
	var html=template$.find("image-section-template");
	Vue.component("image-section",{
		props:["comment"],
		template:html
	});
};

var signature=function(template$){
	var html=template$.find("signature-template");
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
	template$.load("client/casdocs.html");
	
	//register components...
	casdoc(template$);
	project_block(template$);
	title_block(template$);
	comment_section(template$);
	image_section(template$);
	signature(template$);
	drr.activate(casbah, template$);
	console.log("casdocs.activate() done.");
	
	//return app
};






