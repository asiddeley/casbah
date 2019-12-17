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

<b-button-group>
	<b-button size='sm' variant='light' v-on:click='save()'>Save</b-button>
	<b-button size='sm' variant='light' v-on:click='close()'>Close</b-button>
</b-button-group>


</b-button-toolbar>

<b-button-toolbar >
<b-button-group class='bg-light'>

	<b-img title="Clean" onclick="if(validateMode()&&confirm('Are you sure?')){oDoc.innerHTML=sDefTxt};" 
	src='${ICON.clean}'/>
	<b-img title="Print" onclick="printDoc();" src='${ICON.print}'/>
	<b-img title="Undo" onclick="formatDoc('undo');" src='${ICON.undo}'/>
	<b-img title="Redo" onclick="formatDoc('redo');" src='${ICON.redo}'/>
	<b-img title="Remove formatting" onclick="formatDoc('removeFormat')" src='${ICON.unformat}'/>

</b-button-group>
<b-button-group class='bg-light'>

	<b-img variant='light' title="Bold" onclick="formatDoc('bold');" src="${ICON.bold}" />
	<b-img title="Italic" onclick="formatDoc('italic');" src="${ICON.italic}" />
	<b-img title="Underline" onclick="formatDoc('underline');" src="${ICON.underline}" />

</b-button-group>
<b-button-group class='bg-light'>

	<b-img title="Left align" onclick="formatDoc('justifyleft');" src="${ICON.left}" />
	<b-img title="Center align" onclick="formatDoc('justifycenter');" src="${ICON.centre}" />
	<b-img title="Right align" onclick="formatDoc('justifyright');" src="${ICON.right}" />

</b-button-group>
<b-button-group class='bg-light'>

	<img title="Numbered list" onclick="formatDoc('insertorderedlist');" src="${ICON.numbered}" />
	<img title="Dotted list" onclick="formatDoc('insertunorderedlist');" src="${ICON.dotted}" />

</b-button-group>
<b-button-group class='bg-light'>

	<b-img title="Quote" onclick="formatDoc('formatblock','blockquote');" src="${ICON.quote}" />
	<b-img title="Delete indentation" onclick="formatDoc('outdent');" src="${ICON.unindent}" />
	<b-img title="Add indentation" onclick="formatDoc('indent');" src="${ICON.indent}" />
	<b-img title="Hyperlink" onclick="var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}" 
src="${ICON.hyperlink}" />

</b-button-group>
<b-button-group class='bg-light'>

	<b-img title="Cut" onclick="formatDoc('cut');" src="${ICON.cut}" />
	<b-img title="Copy" onclick="formatDoc('copy');" src="${ICON.copy}" />
	<b-img title="Paste" onclick="formatDoc('paste');" src="${ICON.paste}" />

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
		}
	},
	computed:{
		
		
	},
	mounted(){
		//initDoc()
	}
	
})

} //REGISTER 

