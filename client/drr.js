
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

const Vue=require("../node_modules/vue");
var cas;




exports.activate=function(casbah){
	cas=casbah;
	//var app=new Vue({
	//register a global component...  
	Vue.component("DRR", {
		data:{},
		el:"casdoc-content",
		methods:{
			defic_click:function(ev){cas.edit(ev);},
			defic_delete:function(){}
		},
		template:`<project-block></project-block>
			<title-block></title-block>
			<p>This report is a general review of progress and construction activities on site.  Architectural Work was visually reviewed on a random basis for general conformity with Architectural Contract Documents prepared by this firm.  Refer also to Mechanical and Electrical field reports issued separately.<p>
			<comment-section></comment-section>
			<image-section></image-section>
			<signature></signature>`
	});	

	
	//return app
};






