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

var remote = require('electron').remote;
var windowManager = remote.require('electron-window-manager');
//var fs=require('fs');
var Vue=require('../node_modules/vue/dist/vue.common.js');
var GoogleSheet	= require('google-spreadsheet');	
var googleCASBAH = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4");
var secret = require('../private/client_secret.json');
var {getOwn, cryptoId, addDays}=require("../server/support.js")
var projectVue

function googleAuth(){
	googleCASBAH.useServiceAccountAuth(secret, function(){
		//authenticated so proceed
		googleCASBAH.getRows(1, function(err, rows){
			//update vue model...
			projectVue.rows=rows;
		})
	})	
}	

function Project({projectno, projectcode, days}){	
	var today=new Date()
	var future=addDays(today, days||365)
	//random id with high probability of uniquness
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

///// Custom Directives
Vue.directive('add-class-hover', {
	bind(el, binding, vnode) {    
		const { value="" } = binding
		el.addEventListener('mouseenter',()=> {el.classList.add(value)})
		el.addEventListener('mouseleave',()=> {el.classList.remove(value)})
	},
	unbind(el, binding, vnode) {
		el.removeEventListener('mouseenter')
		el.removeEventListener('mouseleave')
	}
})

exports.ready=function(){
	const WIN$=$(window)
	projectPicker=new Vue({
		el:'#PROJECT-PICKER',
		data:{
			title:'click',
			hoverText:'click to select',
			rows:[new Project({}), new Project({}), new Project({})],
			isMouseover:false,
			HIGHLIGHT_CLASS:'highlight'
		},	
		methods:{
			isOdd(i){return (i%2===1)},
			contextMenu:function(ev, pn){
				console.log("CM...", pn)
				function menuX(mouse){
					var win=WIN$['width'](), 
					menu=CM$['width'](),
					scroll=WIN$['scrollLeft'](),
					position = mouse + scroll
					return (mouse + menu > win && menu < mouse)? position - menu : position
				}
				function menuY(mouse){
					var win=WIN$['height'](), 
					menu=CM$['height'](),
					scroll=WIN$['scrollTop'](),
					position = mouse + scroll
					return (mouse + menu > win && menu < mouse)? position - menu : position
				}			

				CM$.show().css({
					position:'absolute',
					left:menuX(ev.pageX),
					top:menuY(ev.pageY)
				})
				return false
			}
		}		
	});
	//googleAuth();

		
		
} 

exports.view=function(a){
	alert(a)	
}
