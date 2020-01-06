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
exports.register=function(CVM){

///// IMPORTS
const SF=require("../electron/support.js")
const TB=require("../electron/toolbarHtml.js")
TB.register(CVM)

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
		{key:'extra', label:'Ref.'},
		{key:'show_details', label:'Edit'},		
	]
}


var caSvr=new CaSvr({})

Vue.component(exports.element, {
	data:function(){
		return {
		rows:caSvr.notes,
		fields:caSvr.fields,
		//caproject:{projectno:'101', subprojectcode:'TV'},
		editable:true,
		showing:null,
	}},
	props:[],
	template:`
	<div>
		<h2>Site Visit Report</h2>
		<b-table striped hover small :items='rows' :fields='fields'
			REM-tbody-tr-class='{${CVM.navbarClass}:rowShowing}'
			@row-clicked='rowClicked'
		>

		<template v-if='editable' v-slot:cell()='data'>
			<div contenteditable 
			:ref='data.field.label+data.index'
			@click='detailsShow(data)'
			>{{data.value}}</div>
		</template>		

		<template v-slot:row-details='item' >
			<toolbar-html/>
		</template>
		
		</b-table>
	</div>`,
	methods:{
		rowShowing(row){return (row.index==this.rowIndex)},
		rowClicked(row, index){this.rowIndex=index},		
		detailsShow(data){
			var row=data.item
			var ref=data.field.label+data.index
			//hide previous 
			if(this.showing){
				this.$set(this.showing.row,'_showDetails', false)
			}
			//show current 
			this.$set(row,'_showDetails', true)
			//log showing details
			this.showing=(row._showDetails)?{row:row, ref:ref}:null
			//focus that called this function is lost when table refreshed so get it back
			var that=this
			setTimeout(function(){that.$refs[ref].focus()},100)		
		},
		detailsHide(){
			if (this.background){
				this.background.classList.remove(CVM.navbarClass)
				this.background=null
			}
			if (this.showing){
				//this.$refs[this.showing.ref].classList.remove(CVM.navbarClass)
				this.$set(this.showing.row,'_showDetails', false)
			}
		}
	},
	computed:{},
	mounted(){
		var that=this
		CVM.shared['toolbar-html']={
			onSave:function(){that.detailsHide()},
			onClose:function(){that.detailsHide()},
			rowAdd:function(){},
			rowDel:function(){}
		}	
	}
})
	
} //REGISTER