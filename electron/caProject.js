/**********************************
CASBAH
Contract Admin Site Be Architectural Heroes
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

///// EXPORTS
exports.element='ca-project'
exports.name='caProject'
exports.title='CA Project Log'
exports.register=function(){
	
///// IMPORTS
//const FSP=require('fs-plus')
const PATH=require('path')
const REMOTE = require('electron').remote
const STORE=require('../electron/storage').store
const SECRET = require('../private/client_secret.json')
const SETTINGS=require('../private/settings.json')
const WM = REMOTE.require(PATH.join(__dirname,'windowManagerExtra.js'))
const windowName=WM.getCurrent().name
const LOCALSTORE=PATH.join(__dirname, '../private', ('/'+windowName+'.json'))


//required for store state, mutations
var GoogleSheet	= require('google-spreadsheet')	
var gsProjects = new GoogleSheet(SETTINGS.gsProjectsKey)


var {addDays, getSamples, cryptoId, getOwn, LocalStore, showAtPointer}=require("../electron/support.js")


function googleAuth(vue){
	gsProjects.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		gsProjects.getRows(1, function(err, rows){
			rows.forEach(function(r){r._rowVariant=''})
			vue.rows=rows
		})
	})	
}	


// caProject SCHEMA
function CaProject({projectid, projectno, projectcode, days, index}){	
	var today=new Date()
	var future=addDays(today, days||365)
	//random id with high probability of uniqueness
	this.projectid=projectid||cryptoId()
	this.projectno=projectno||['PRO-001', 'PRO-001', 'PRO-002', 'PRO-003'][index %4]
	this.projectcode=projectcode||['CB', 'CB', 'MB', 'OB'][index % 4]
	this.project=['Casbah Bldg', 'Casbah Bldg', 'My Bldg', 'Other Bldg'][index % 4] 
	this.subprojectcode=projectcode||"TV"
	this.subproject='The Ville'
	this.address="101 Desert Way"
	this.ownercode="Casbah"
	this.contractorcode="CasbahCon"
	this.start=today.toString().substring(0,15)
	this.finish=future.toString().substring(0,15)
	this.status="ongoing"
	this.permit="19 123456 00 00 BA"
	this.occupancy="TBD"
	this.areasm="TBD"
	this.cost="TBD"
	this.about="TBD"
	this._rowVariant=''
}

CaProject.prototype.toString=function(data){
	var project=data||this
	return Object.getOwnPropertyNames(this).map(function (val, index, array) {
		return (val + ' -> ' + project[val])
	}).join('\n')
}


//////////
// LOCAL CACHE
const local=new LocalStore(
	//localstore path based on windowName, ie. separate cache for each window
	LOCALSTORE,
	//default content object or Constructor
	{
		windowName:windowName, 
		projectindex:0, 
		projects:getSamples(CaProject, 5), 
		hidden:[]
	},
	true
)

local.set() //force a local save


///////////////
// STORE
STORE.registerModule('caProject',{
	state:{
		projectindex:local.projectindex||3,
		projects:local.projects||[]
	},
	getters:{
		//project(){return this.state.project},
		//projects(){return this.state.projects}		
	},
	mutations:{
		setProject(state, projectindex){
			state.projectindex=projectindex
			local.set('projectindex', projectindex)
		},
	},
	actions:{	



	
	}		
})	


/////////////////////
//Register ca-project
//caProject initialized when mounted, accessible to ca-project-menu
var model 
Vue.component('ca-project', {
	//Vuex STORE replaces Vue data property
	STORE, 
	template:
	`<div>
		<h2>CA Projects</h2>
		<b-table striped hover small 
			:items='projects' 
			:fields='fields'
			@row-clicked='setProject' 
			@row-contextmenu='menuShow'
		></b-table>			
		<ca-project-menu></ca-project-menu>
	</div>`,
	computed:{		
		project(){
			//console.log('MODEL', this)
			var i=STORE.state.caProject.projectindex
			return STORE.state.caProject.projects[i]
		},
		projects(){return STORE.state.caProject.projects},
		fields(){return[
			{key:'projectno', label:'Project Code', sortable:true},
			{key:'project', label:'Project Name', sortable:true},
			{key:'subprojectcode', label:'Sub Code', sortable:true},
			{key:'subproject', label:'Sub Name', sortable:true}
		]}		
	},
	methods:{
		highlightCurrent(){
			this.projects.forEach(function(p,i){
				if (i==STORE.state.caProject.projectindex){p._rowVariant=windowName}
				else {p._rowVariant=''}
			})
		},
		setProject(row, index, ev){
			STORE.commit('setProject', index)
			this.highlightCurrent()	
		},
		titleText(id){
			return (id==this.projectid)?
			'Current project ( '+id+' )':
			'Click to set as current project'
		},
		menuShow(row, rows, e){menu.project=row; showAtPointer(menu, e)}
	},
	mounted(){
		model=this
		this.highlightCurrent()
	}
})

/////////////////////////////
//Register ca-project-menu
//menu is assigned when component caProjectsMenu is mounted
var menu
Vue.component('ca-project-menu', {
	data(){return{
		//visible:false,
		project:{}
	}},
	props:[],
	template:
	`<div class='dropdown-menu' v-on:mouseleave='menuHide'>
		<b-dd-item v-on:click='googleAuth();menuHide;'><a href='#'>Google Auth</a></b-dd-item>
		<b-dd-item v-on:click='alert("Create...");menuHide' href='#'><a href='#'>Create record</a></b-dd-item>
		<b-dd-item v-on:click='alert(project.toString());menuHide'><a href='#'>Read record</a></b-dd-item>
		<b-dd-item v-on:click='alert("update...");menuHide'><a href='#'>Update record</a></b-dd-item>
		<b-dd-item v-on:click='alert("delete...");menuHide'><a href='#'>Delete record</a></b-dd-item>
		<li><hr/></li>
		<b-dd-item v-on:click='alert("Hide...");menuHide'>Hide record</b-dd-item>
		<b-dd-item v-on:click='alert("Unhide...");menuHide'>Unhide record</b-dd-item>
		<b-dd-item v-on:click='alert("Show hidden...");menuHide'>Show hidden records</b-dd-item>
		<b-dd-item v-on:click='alert("Show unhidden...");menuHide'>Show unhidden records</b-dd-item>
	</div>`,

	methods:{			
		alert(msg){alert(msg)},
		menuHide(){this.$el.style.display = "none"},
		googleAuth(){googleAuth(caProjects)}
	},
	computed:{
		project(){}
		
	},
	mounted(){menu=this}
})





	
} //REGISTER


