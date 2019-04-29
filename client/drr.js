/*****
CASBAH 
Contract Administration System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
******/

var drrCreator=function(view){
	//queries
	var q1=casbah.queries.project.clone(
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
 		//casdok:"drr", //also in view.options
		//docnum:1, //also in view.options
		//pronum:1, //also in view.options
		action:"select",
		name:"drr",
		desc:"Selects all DRRs",
		pronum:casbah.current("pronum"),
		docnum:casbah.current("docnum"),
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

