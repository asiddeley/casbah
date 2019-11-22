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

///// IMPORTS
const PATH=require('path')
//var GoogleSheet	= require('google-spreadsheet')	
//var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
//var secret = require('../private/client_secret.json')

var {getOwn, cryptoId, addDays, LocalStore, showAtPointer}=require("../electron/support.js")



function CaCRR({projectid, projectno, projectcode, days}){	
	var today=new Date()
	var future=addDays(today, days||365)
	//random id with high probability of uniqueness
	this.projectid=projectid||cryptoId()
	this.projectno=projectno||"PRO-001"
	this.projectcode=projectcode||"CASA"
	this.project="Casbah Building"
	this.subprojectcode=projectcode||"TV"
	this.subproject="The Ville"
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

CaCRR.prototype.toString=function(data){
	var project=data||this
	return Object.getOwnPropertyNames(this).map(function (val, index, array) {
		return (val + ' -> ' + project[val])
	}).join('\n')
}

var settings = new LocalStore(PATH.join(__dirname,'../private/CaCRR.json'), {projectid:'0', hidden:[]})

//make caProject instance when mounted, accessible so caProjectMenu
var caSVR
Vue.component('ca-svr', {
	data:function(){return {
		rows:[
			new CaCRR({projectid:'100', projectno:'P-100'}), 
			new CaCRR({projectid:'100', projectno:'P-100'}),
			new CaCRR({projectid:'100', projectno:'P-100'})
		],
		fields:[
			//{key:'projectno', sortable:true},
			//{key:'project', sortable:true},
			//{key:'subprojectcode', sortable:true},
			//{key:'subproject', sortable:true}
		],	
	}},
	props:[],
	template:`
		<div>
			<h1>Site Visit Report</h1>
			<b-table 
				striped 
				hover 
				small 
				:items='rows' 
				:fields='fields'
				@row-clicked='makeProjectCurrent' 
				@row-contextmenu='menuShow'
			></b-table>			
			<ca-crr-menu></ca-crr-menu>
		</div>`,
	methods:{
		makeProjectCurrent(row, index, event){
			//turn off previous highlight
			var that=this
			var oldCurrent=this.rows.find(function(r){return r.projectid==that.projectid})
			if(oldCurrent){oldCurrent._rowVariant=''}
			
			//highlight currently clicked row
			var current=this.rows.find(function(r){return r.projectid==row.projectid})
			if(current){current._rowVariant='primary'}
			
			//update model
			this.projectid=row.projectid
			this.$emit('currentProject', row.projectid)
			
			//update local store
			settings.set('projectid', row.projectid)
			
			//update browser title
			document.getElementsByTagName('title')[0].innerText='CASBAH ' +
			'('+row.projectno + '/' + row.projectcode + '/' + row.subprojectcode +')'
		},
		titleText(id){
			return (id==this.projectid)?
			'Current project ( '+id+' )':
			'Click to set as current project'
		},
		menuShow(row, rows, e){showAtPointer(menu, e)}
	},
	mounted(){
		caCRR=this
		//highlight current project
		this.rows.forEach(function(r){
			if (r.projectid==settings.projectid) {
				caCRR.makeProjectCurrent(r)
			}
		})		
	}
})

// menu is assigned when component caProjectsMenu is mounted
var menu
Vue.component('ca-crr-menu', {
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

///// EXPORTS
exports.name='caSVR'
exports.title='Site Visit Report'