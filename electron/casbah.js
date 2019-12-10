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
const REMOTE = require('electron').remote
const WM = REMOTE.require(PATH.join(__dirname,'windowMaster.js'))

// CA Modules
const CAMS=[
	require('../electron/caProject.js'),
	require('../electron/caSvr.js'),
	require('../electron/caDrr.js'),
	require('../electron/caQuickForm.js'),
	require('../electron/caAlert.js'),
	require('../electron/caQuickTable.js')
]

var windowName=WM.getCurrent().name
//console.log('CURRENT WIN:', windowName)

//component title properties eg. vm.caProjectTitle:'Ca Project Log' <n-dd-item :title='caProjectTitle'>
function propsForTitle(){	
	var d={}
	for (var i in CAMS){d[CAMS[i].name+'Title']=CAMS[i].title}
	return d
}

function switchTo(vm, camel, options){
	if (typeof camel=='string'){
		//find ca module given the module name
		var cam=CAMS.find(function(i){return i.element==camel})
		//Get an array of components registered in Vue 
		var registered=Object.keys(Vue.options.components)
		//register the ca component if not already 
		if (cam && !registered.includes(camel)){cam.register(vm)}
		//place options in shared location for that module to access
		vm.shared[camel]=options||{}
		//set component to camel for display
		if (cam){vm.CAMEL=cam.element}
		else {switchTo(vm, 'ca-alert', {msg:'Missing camel: ' + camel})}
	}
}				

///// EXPORTS
exports.ready=function(callback){

	new Vue({
		el:'#CASBAH',
		data:Object.assign(
			{CAMEL:'h2'}, //wraps Welcome...
			propsForTitle(),
			{shared:{}}
		),
		computed:{
			navbarClass() {return windowName},
			navbarType() {return WM.getTheme(windowName)}
		},
		methods:{
			getCAM(camel){
				camel=camel||this.CAMEL
				return CAMS.find(function(cam){return cam.element==camel})
			},
			//Open a window with the next free name and cascade it from this window
			homeOpen(){WM.open(windowName)},
			homeAlone(){WM.isolate(windowName)},
			homeList(){
				var camelBack=this.CAMEL, that=this
				switchTo(this, 'ca-quick-table', {
					//title:'Open Homes',
					rows:WM.list('Open Homes'),				
					onOk:function(result){switchTo(that, camelBack)}
				})
			}
			switchTo(camel, options){switchTo(this, camel, options)}			
		},
		mounted(){
			//allow Welcome... to linger for 1000ms then switch camel  
			//CA Module ELement (AKA CAMEL) to <ca-project> through <component :is='CAMEL'> 
			var that=this
			setTimeout(function(){			
				CAMS[0].register(that)
				that.CAMEL=CAMS[0].element
			}, 200)
		}
	})
	
	if (typeof callback=='function'){callback()}
} 

const getCAM=function(){

}
