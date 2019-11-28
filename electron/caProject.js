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
exports.register=register


function register(){
	
///// IMPORTS
//const FSP=require('fs-plus')
const PATH=require('path')
const REMOTE = require('electron').remote
const STORE=require('../electron/storage').store
const SECRET = require('../private/client_secret.json')
const SETTINGS=require('../private/settings.json')
const WM = REMOTE.require(PATH.join(__dirname,'windowManagerExtra.js'))
const windowName=WM.getCurrent().name

//required for store state, mutations
var GoogleSheet	= require('google-spreadsheet')	
var gsProjects = new GoogleSheet(SETTINGS.gsProjectsKey)


var {getOwn, cryptoId, addDays, LocalStore, showAtPointer}=require("../electron/support.js")


function googleAuth(vue){
	gsProjects.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		gsProjects.getRows(1, function(err, rows){
			rows.forEach(function(r){r._rowVariant=''})
			vue.rows=rows
		})
	})	
}	


const local=new LocalStore(
	//path per windowName
	PATH.join(__dirname, '../private', ('/'+windowName+'.json')),
	//object or Constructor
	{projectid:'0', hidden:[], windowName:windowName}		
)

//DEPRECATED
var settings = new LocalStore(		
	PATH.join(__dirname,'../private/caProjects.json'),
	{project:{}, hidden:[]}		
)




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

function CaProjects(no){
	no=no||5
	this.caProjects=[]
	for (var i=0; i<no; i++){
		this.caProjects[i]=new CaProject({index:i})
	}
	this.toArray=function(){return this.caProjects}	
}

///////////////
// STORE
STORE.registerModule('caProject',{
	state:{
		//current project 
		project:local.project||{}
		
	},
	getters:{},
	mutations:{
		project(state, project){
			state.project=project
			local.set('project', project)
		}
		// we can use the ES2015 computed property name feature
		// to use a constant as the function name
		//[SOME_MUTATION] (state) { }	
		
		
	},
	actions:{}		
})	
console.log ('STORE', STORE)

/////////////////////////////
//Register ca-project-menu
//caProject initialized when mounted, accessible to ca-project-menu
var model 
Vue.component('ca-project', {
	data:{
		rows:new CaProjects(5).toArray(),
		fields:[
			{key:'projectno', sortable:true},
			{key:'project', sortable:true},
			{key:'subprojectcode', sortable:true},
			{key:'subproject', sortable:true}
		]
		//projectid:'',
		//project:{}
	},
	STORE,
	props:[],
	template:`
		<div>
			<h1>All Projects</h1>
			<row><strong class='col-sm-4'>Project no.:{{project.projectno}}</strong>
			<strong class='col-sm-4'>Sub-project code:{{project.subprojectcode}}</strong></row>
			<b-table 
				striped 
				hover 
				small 
				:items='rows' 
				:fields='fields'
				@row-clicked='makeProjectCurrent' 
				@row-contextmenu='menuShow'
			></b-table>			
			<ca-project-menu></ca-project-menu>
		</div>`,
	computed:{		
		project(){
			console.log('MODEL', this)
			return STORE.state.caProject.project
		}
		
	},
	methods:{
		makeProjectCurrent(row, index, ev){
			//find currently clicked row
			var current=this.rows.find(function(r){return r.projectid==row.projectid})
			//update store
			STORE.commit('project', current||{})
			
		},		
		DEPmakeProjectCurrent(row, index, event){
			//turn off previous highlight
			var that=this
			var oldCurrent=this.rows.find(function(r){
				return r.projectid==that.projectid
			})
			if(oldCurrent){oldCurrent._rowVariant=''}
			
			//find currently clicked row
			var current=this.rows.find(function(r){return r.projectid==row.projectid})
			//highlight currently clicked row			
			if(current){current._rowVariant='primary'}
			
			//update model
			this.projectid=row.projectid
			this.project=current
			
			//this.$emit('caproject', current)
			
			//update local store
			settings.set('projectid', row.projectid)
			
			//update browser title
			//document.getElementsByTagName('title')[0].innerText='CASBAH ' +
			//'('+row.projectno + '/' + row.projectcode + '/' + row.subprojectcode +')'
		},
		titleText(id){
			return (id==this.projectid)?
			'Current project ( '+id+' )':
			'Click to set as current project'
		},
		menuShow(row, rows, e){showAtPointer(menu, e)}
	},
	mounted(){
		model=this
		//highlight current project
		this.rows.forEach(function(r){
			if (r.projectid==settings.projectid) {
				model.makeProjectCurrent(r)
			}
		})		
	}
})

/////////////////////////////
//Register ca-project-menu
//menu is assigned when component caProjectsMenu is mounted
var menu
Vue.component('ca-project-menu', {
	data(){return{
		visible:false
	}},
	props:[],
	template:`
	<div class='dropdown-menu' v-on:mouseleave='menuHide'>
		<b-dd-item v-on:click='googleAuth();menuHide;'><a href='#'>Google Auth</a></b-dd-item>
		<b-dd-item v-on:click='alert("Create record");menuHide' href='#'><a href='#'>Create record</a></b-dd-item>
		<b-dd-item v-on:click='alert(project.toString(menuData));menuHide'><a href='#'>Read record</a></b-dd-item>
		<b-dd-item v-on:click='alert(project.toString(menuData));menuHide'><a href='#'>Update record</a></b-dd-item>
		<b-dd-item v-on:click='alert(project.toString(menuData));menuHide'><a href='#'>Delete record</a></b-dd-item>
		<li><hr/></li>
		<b-dd-item v-on:click='alert("Delete record");menuHide'>Hide record</b-dd-item>
		<b-dd-item v-on:click='alert("Unhide record");menuHide'>Unhide record</b-dd-item>
		<b-dd-item v-on:click='alert("Show hidden records");menuHide'>Show hidden records</b-dd-item>
		<b-dd-item v-on:click='alert("Show unhidden records");menuHide'>Show unhidden records</b-dd-item>
	</div>`,

	methods:{			
		alert(msg){alert(msg)},
		menuHide(){this.$el.style.display = "none"},
		googleAuth(){googleAuth(caProjects)}
	},
	mounted(){menu=this}
})





	
} //REGISTER


