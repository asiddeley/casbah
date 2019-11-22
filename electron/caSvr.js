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
	this._rowVariant=''
}



//var settings = new LocalStore(PATH.join(__dirname,'../private/CaSvr.json'), {projectid:'0', hidden:[]})

//make caProject instance when mounted, accessible so caProjectMenu
var caSvr
Vue.component('ca-svr', {
	data:function(){return {
		rows:[
			new CaSvr({projectid:'100', projectno:'P-100'}), 
			new CaSvr({projectid:'100', projectno:'P-100'}),
			new CaSvr({projectid:'100', projectno:'P-100'})
		],
		fields:[
			{key:'projectno', sortable:true},
			{key:'project', sortable:true},
			{key:'subprojectcode', sortable:true},
			{key:'subproject', sortable:true}
		],	
	}},
	props:[],
	template:`
		<div>
			<h2>Site Visit Report</h2>
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
	mounted(){
		caSvr=this		
	}
})


///// EXPORTS
exports.name='caSvr'
exports.title='Site Visit Report'