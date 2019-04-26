/*****
CASBAH 
Contract Administration System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
******/

var create=function(view){
	var app=new Vue({
		data:function(){return {project:{
			project_id:"12-345", 
			project_name:"Bldg", 
			address:"123 Avenue St",
			contractor:"casbahcon",
			permit:"12-123-456"
		}};},
		el:"#"+view.el$.attr("id"),
		template:"<DRR v-bind:project='project'></DRR>"		
	});
	return app;
};

exports.activate=function(casbah, template$){
	casbah.creators["drr"]=function(view){return create(view);};
	
	var html=template$.find("#deficiency-review-report-template").html();
	//register drr a global component...  
	Vue.component("DRR", {
		data:function(){return {};},
		methods:{
			change_title:function(ev){alert("change title")},
			defic_click:function(ev){cas.edit(ev);},
			defic_delete:function(){}
		},
		template:html
	});	
};

