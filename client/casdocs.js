
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

var casdoc=function(){
	Vue.component("casdoc", {
		data:{title:"casdoc"},
		el:"casdoc_placeholder",
		methods:{
			logo_click:function(ev){alert("change logo...");},
			change_title:function(){this.title=prompt("title:");}
		},
		template:`<div>
			<img src="./uploads/logo.png" style="width:100px; float:left;"></img>
			<h2 id="casdoc-title" v-on:click="change_title" style="float:right;">{{title}}</h2>
			<div id="casdoc-content">casdoc content goes here...</div>
		</div>`
	});	
};

var project_block=function(){
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

var title_block=function(){
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


var comment_section=function(){
	Vue.component("comment-item",{
		props:["comment"],
		template:`
			<div class="row">
			<p class="col-xs-1 marz">{{comment.no}}</p>
			<p class="col-xs-10 border-left marz">{{comment.text}}</p>
			<p class="col-xs-1 border-left marz">{{comment.ref}}</p>
			</div>		
		`			
	});
	
	Vue.component("comment-section", {
		data:{comments:[{no:1, text:"hello", ref:"--"}]},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:`
			<div class="row">
			<h3 class="col-xs-1 marz">No.</h3>
			<h3 class="col-xs-10 border-left marz">Comment</h3>
			<h3 class="col-xs-1 border-left marz">Ref</h3>
			</div>			
			<comment-item
				v-for="item in comments"
				v-bind:comment="item"
				v-bind:key="item.no">
			</comment-item>`
	});
}


var image_section=function(){
	Vue.component("image-section",{
		props:["comment"],
		template:`<h3>Image section...</h3>`
	});
}

var signature=function(){
	Vue.component("signature",{
		template:`<h3>Signature</h3>
		<p>A Siddeley</p>
		<p>date:10-Apr-2019</p>
		`
	});
}

	
exports.activate=function(casbah){
	console.log("casdocs.activate() started...");
	cas=casbah;
	//register components...
	casdoc();
	project_block();
	title_block();
	comment_section();
	image_section();
	signature();
	drr.activate();
	console.log("casdocs.activate() done.");

	
	//return app
};






