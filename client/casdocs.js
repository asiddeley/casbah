
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
const drr=require("./drr");
var cas;

var casdoc=function(){
	Vue.component("casdoc", {
		data:{},
		el:"casdoc_placeholder",
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:`<div>
			<img src="./uploads/logo.png" style="width:100px; float:left;"></img>
			<h2 id="casdoc-title" style="float:right;">{{title}}</h2>
			<div id="casdoc-content">casdoc content goes here...</div>
		</div>`
	});	
};

var projectBlock=function(){
	Vue.component("project-block", {
		data:{},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:`
			<div class="row row__">
				<strong class="col-xs-4">Project No:</strong>
				<p class="col-xs-8">{{project_id}}</p>
			</div>

			<div class="row row">
				<strong class="col-xs-4">Project Name:</strong>
				<p class="col-xs-8">{{project_name}}</p>
			</div>

			<div class="row row">
				<strong class="col-xs-4">Project Address:</strong>
				<p class="col-xs-8">{{address}}</p>
			</div>

			<div class="row row">
				<strong class="col-xs-4">Contractor:</strong>
				<p class="col-xs-8">{{contractor}}</p>
			</div>

			<div class="row row">
				<strong class="col-xs-4">Permit No:</strong>
				<p id="svr-permit" class="col-xs-8">{{permit}}</p>
			</div>`
	});	
}

var titleBlock=function(){
	Vue.component("title-block", {
		data:{},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:`
			<div class="row row__">
				<strong class="col-xs-4">Report No:</strong>
				<p class="col-xs-8"
				title="click for options..."
				field="docnum"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.showMenu(event, camel.getCDI().docnum_menu)">{{docnum}}</p>
			</div>

			<div class="row row">
				<strong id="svr-date" class="col-xs-4">Date of Visit:</strong>
				<p class="col-xs-8"
				title="click to edit, then double-click to save..."
				field="date"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.getCDI().titleblock_right_edit(this)">{{date}}</p>
			</div>

			<div class="row row">
				<strong  class="col-xs-4">Date Issued:</strong>
				<p class="col-xs-8"	
				title="click to edit, then double-click to save..."
				field="date_issued"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.getCDI().titleblock_right_edit(this)">{{date_issued}}</p>
			</div>

			<div class="row row">
				<strong  class="col-xs-4">Reviewer:</strong>
				<p class="col-xs-8"	
				title="click to edit, then double-click to save..."
				field="author"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.getCDI().titleblock_right_edit(this)">{{author}}</p>
			</div>

			<div class="row row">
				<strong class="col-xs-4"
				title="click to edit, then double-click to save..."
				field="misc_key"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.getCDI().titleblock_right_edit(this)">{{#if misc_key}}{{misc_key}}{{else}}--{{/if}}</strong>
				<p class="col-xs-8"
				title="click to edit, then double-click to save..."
				field="misc_valu"
				onmouseenter="$(this).addClass('highlite')"
				onmouseleave="$(this).removeClass('highlite')"
				onclick="camel.getCDI().titleblock_right_edit(this)">{{#if misc_valu}}{{misc_valu}}{{else}}--{{/if}}</p>
			</div>
			`
	});	
}

exports.activate=function(casbah){
	cas=casbah;
	//register components...
	casdoc();
	projectBlock();
	titleBlock();
	drr.activate();


	
	//return app
};






