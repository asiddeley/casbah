/*****
CASBAH 
Contract Administration System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
******/

var drrCreator=function(view){
	//queries
	var q1=casbah.queries.project.clone(view.options,
		{
			pronum:casbah.current("pronum"),
			success:function(r){
				//r={files:[], folders:["name1", "name2"], data:{}}	
				console.log("drr query for project data success...");
				app.project.pronum=r.data.pronum;
				app.project.name=r.data.name;
			}
		}
	);

	var q2=new casbah.Query(view.options, {
 		//casdok:"drr", //from view.options
		//docnum:1, //from view.options
		//pronum:1, //from view.options
		//pronum:casbah.current("pronum"), //from view.options
		//docnum:casbah.current("docnum"), //from view.options
		action:"select",
		alias:"DRRselect",
		title:"Selector of DRR data & files",
		success:function(r){
			console.log("drr query for document data success...");
			app.deficiencies=r.data.deficiencies;
		}
	});	
	
	//vue instance
	var app=new Vue({
		data:{project:{
			pronum:"12-345",
			name:"Casbah Building",
			address:"123 Avenue St",
			contractor:"CasbahCon",
			permit:"12-123-456",
			deficiencies:[{no:"", note:"", status:""}],
			images:[]
		}},
		//best lifecycle hook to run queries and set variables 
		mounted:function(){q1.run(); q2.run();},
		//vue element or place
		el:view.el(),
		template:"<DRR v-bind:project='project'></DRR>"		
	});

	//app.render();
	
	return app;
};

exports.activate=function(casbah, template$){
	//add the DRR document creator to casbah for viewer to use when needed
	//casbah.creators["drr"]=function(view){return drrCreator(view);};
	casbah.creator("drr", function(view){return drrCreator(view);});
	
	//get template html file
	//var html=template$.find("#deficiency-review-report-template").html();
	
	//register drr a global component...  
	Vue.component("DRR", {
		data:function(){return {};},
		props:["project"],
		methods:{
			change_title:function(ev){alert("change title")},
			defic_click:function(ev){cas.edit(ev);},
			defic_delete:function(){}
		},
		template:template$.find("#deficiency-review-report-template").html()
	});	
};

