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
exports.register=function(casbahVue){
	
///// IMPORTS
const PATH=require('path')
const REMOTE = require('electron').remote
const STORE=require('../electron/storage').store

//try {
	const SETTINGS=require('../private/settings.json')
//}
//catch(err){
//	casbahVue.switchTo('ca-error',{msg:'missing '})
//	return false
//}	

const WM = REMOTE.require(PATH.join(__dirname,'windowMaster.js'))
const windowName=WM.getCurrent().name
const LOCALSTORE=PATH.join(__dirname, '../private', ('/'+windowName+'.json'))
const SF=require("../electron/support.js")
const GS=require('google-spreadsheet')	
const gsProjects = new GS(SETTINGS.gsProjectsKey)

try {const SECRET = require('../private/client_secret.json')}
catch(err){
	casbahVue.switchTo(casbahVue, 'ca-error',{msg:'client_secret.json missing, see setup page'})
	return false
}


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
	var future=SF.addDays(today, days||365)
	//random id with high probability of uniqueness
	this.projectid=projectid||SF.cryptoId()
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
const local=new SF.LocalStore(
	//localstore path based on windowName, ie. separate cache for each window
	LOCALSTORE,
	//default content object or Constructor
	{
		windowName:windowName, 
		projectindex:0, 
		projects:SF.getSamples(CaProject, 5), 
		hidden:[]
	},
	false
)

local.set() //force a local save


///////////////
// STORE
STORE.registerModule('caProject',{
	state:{
		projectindex:local.projectindex||3,
		projects:local.projects||[],
	},
	getters:{
		//project(){return this.state.project},
		//projects(){return this.state.projects}		
	},
	//commit('mutation'...)
	mutations:{
		setProjectindex(state, projectindex){
			state.projectindex=projectindex
			local.set('projectindex', projectindex)
		},
		updateProject(state, projectMutation){
			//find matching project by id and merge
			state.projects.forEach(function(project){
				if (project.projectid==projectMutation.projectid){
					//console.log('Changing...', project.projectid)
					Object.assign(project, projectMutation)
					local.set('projects', state.projects)
				}				
			})		
		}
	},
	//dispatch('aciton'...)
	actions:{	



	
	}		
})	


/////////////////////
//Register ca-project

Vue.component(exports.element, {
	//Vuex STORE replaces Vue data property
	STORE, 
	template:
	`<div>
		<h2>Ca Project</h2>
		<b-table striped hover small :items='projects' :fields='fields' @row-clicked='menu'>
		</b-table>			
		<div class='dropdown-menu' size='sm' text='small' v-on:mouseleave='menuHide'  ref='ca-project-menu'>
			<b-dd-item v-on:click='authenticate();menuHide;'><a href='#'>Authenticate</a></b-dd-item>
			<b-dd-item v-on:click='activeProject();menuHide' href='#'><a href='#'>Active Project</a></b-dd-item>
			<b-dd-item v-on:click='alert("Create...");menuHide();' href='#'><a href='#'>Create</a></b-dd-item>
			<b-dd-item v-on:click='read();menuHide'><a href='#'>Read</a></b-dd-item>
			<b-dd-item v-on:click='update(); menuHide'><a href='#'>Update</a></b-dd-item>
			<b-dd-item v-on:click='alert("delete...");menuHide'><a href='#'>Delete</a></b-dd-item>
			<li><hr/></li>
			<b-dd-item v-on:click='alert("Hide...");menuHide'>Hide record</b-dd-item>
			<b-dd-item v-on:click='alert("Unhide...");menuHide'>Unhide record</b-dd-item>
			<b-dd-item v-on:click='alert("Show hidden...");menuHide'>Show hidden records</b-dd-item>
			<b-dd-item v-on:click='alert("Show unhidden...");menuHide'>Show unhidden records</b-dd-item>
		</div>	
	</div>`,
	computed:{		
		project(){
			var i=STORE.state.caProject.projectindex
			return STORE.state.caProject.projects[i]
		},
		projects(){return STORE.state.caProject.projects},
		fields(){return[
			{key:'projectno', label:'Project Code', sortable:true},
			{key:'project', label:'Project Name', sortable:true},
			{key:'subprojectcode', label:'Sub Code', sortable:true},
			{key:'subproject', label:'Sub Name', sortable:true}
		]},
	
		//menuStyle(){return {display:'none', 'z-index':999}},
		//menuRow:{}	
	},
	methods:{
		alert(msg){
			casbahVue.component('ca-alert', {
				msg:msg,			
				callback:function(){casbahVue.component('ca-project')}
			})
		},		
		highlightCurrent(){
			this.projects.forEach(function(p,i){
				if (i==STORE.state.caProject.projectindex){p._rowVariant='primary'}
				else {p._rowVariant=''}
			})
		},
		titleText(id){
			return (id==this.projectid)?
			'Current project ( '+id+' )':
			'Click to set as current project'
		},
		menu(row, rows, e){
			this.hotRow=row
			SF.menuAtPointer(this.$refs['ca-project-menu'], e)
		},
		menuHide(){			
			this.$refs['ca-project-menu'].style.display='none'
		},
		authenticate(){googleAuth(caProjects)},
		activeProject(){
			var index=STORE.state.caProject.projects.indexOf(this.hotRow)
			//console.log('INDEX:',index)
			STORE.commit('setProjectindex', index)
			this.highlightCurrent()	
		},
		read(){
			var that=this
			casbahVue.switchTo('ca-quick-table',{
				rows:SF.pivot(that.hotRow,'Heading','Content'),		
				onReturn:function(){casbahVue.switchTo('ca-project')}
			})
		},
		update(){
			var that=this
			casbahVue.switchTo('ca-quick-form',{
				row:that.hotRow,			
				onSave:function(result){
					STORE.commit('updateProject', result)
					casbahVue.switchTo('ca-project')
				},
				onCancel:function(){casbahVue.switchTo('ca-project')}
			})
		}
	},
	mounted(){
		this.highlightCurrent()
	}
})

	
} //REGISTER


