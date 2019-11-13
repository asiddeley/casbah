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

var Vue=require('../node_modules/vue/dist/vue.common.js')
var BootstrapVue=require('../node_modules/bootstrap-vue/dist/bootstrap-vue.common.js')
Vue.use(BootstrapVue)

var GoogleSheet	= require('google-spreadsheet')	
var googleCASBAH = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
var secret = require('../private/client_secret.json')

var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")
var casbahVue

function googleAuth(){
	googleCASBAH.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		googleCASBAH.getRows(1, function(err, rows){
			//update vue model...
			casbahVue.rows=rows;
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
}

Project.prototype.toString=function(data){
	var project=data||this
	return Object.getOwnPropertyNames(this).map(function (val, index, array) {
		return (val + ' -> ' + project[val])
	}).join('\n')
}
//project instance used for its prototype functions ie. project.toString(data) 
var project=new Project({})


function menuShow(e, row) {
	e.preventDefault()	
	casbahVue.menuData=row||{}
	var wx=window.innerWidth, wy=window.innerHeight, sx=window.scrollX, sy=window.scrollY
	var menu = document.getElementById("CONTEXT-MENU")
	//var mx=menu.clientWidth, my=menu.clientHeight
	var mx=menu.scrollWidth, my=menu.scrollHeight
	//console.log('menu mx, my:', mx, my, menu)
	//menu.style.left = e.pageX + 'px'
	menu.style.left=((e.pageX + mx > wx && mx < e.pageX)?e.pageX+sx-mx:e.pageX+sx )+'px'
	//menu.style.top = e.pageY + 'px'
	menu.style.top=((e.pageY + my > wy && my < e.pageY)?e.pageY+sy-my:e.pageY+sy)+'px'
	menu.style.display = 'block'
		
}

///// Custom Vue Directive
Vue.directive('class-hover', {
	bind(el, binding, vnode) {    
		const { value='' } = binding
		el.addEventListener('mouseenter',()=> {el.classList.add(value)})
		el.addEventListener('mouseleave',()=> {el.classList.remove(value)})
	},
	unbind(el, binding, vnode) {
		el.removeEventListener('mouseenter')
		el.removeEventListener('mouseleave')
	}
})


///// EXPORTS
exports.ready=function(){

	var settings = new LocalStore(		
		PATH.join(__dirname,'../private/settings.json'),
		{currentprojectid:'0', hidden:[]}		
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
			currentprojectid:settings.currentprojectid,
			menuData:{},
			//utility
			project:project
		},	
		methods:{
			alert(msg){alert(msg)},
			googleAuth(){googleAuth()},
			isOdd(i){return (i%2===1)},
			isCurrentProject(id){
				//console.log('compare...', this.currentprojectid, '->', id)
				return this.currentprojectid==id
			},
			currentProject(id){
				this.currentprojectid=id
				//update local store
				settings.set('currentprojectid', id)
			},
			titleText(id){
				return (id==this.currentprojectid)?
				'Current project ( '+id+' )':
				'Click to set as current project'
			},
			menuShow:menuShow,
			menuHide:function () {
				document.getElementById("CONTEXT-MENU").style.display = "none"
			}			
			
		}
	})

	return {casbahVue:casbahVue}
} 

exports.googleAuth=googleAuth
exports.Project=Project

exports.view=function(a){
	alert(a)	
}
