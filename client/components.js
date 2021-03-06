/*****
CASBAH 
Contract Administration System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
******/

//var Vue=require("../node_modules/vue");
var drr=require("./drr");

var casdoc=function(casbah, template$){
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

var project_block=function(casbah, template$){
	var html=template$.find("#project-block-template").html();
	Vue.component("project-block", {
		data:function(){return {project:{
			pronum:"12-345", 
			name:"Bldg", 
			address:"123 Avenue St",
			contractor:"casbahcon",
			permit:"12-123-456"
		}};},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");}
		},
		template:html
	});	
}

var title_block=function(casbah, template$){
	var html=template$.find("#title-block-template").html();
	//create Vue component
	Vue.component("title-block", {
		data:function(){
			//return cas.select(pronum, casdoc, docnum);			
			return {
			docnum:"DRR-A01",
			date:"13-Apr-2019",
			date_issued:"13-Apr-2019",
			author:"ASiddeley",
			misc_key:"Weather",
			misc_valu:"Sunny 15C"};
		},
		methods:{
			logo_click:function(ev){alert("change logo...");},
			title_click:function(ev){alert("change logo...");},
			edit:function(ev){
				var vue=this;
				console.log("edit", $(ev.target).attr("field"));
				//editor defined in casdocs.activate();
				editor.text(ev.target, function(field, oldtext, newtext){
					console.log("field:",field,", oldtext:",oldtext,", newtext:",newtext);
					console.log("vue[field]=",vue[field]);
					vue[field]=newtext;
					editor.hide();
					//vue[field]=text;
					//cas.update(pronum, casdoc, docnum, field, valu);
				});				
			},
			menu:function(){
				//camel.showMenu(event, camel.getCDI().docnum_menu)
			}
		},
		template:html
	});	
}

var comment_section=function(casbah, template$){
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

var image_section=function(casbah, template$){
	var html=template$.find("#image-section-template").html();
	Vue.component("image-section",{
		props:["comment"],
		template:html
	});
};

var signature=function(casbah, template$){
	var html=template$.find("#signature-template").html();
	Vue.component("signature",{
		template:html
	});
};

var welcome=function(casbah, template$){
	casbah.doctype("welcome", function(doc){
	
		var vue=new Vue({
			data:{
				vname:"*unnamed*",
				pronum:"*none*",
				projects:["*empty*"]
			},
			el:doc.el(),
			methods:{getDoc:function(){return doc;}},
			template:"<welcome v-bind:projects='projects' v-bind:vname='vname' v-bind:pronum='pronum'></welcome>"
		});

		casbah.query("projects").run(
			//override success function
			function(r){
				if (typeof r!="undefined"){vue.projects=r.data.pronum;}
				vue.vname=doc.name;
				vue.pronum=doc.options.pronum;
			}
		);

		return vue;
	});
	
	var html=template$.find("#welcome-template").html();
	Vue.component("welcome",{
		props:["projects", "vname", "pronum"],
		methods:{
			pronumChange:function(ev){
				console.log("change pronum...");
				this.$parent.pronum=$(ev.target).text();
				this.$parent.getDoc().options.pronum=$(ev.target).text();
			}				
		},
		
		template:html
	});
};



//PUBLIC

//async 
exports.activate=function(casbah, callback){
	console.log("components.activate() started...");

	editor=new casbah.Editor();
	
	var template$=$("<div></div>").appendTo("body");
	template$.attr("id","casdoc-templates");
	//template$.css("display","none");
	
	template$.load("client/components.html", function(){	
		//register components...
		project_block(casbah, template$);
		title_block(casbah, template$);
		comment_section(casbah, template$);
		image_section(casbah, template$);
		signature(casbah, template$);
		//default splash screen
		welcome(casbah, template$);
		//casdocs...
		drr.activate(casbah, template$);
		
		console.log("components.activate() done.");
		callback();
	});
};






