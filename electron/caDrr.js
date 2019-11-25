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


//var settings = new LocalStore(PATH.join(__dirname,'../private/CaCRR.json'), {projectid:'0', hidden:[]})

CaDrr=function(){
	this.item=1
	this.description='Rough paint on door frame'
	this.locale='Room 101'
	this.status='open'	
}

var caDrr

function register(){
	Vue.component('ca-drr', {
		data:function(){return {
			rows:[
				new CaDrr(),
				new CaDrr(),
				new CaDrr(),
				new CaDrr(),
				new CaDrr()
			]	
		}},
		props:[],
		template:`
			<div>
				<h2>Deficiency Review Report</h2>
				<b-table 
					striped 
					hover 
					small 
					:items='rows' 
				></b-table>			
			</div>`,
		methods:{	},
		mounted(){caDrr=this}
	})
}

///// EXPORTS
exports.element='ca-drr'
exports.name='caDrr'
exports.title='Punch List / Deficiency Review Report'
exports.register=register

