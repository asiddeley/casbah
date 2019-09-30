/**
There are a few administrative steps in order to enable authentication through this approach.

1. Go to the Google Developers Console and navigate to the API section. You should see a dashboard.

2. Click on  “Enable APIs” or “Library” which should take you to the library of services that you can connect to. Search and enable the Google Sheets API.

3. Go to Credentials and select “Create credentials”.

4. Select “Service Account” and proceed forward by creating this service account. It can be named whatever you want.

5. Under “Role”, select Project > Owner or Editor, depending on what level of access you want to grant.

6. Select JSON as the Key Type and click “Create”. This should automatically download a JSON file with your credentials.

7. Rename this credentials file as client_secret.json and copy it into your working directory.

The final administrative step is super important! Take the “client email” that is in your credentials file and grant access to that particular email in the sheet that you’re working in. You can do this by clicking “Share” in the top left of your spreadsheet and then pasting that email in the field, enabling with “Can edit”. If you do not do this, you will get an error when trying to pull the data.

In order to test whether the code works, we can start working with the API! Below is some example code which effectively authenticates and gets the data from the second tab of the identified spreadsheet. I've left notes identifying where the authentication is taking place, what is being requested, and where the response is being returned.

While you’re testing, make sure to take a look at the output in the console which will either log the error or the response object. If you are getting a 403 error, this means that something probably went wrong in setting up the authentication.
**/


var express     = require("express"),
fs              = require('fs'),
readline        = require('readline'),
{google}        = require('googleapis'),
request         = require('request'),
GoogleSheet 	= require('google-spreadsheet'),
secret          = require('./dist/client_secret.json'),
app             = express()
//async			= require("async");


//CASBAH project spreadsheet key in googledrive
//1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4

var prj = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4");

//async.series(TaskArray, thenCallback(err,results){})
/*
async.series([
	function(done){prj.useServiceAccountAuth(secret, done)}, 
	function(done){prj.getInfo(done)}, 
	function(done){getRows(1, done)},
	function(done){getRows(2, done)}
	], print)
	
console.log("...after async.series")
*/

async function series(){
	var rows
	console.log("async step 1")
	await new Promise(done => {prj.useServiceAccountAuth(secret, done)})
	console.log("async step 2")
	await new Promise(done => {getRows(1, function(err,r){rows=r; done()}) })  
	console.log("async step 3")
	console.log(rows[0])
}	
console.log("before async series...")
series()
console.log("...after async series")



function print(err, results){
	
	console.log("/////////////////////////////")
	console.log("// INFO...")
	console.log(results[1])
	
	console.log("/////////////////////////////")
	console.log("// INDEX...")
	results[2].forEach(function (row){
		console.log("---------------------------")
		console.log(row)
	})

	console.log("/////////////////////////////")
	console.log("// DIR...")
	results[3].forEach(function (row){
		console.log("---------------------------")
		console.log(row)
	})
	
}



function getRows(n, done){
	var badkeys=["_xml","id","app:edited","_links","save","del"]
	var rows
	prj.getRows(n,	function (err, raws){
		//raws includes spreadsheet row objects {field:value} mixed with badkey objects 
		if (err){
			console.log("err:", err)
			done(err)
		} else {
			rows=raws.map(function(raw){
				var row={}
				Object.keys(raw).forEach(function(key){
					//filter out the badkey objects
					if (!badkeys.includes(key)){ row[key]=raw[key] }
				})
				return row
			})
			done(null, rows)
		}
	})
}

/*************
// accessing google sheets with nested callbacks i.e. without async.series

function getCellsBasic(){
	prj.useServiceAccountAuth(creds, function (err) {
		prj.getCells(1,	function callback(err, cells){
			console.log("err:",err)
			console.log("////////////////")
			cells.map(function(cell){
				console.log("row:"+cell.row+", col:"+cell.col+" = "+cell._value)

			})
		})
	}) 
}


function getRowsBasic(){
	var ignore=["_xml","id","app:edited","_links","save","del"]
	var prj
	prj.useServiceAccountAuth(creds, function (err) {
		prj.getRows(1,	function (err, rows){
			if (err){console.log("err:", err); return;}
			rows.map(function(row){
				console.log("-----------------------------------------")
				for (var key in row){
					if (ignore.includes(key)) continue;
					console.log(key, row[key])					
				}
			})
		})
	})
}
****/


/**
app.get("/google-spreadsheet", function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  var prj = new GoogleSpreadsheet('1UIV4RkOx8KJK2zQYig0klH5_f8FCOdwIWV8YF2VyF8I');

  // Authentication
  prj.useServiceAccountAuth(creds, function (err) {
  
  // Adding a row in tab #4 with the date and the number 1
  prj.addRow(4, { date: "=today()", progress: "1" }, callback)
  
  function callback(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('You added your progress for the day.') 
      
      // Rendering test page
      res.render('test')
    }
  }

  });  
});



**/
