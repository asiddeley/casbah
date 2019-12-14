/**********************************
CASBAH
Contract Admin Site Be Architectural Hero
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
exports.element='ca-svr'
exports.name='caSvr'
exports.title='Site Visit Report'
exports.register=function(casbahVue){

///// IMPORTS
const SF=require("../electron/support.js")
const TH=require("../electron/toolbarHtml.js")
TH.register(casbahVue)



function CaSvr({projectid, projectno, projectcode, days}){	
	var today=new Date()
	var future=SF.addDays(today, days||7)
	this.projectid=projectid
	this.visitdates=[today]
	this.reviewer=''
	this.reportdate=future
	this.notes=[
		new SF.Note('1.0', 'GENERAL', 'REF'),
		new SF.Note('1.1', 'Refer also to Consultant Electrical, Mechanical and Structural reports issued separately', '--'),
		new SF.Note('2.0', 'OBSERVATIONS AND COMMENTS', 'REF'),
		new SF.Note('2.1', 'Concrete pour ongoing...', '--')
	]
	//this.photos=[new CASvrPhoto()]
	this.fields=[
		{key:'item', label:'Item'},
		{key:'note', label:'Description'},
		{key:'extra', label:'Ref.'}		
	]
}



//var settings = new LocalStore(PATH.join(__dirname,'../private/CaSvr.json'), {projectid:'0', hidden:[]})

//make caProject instance when mounted, accessible so caProjectMenu
var caSvr=new CaSvr({})

Vue.component('ca-svr', {
	data:function(){return {
		rows:caSvr.notes,
		fields:caSvr.fields,
		caproject:{projectno:'101', subprojectcode:'TV'},
		editable:true,
		toolbarVisible:true,
		toolbarAtRow:{}
	}},
	props:[],
	template:`
		<div>
			<div class='dropdown-menu 'ref='toolbar-html-ref'><toolbar-html v-if='toolbarVisible' /></div>
			<h2>Site Visit Report</h2>
			<b-table striped hover small :items='rows' :fields='fields' @row-clicked='toolbar'>
			<template v-if='editable' v-slot:cell()='data'>
				<p contenteditable >{{data.value}}</p>
			</template>				
			</b-table>
		</div>`,
	methods:{
		//menuShow(row, rows, e){SF.showAtPointer(menu, e)}
		toolbar(row, rows, e){
			console.log('srcElement:', e)
			if (e.srcElement.tagName=='P'){
				this.toolbarAtRow=row
				SF.showAtRow(this.$refs['toolbar-html-ref'], e)				
			}
		}
	},
	computed:{
		
	},
	mounted(){
	
	}
})
	
} //REGISTER