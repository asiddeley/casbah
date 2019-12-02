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


Vue.component('ca-quick-form', {
	
	data(){
		//get data placed by calling module
		var data=casbahVue.shared.quickFormData||{Item1:'undefined', item2:'undefined'}
		//map object to array of Heading/Content pairs for <b-table>
		var rows=Object.keys(data).map(function(k){
			var o={}
			o['Heading']=k
			o['Content']=data[k]
			return o
		})
		return {
			rows:rows,
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
		<b-button v-on:click='save'>Save</b-button>
		<b-button v-on:click='cancel'>Cancel</b-button>
	</div>`,
	methods:{			
		alert(msg){alert(msg)},
		change(ev, data){
			var target=this.rows.find(function(r){
				return r.Heading==data.item.Heading
			})
			//console.log('change:', target.Content, 'to:', ev)
			target.Content=ev
		},
		cancel(){
			var camel=casbahVue.shared.quickFormReturn||'ca-project'
			casbahVue.switchTo(camel)			
		},
		save(){
			var camel=casbahVue.shared.quickFormReturn||'ca-project'
			var callback=casbahVue.shared.quickFormOk
			console.log(this.getResult())
			//console.log('CALLBACK:', callback)
			//casbahVue.switchTo(camel)
		},
		getResult(){
			//unmap array of Heading/Content pairs to object...
			var result={}
			this.rows.forEach(function(row){result[row.Heading]=row.Content})
			return result			
		},	
	}, 
	computed:{},
	mounted(){}
})

	
} //REGISTER


