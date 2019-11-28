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



//exports.setWindowName=function(name){windowName=name}



///// IMPORTS
/*
const SECRET = require('../private/client_secret.json')
const SETTINGS=require('../private/settings.json')

const PATH=require('path')
const {cryptoId, addDays, LocalStore}=require("../electron/support.js")

//API
const GoogleSheet = require('google-spreadsheet')	
const gsProjects = new GoogleSheet(SETTINGS.gsProjectskey)



function googleAuth(vue){
	gsProjects.useServiceAccountAuth(SECRET, function(){
		//authenticated so proceed
		gsProjects.getRows(1, function(err, rows){
			rows.forEach(function(r){r._rowVariant=''})
			vue.rows=rows
		})
	})	
}
*/


///////////////////////////////
// Init Storage with Vuex 
const STORE=new Vuex.Store({
	state:{	},
	getters:{	},
	mutations:{
		
		
	},
	actions:{
		
		
		
	}	
	
})



function register(options){
	
	//To do...
	//register Vue component for storage settings
	
	
}

///// EXPORTS
exports.element='ca-storage'
exports.name='caStorage'
exports.title='CA Storage Settings'
//register Vue element
exports.register=register
exports.store=STORE
