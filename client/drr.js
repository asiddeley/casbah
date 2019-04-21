/*****
CASBAH 
Contract Administration System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
******/

var create=function(view){
	var app=new Vue({
		data:function(){return {};},
		el:"#"+view.casdo$.attr("id"),
		template:"<DRR></DRR>"		
	});
	return app;
};

exports.activate=function(casbah, template$){
	casbah.creators["drr"]=function(view){return create(view);};
	
	var html=template$.find("#deficiency-review-report-template").html();
	//register drr a global component...  
	Vue.component("DRR", {
		data:function(){return {};},
		//el:"#casdoc-placeholder",
		methods:{
			change_title:function(ev){alert("change title")},
			defic_click:function(ev){cas.edit(ev);},
			defic_delete:function(){}
		},
		template:html
	});	
};

