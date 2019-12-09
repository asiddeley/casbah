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
exports.element='ca-quick-table'
exports.name='caQuickTable'
exports.title='Ca Quick Table'
exports.register=function(casbahVue){

const SF=require('../electron/support.js')

Vue.component('ca-quick-table', {
	
	data(){
		return {
			rows:casbahVue.shared['ca-quick-table'].rows
		}	
	},
	template:
	`<div>
		<h3 v-if='title'>{{title}}</h3>
		<b-table striped small :items='rows' @row-clicked=onRowClick>
		</b-table>	
		<b-button v-on:click='ok' variant='success'>Return</b-button>
	</div>`,
	methods:{
		onRowClick(){
			var rowClick=casbahVue.shared['ca-quick-table'].onRowClick
			if (typeof click=='function') {rowClick (rows[index], index)}
		},
		ok(){
			var ok=casbahVue.shared['ca-quick-table'].onOk
			if (typeof ok=='function') {ok ()}
		}	
	}, 
	computed:{
		title(){return casbahVue.shared['ca-quick-table'].title}
	},
	mounted(){}
})

	
} //REGISTER


