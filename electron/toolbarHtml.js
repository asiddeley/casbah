/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

///// EXPORTS
exports.element='toolbar-html'
exports.name='toolbarHtml'
exports.title='HTML edit toolbar'
exports.register=function(CVM){

const ICON=require('../electron/icons.js')


var oDoc, sDefTxt;

function initDoc() {
	//oDoc = document.getElementById("textBox");
	//sDefTxt = oDoc.innerHTML;
	//if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function formatDoc(sCmd, sValue) {
  if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
  if (!document.compForm.switchMode.checked) { return true ; }
  alert("Uncheck \"Show HTML\".");
  oDoc.focus();
  return false;
}

function setDocMode(bToSource) {
  var oContent;
  if (bToSource) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
    oDoc.contentEditable = false;
    oPre.id = "sourceText";
    oPre.contentEditable = true;
    oPre.appendChild(oContent);
    oDoc.appendChild(oPre);
    document.execCommand("defaultParagraphSeparator", false, "div");
  } else {
    if (document.all) {
      oDoc.innerHTML = oDoc.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(oDoc.firstChild);
      oDoc.innerHTML = oContent.toString();
    }
    oDoc.contentEditable = true;
  }
  oDoc.focus();
}

function printDoc() {
  if (!validateMode()) { return; }
  var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
  oPrntWin.document.open();
  oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
  oPrntWin.document.close();
}


function onChangeFont(){
	formatDoc('fontname',this[this.selectedIndex].value)
	this.selectedIndex=0
}	

function onChangeFontsize(){
	formatDoc('fontsize',this[this.selectedIndex].value)
	this.selectedIndex=0
}

function onChangeForeground(){
	formatDoc('forecolor',this[this.selectedIndex].value)
	this.selectedIndex=0
}

function onChangeBackground(){
	formatDoc('backcolor',this[this.selectedIndex].value)
	this.selectedIndex=0
}
	
