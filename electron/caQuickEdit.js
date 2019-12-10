/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

//////////////////////////////////
// TEXTEDITOR
// init...
// var ed=new Editor();
// example (icTV is a casbah TableView obj)
// <div onclick="ed.text(this, function(){icTV.update(ed.row(), ed.rowid()); ed.hide();})" ...>

exports.element='ca-quick-edit'
exports.name='caQuickEdit'
exports.title='general purpose text editor'
exports.register=function(casbahVue){


function fit(){
	if (this.e$==null){return}
	that.x$.show()
	//fit textarea to element	
	that.x$.width(that.e$.width())
	that.x$.css("height","auto")
	that.x$.css("padding-left", that.e$.css("padding-left"))
	if (that.x$[0].scrollHeight > 0) {that.x$.css("height", that.x$[0].scrollHeight);}
	//element to match textarea height
	that.e$.height(that.x$.height()+5);
	//Position needs to be done last per trial-and-error
	that.x$.position({my:'left top', at:'left top', of:that.e$});
	//progress backup of edited value
	that.e$.attr("newval", that.x$.val());
}


function Editor(){
	
	var that=this;
	
	this.e$=null; //editee - initialized by this.text()
	
	this.fit=function()
	
	this.hide=function(){
		that.x$.hide();
		$(window).off("resize", that.fit);
		//restore row height of previously accessed elements 
		//select elements with onclick attribute. 
		//Re. jquery notation...
		//^= means matches value as begining 
		//*= means matches value as substring 
		//~= means matches value as space delimited word
		//$("[onclick*='.text(']").css("height","auto");
		$("[onclick*='.text(']").css("height","100%");
	};
	
	this.text=function(el, dblclick){

		//restore row height of any previously edited elements
		//$("[onclick*='.text(']").css("height","auto");
		$("[onclick*='.text(']").css("height","100%");
	
		that.e$=$(el);
		that.x$=$("#texteditor");
		
		//update editors dblclick callback to the current edited element
		//dblclick meant to commit the text editor's change
		if (typeof dblclick=="function"){
			that.x$.off("dblclick").on("dblclick", function(){
				var field=that.e$.attr("field");
				var oldtext=that.e$.text();
				var newtext=that.x$.val();
				dblclick(field, oldtext, newtext);
			});
		};
		
		//all this newval was working not anymore. Lose it? 
		//newval allows for edit to resume editing on an element that was left without commiting
		var newval=that.e$.attr("newval");
		if (typeof newval=="undefined") {
			//first time this element is edited so initialize editor from element
			that.x$.val(that.e$.text());
			that.x$.attr("newval", that.e$.text());
		} else {
			//resume editing from last edited value
			that.x$.val(newval);
		}
		that.fit();
	};
	
	this.row=function(){
		var row={};
		//row[that.e$.attr("field")]=that.e$.attr("newval");
		row[that.e$.attr("field")]=that.x$.val();
		//console.log("EDITOR field, newval, row...", that.e$.attr("field"), that.e$.attr("newval"), row);
		return row;
	};
	
	this.rowid=function(){
		var rowid=that.e$.attr("rowid");
		//console.log("EDITOR rowid...", rowid);
		return rowid;
	};
	
	this.target_attr=function(name){return that.e$.attr(name);};
	this.val=function(name){return that.x$.val();};

	//INIT
	//create text area element for editing text
	this.x$=$("<textarea id='texteditor' style='z-index=999;'></textarea>");
	$("body").append(this.x$);
	this.x$.hide();

	//initialize or reset various event handlers...
	this.x$.on("click keyup resize", that.fit);
	$(window).on("resize", that.fit);

	$(document).one("viewchange",function(){
		//console.log("pageturn detected");
		that.x$.hide();
	});
	
};

// Register as component
Vue.component(exports.element, {
	data:{},
	props:[],
	template:`
	
	`,
	methods:{
		
		
	},
	computed:{
		
		
	}	
	
})












} //REGISTER