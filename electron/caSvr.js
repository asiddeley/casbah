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

///// IMPORTS
const PATH=require('path')
//var GoogleSheet	= require('google-spreadsheet')	
//var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
//var secret = require('../private/client_secret.json')

var {getOwn, cryptoId, addDays, LocalStore, showAtPointer}=require("../electron/support.js")



function CaSvr({projectid, projectno, projectcode, days}){	
	var today=new Date()
	var future=addDays(today, days||7)
	this.projectid=projectid
	this.visitdates=[today]
	this.reviewer=''
	this.reportdate=future
	this.notes=[
		new CaSvrNote('1.0', 'GENERAL', 'REF'),
		new CaSvrNote('1.1', 'Refer also to Consultant Electrical, Mechanical and Structural reports issued separately', '--'),
		new CaSvrNote('2.0', 'OBSERVATIONS AND COMMENTS', 'REF'),
		new CaSvrNote('2.1', 'Concrete pour ongoing...', '--'),
	]
	//this.photos=[new CASvrPhoto()]
}

function CaSvrNote(item, desc, ref){
	this.item=item||'1.1'
	this.desc=desc||'description'
	this.ref=ref||'--'	
}


//var settings = new LocalStore(PATH.join(__dirname,'../private/CaSvr.json'), {projectid:'0', hidden:[]})

//make caProject instance when mounted, accessible so caProjectMenu
var caSvr=new CaSvr({})

function register(){
	Vue.component('ca-svr', {
		data:function(){return {
			rows:caSvr.notes,
			fields:[],
			caproject:{projectno:'101', subprojectcode:'TV'}
		}},
		props:[],
		template:`
			<div>
				<h2>Site Visit Report</h2>
				
				<row><strong class='col-sm-6'>Project no.:{{caproject.projectno}}</strong>
				<strong class='col-sm-6'>Sub-project no.:{{caproject.subprojectcode}}</strong></row>
				
				<b-table 
					striped 
					hover 
					small 
					:items='rows' 
					:fields='fields'
				></b-table>			
			</div>`,
		methods:{
			menuShow(row, rows, e){showAtPointer(menu, e)}
		},
		computed:{
			
		},
		mounted(){
			//caSvr=this		
		}
	})
}

///// EXPORTS
exports.element='ca-svr'
exports.name='caSvr'
exports.title='Site Visit Report'
exports.register=register