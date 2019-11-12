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

const FSP=require('fs-plus')
const PATH=require('path')
var remote = require('electron').remote
var windowManager = remote.require('electron-window-manager')
var Vue=require('../node_modules/vue/dist/vue.common.js')
var GoogleSheet	= require('google-spreadsheet')	
var googleCASBAH = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
var secret = require('../private/client_secret.json')
//var {getOwn, cryptoId, addDays, LocalStore}=require("../server/support.js")
var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")
var projectPicker

function googleAuth(){
	googleCASBAH.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		googleCASBAH.getRows(1, function(err, rows){
			//update vue model...
			projectPicker.rows=rows;
		})
	})	
}	

function Project({projectno, projectcode, days}){	
	var today=new Date()
	var future=addDays(today, days||365)
	//random id with high probability of uniqueness
	this.projectid=cryptoId()
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



///// Extend jQuery
$.fn.showAtMouse=function(ev){
	var win$=$(window)
	var wx=win$['width'](), wy=win$['height'](), sx=win$['scrollLeft'](), sy=win$['scrollTop']()
	return this.each(function(){
		var menu$=$(this)
		var mx=menu$['width'](), my=menu$['height']()
		menu$.show().css({
			position:'absolute', 
			// Horizontally flips menu if too close to bottom
			left:(ev.pageX + mx > wx && mx < ev.pageX)?ev.pageX+sx-mx:ev.pageX+sx,
			// Vertically flips menu if too close to right 
			top:(ev.pageY + my > wy && my < ev.pageY)?ev.pageY+sy-my:ev.pageY+sy
		})
		return false
	})
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

	///// get local settings
	var settings = new LocalStore(
		PATH.join(__dirname,'../private/settings.json'),
		// contents
		{currentprojectid:'0', hidden:[]}		
	)
	
	projectPicker=new Vue({
		el:'#PROJECT-PICKER',
		data:{
			title:'click',
			hoverText:'click to select',
			rows:[
				new Project({projectno:'P-101'}), 
				new Project({projectno:'P-102'}),
				new Project({projectno:'P-103'})
			],
			isMouseover:false,
			contextMenu:false,
			currentprojectid:0
		},	
		methods:{
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
			}
		}
	})
	projectPicker.currentprojectid=settings.currentprojectid
	
	//console.log("Current Project: ", projectPicker.currentprojectid)
	return {projectPicker:projectPicker}
} 

exports.googleAuth=googleAuth
exports.Project=Project

exports.view=function(a){
	alert(a)	
}
