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
const FSP=require('fs-plus')
const PATH=require('path')

var remote = require('electron').remote
var windowManager = remote.require('electron-window-manager')

var GoogleSheet	= require('google-spreadsheet')	
var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
var secret = require('../private/client_secret.json')

var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")

function googleAuth(vue){
	gsProjects.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		gsProjects.getRows(1, function(err, rows){
			rows.forEach(function(r){r._rowVariant=''})
			casbahVue.rows=rows
		})
	})	
}	

function Project({projectid, projectno, projectcode, days}){	
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

Project.prototype.toString=function(data){
	var project=data||this
	return Object.getOwnPropertyNames(this).map(function (val, index, array) {
		return (val + ' -> ' + project[val])
	}).join('\n')
}

Project.prototype.template=function(){
	return ("<b-table striped hover small :items='rows' :fields='fields' @row-clicked='click' @row-contextmenu='menu'></b-table>")
}


//project instance used for its prototype functions ie. project.toString(data) 
var project=new Project({})

function menuShow(row, index, e) {
	//console.log('CONTEXT MENU',e)	
	e.preventDefault()	
	casbahVue.menuData=row||{}
	var wx=window.innerWidth, wy=window.innerHeight, sx=window.scrollX, sy=window.scrollY
	var menu = document.getElementById("CONTEXT-MENU")
	menu.style.display = 'block'
	//var mx=menu.clientWidth, my=menu.clientHeight
	var mx=menu.scrollWidth, my=menu.scrollHeight
	//console.log('menu mx, my:', mx, my, menu)
	//menu.style.left = e.pageX + 'px'
	menu.style.left=((e.pageX + mx > wx && mx < e.pageX)?e.pageX+sx-mx:e.pageX+sx )+'px'
	//menu.style.top = e.pageY + 'px'
	menu.style.top=((e.pageY + my > wy && my < e.pageY)?e.pageY+sy-my:e.pageY+sy)+'px'

}

Vue.component('ca-projects',{
	data:function(){},
	props:['rows','fields','click','menu'],
	template:`<b-table striped hover small 
	:items='rows' 
	:fields='fields'
	@row-clicked='click' 
	@row-contextmenu='menu'
	></b-table>`,
})


///// EXPORTS
exports.ready=function(){

	var settings = new LocalStore(		
		PATH.join(__dirname,'../private/settings.json'),
		{projectid:'0', hidden:[]}		
	)
	
	casbahVue=new Vue({
		el:'#CASBAH',
		data:{
			title:'click',
			hoverText:'click to select',
			rows:[
				new Project({projectid:'101', projectno:'P-101'}), 
				new Project({projectid:'102', projectno:'P-102'}),
				new Project({projectid:'103', projectno:'P-103'})
			],
			fields:[
				{key:'projectno', sortable:true},
				{key:'project', sortable:true},
				{key:'subprojectcode', sortable:true},
				{key:'subproject', sortable:true}
			],
			projectid:settings.projectid,
			caProjects:true,			
			menuData:{},
			//utility
			project:project
		},	
		methods:{
			alert(msg){alert(msg)},
			googleAuth(){googleAuth(this)},			
			makeProjectCurrent(row, index, event){
				//turn off previous highlight
				var vue=this
				var oldCurrent=this.rows.find(function(r){return r.projectid==vue.projectid})
				if(oldCurrent){oldCurrent._rowVariant=''}
				
				//highlight currently clicked row
				var current=this.rows.find(function(r){return r.projectid==row.projectid})
				if(current){current._rowVariant='primary'}
				
				//update model
				vue.projectid=row.projectid
				
				//update local store
				settings.set('projectid', row.projectid)
				
				//update browser table
				document.getElementsByTagName('title')[0].innerText='CASBAH ' +
				'('+row.projectno + '/' + row.projectcode + '/' + row.subprojectcode +')'
			},
			titleText(id){
				return (id==this.projectid)?
				'Current project ( '+id+' )':
				'Click to set as current project'
			},
			menuShow:menuShow,
			menuHide:function () {
				document.getElementById("CONTEXT-MENU").style.display = "none"
			}			
			
		}
	})
	
	//highlight current project
	casbahVue.rows.forEach(function(r){
		if (r.projectid==settings.projectid) {casbahVue.makeProjectCurrent(r)}
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return {casbahVue:casbahVue}
} 

