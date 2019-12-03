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
exports.element='ca-quick-form'
exports.name='caQuickForm'
exports.title='Ca Quick Form'
exports.register=function(casbahVue){

const SF=require('../electron/support.js')

Vue.component('ca-quick-form', {
	
	data(){
		return {
			rows:SF.pivot(casbahVue.shared.quickFormData, 'Heading', 'Content'),
			fields:[
				{key:'Heading', sortable:true},
				{key:'Content', sortable:true}
			]
		}	
	},
	template:
	`<div>
		<h3>Quick Form</h3>
		<b-table striped small :items='rows' :fields='fields'>
		<template v-slot:cell(Content)='data'>
			<b-form-input type='text' :value='data.value' 
			v-on:input='change($event, data)'		
			></b-form-input>
		</template>		
		</b-table>	
		<b-button v-on:click='save' variant='success'>Save</b-button>
		<b-button v-on:click='cancel' variant='secondary'>Cancel</b-button>
	</div>`,
	methods:{			
		alert(msg){alert(msg)},
		change(ev, data){
			var target=this.rows.find(function(r){return r['Heading']==data.item['Heading']})
			target['Content']=ev
		},
		cancel(){
			var cancel=casbahVue.shared.quickFormCancel
			if (typeof cancel=='function'){cancel()}			
		},
		save(){
			var ok=casbahVue.shared.quickFormOk
			if (typeof ok=='function') {ok (SF.pivotBack(this.rows, 'Heading', 'Content'))}
		}	
	}, 
	computed:{},
	mounted(){}
})

	
} //REGISTER