const template=`
<div>
<b-button-toolbar>
<b-button-group>

	<b-form-select v-model='formatting' v-on:change='onChangeFormatting' size='sm'>
		<option :value="null">Formatting</option>
		<option value="h1">Title 1 &lt;h1&gt;</option>
		<option value="h2">Title 2 &lt;h2&gt;</option>
		<option value="h3">Title 3 &lt;h3&gt;</option>
		<option value="h4">Title 4 &lt;h4&gt;</option>
		<option value="h5">Title 5 &lt;h5&gt;</option>
		<option value="h6">Subtitle &lt;h6&gt;</option>
		<option value="p">Paragraph &lt;p&gt;</option>
		<option value="pre">Preformatted &lt;pre&gt;</option>
	</b-form-select>

	<b-form-select v-model='font' v-on:change='' size='sm'>
		<option :value='null'>Font</option>
		<option>Arial</option>
		<option>Arial Black</option>
		<option>Courier New</option>
		<option>Times New Roman</option>
	</b-form-select>
	
	<b-form-select v-model='fontSize' v-on:change='' size='sm'>
		<option :value="null" size='sm'>Size</option>	
		<option value="1" size='sm'>Tiny</option>
		<option value="2" size='sm'>Small</option>
		<option value="3" size='sm'>Normal</option>
		<option value="4" size='sm'>Medium</option>
		<option value="5" size='sm'>Big</option>
		<option value="6" size='sm'>Large</option>
		<option value="7" size='sm'>Huge</option>
	</b-form-select>
	
	<b-form-select v-model='foreground' v-on:change='' size='sm'>
		<option :value="null" size='sm'>Colour</option>	
		<option value="red" size='sm'>Red</option>
		<option value="blue" size='sm'>Blue</option>
		<option value="green" size='sm'>Green</option>
		<option value="black" size='sm'>Black</option>
	</b-form-select>
	
	<b-form-select v-model='background' onchange="" size='sm'>
		<option :value="null" size='sm'>Background</option>	
		<option value="red">Red</option>
		<option value="green">Green</option>
		<option value="black">Black</option>
	</b-form-select>
</b-button-group>	
</b-button-toolbar>

<b-button-toolbar>
<b-button-group>
	<b-button class='mdi mdi-delete-sweep' title="Clean" variant='light' size='sm'
		@click="if(validateMode()&&confirm('Are you sure?')){oDoc.innerHTML=sDefTxt};" 
	></b-button>
	<b-button class='mdi mdi-print' title="Print" variant='light' size='sm' 
		@click="printDoc();"></b-button>
	<b-button class='mdi mdi-undo' title="Undo" variant='light' size='sm'
		@click="formatDoc('undo');"></b-button>
	<b-button class='mdi mdi-redo' title="Redo" variant='light' size='sm' 
		@click="formatDoc('redo');"></b-button>
	<b-button class='mdi mdi-format-clear' title="Format clear" variant='light' size='sm'
		@click="formatDoc('removeFormat')"></b-button>
</b-button-group>

<b-button-group>
	<b-button class='mdi mdi-format-bold' title="Bold" variant='light' variant='light' size='sm'
		@click="formatDoc('bold');"></b-button>
	<b-button class='mdi mdi-format-italic' title="Italic" variant='light' size='sm'
		@click="formatDoc('italic');"></b-button>
	<b-button class='mdi mdi-format-underlined' title="Underlined" variant='light' size='sm'
		@click="formatDoc('underline');"></b-button>
</b-button-group>

<b-button-group>
	<b-button class='mdi mdi-format-align-left' title="Left align" variant='light' size='sm'
		@click="formatDoc('justifyleft');"></b-button>
	<b-button class='mdi mdi-format-align-center' title="Center align" variant='light' size='sm'
		@click="formatDoc('justifycenter');" ></b-button>
	<b-button class='mdi mdi-format-align-right' title="Right align" variant='light' size='sm'
		@click="formatDoc('justifyright');"></b-button>
</b-button-group>

<b-button-group>
	<b-button class='mdi mdi-format-list-numbered'  title="Numbered list" variant='light' size='sm'
		@click="formatDoc('insertorderedlist');"></b-button>
	<b-button class='mdi mdi-format-list-bulleted'  title="Bulleted list" variant='light' size='sm'
		@click="formatDoc('insertunorderedlist');"></b-button>
</b-button-group>

<b-button-group class='bg-light'>
	<b-button class='mdi mdi-format-quote' title="Quote" variant='light' 
		@click="formatDoc('formatblock','blockquote');"></b-button>
	<b-button class='mdi mdi-format-indent-decrease' title="indent increase" variant='light' size='sm'
		@click="formatDoc('outdent');"></b-button>
	<b-button class='mdi mdi-format-indent-increase' title="indent decrease" variant='light' size='sm'
		@click="formatDoc('indent');"></b-button>
	<b-button class='mdi mdi-link' title="Hyperlink" variant='light' size='sm' 
		@click="var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}" 
	></b-button>
</b-button-group>

<b-button-group class='bg-light'>
	<b-button class='mdi mdi-content-cut' title="Cut" variant='light' size='sm' @click="formatDoc('cut')"></b-button>
	<b-button class='mdi mdi-content-copy' title="Copy" variant='light' size='sm' @click="formatDoc('copy')"></b-button>
	<b-button class='mdi mdi-content-paste' title="Paste" variant='light' size='sm' @click="formatDoc('paste')"></b-button>
</b-button-group>

<b-button-group>
	<b-button class='mdi mdi-save' title='Save' variant='light' size='sm' @click='save()'></b-button>
	<b-button class='mdi mdi-close' title='Close' variant='light' size='sm' @click='close()'></b-button>
</b-button-group>

</b-button-toolbar>
</div>
`
//<b-card id="textBox" contenteditable="true"><p>Lorem ipsum</p></b-card>


// Register as component
Vue.component(exports.element, {
	data(){return {
		background:null,
		formatting:null,
		font:null,
		fontSize:null,
		foreground:null
	}},
	props:[],
	template:template,
	methods:{
		save(){
			var options=CVM.shared[exports.element]||{}
			var target=options.target||{}
			if (typeof options.onSave=='function'){options.onSave(target.innerText)}
		},
		close(){
			var options=CVM.shared[exports.element]||{}
			if (typeof options.onClose=='function'){options.onClose()}
		},
		onChangeFormatting(){
			//console.log('Formatting:', this.formatting)
			document.execCommand('formatblock', false, this.formatting)
		},
		formatDoc(cmd, val){
			document.execCommand(cmd, false, val)
		}
	},
	computed:{
		
		
	},
	mounted(){
		//initDoc()
	}
	
})

} //REGISTER 

