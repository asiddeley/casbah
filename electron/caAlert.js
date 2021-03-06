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
exports.element='ca-alert'
exports.name='caAlert'
exports.title='Alert Page'
exports.register=function(VM){	
	
	Vue.component('ca-alert', {
		data:function(){return {

		}},
		props:[],
		template:`
		<b-alert show dismissible variant='warning' @dismissed='close()'
		><strong>Alert</strong><br>{{message}}
		</b-alert>`,
		methods:{
			close(){
				if (this.hasCallback){
					VM.shared['ca-alert'].callback()
				} else {
					//default to ca-project page
					VM.component('ca-project')
				}
			}		
		},
		computed:{
			message(){
				//console.log('message...')
				var options=VM.shared['ca-alert'], msg='Unspecified'
				if (typeof options=='string'){msg=options}
				else if (typeof options=='object'){msg=options.msg||msg}
				return msg
			},
			hasCallback(){
				//console.log('hasCalback...')
				var options=VM.shared['ca-alert']
				return (typeof options=='object' && typeof options.callback=='function')
			}
		},
		mounted(){}
	})
	
}

