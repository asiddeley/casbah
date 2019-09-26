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
GoogleSpreadsheet = require('google-spreadsheet'),
creds             = require('./dist/client_secret.json'),
app               = express();




var doc = new GoogleSpreadsheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4");
//https://docs.google.com/spreadsheets/d/1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4/edit?usp=sharing

doc.useServiceAccountAuth(creds, function (err) {
	doc.getCells(1,	function callback(err, cells){
		console.log("err:",err)
		console.log("////////////////")
		cells.map(function(cell){
			console.log("row:"+cell.row+", col:"+cell.col+" = "+cell._value)

		})
	})
});  


/**
app.get("/google-spreadsheet", function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  var doc = new GoogleSpreadsheet('1UIV4RkOx8KJK2zQYig0klH5_f8FCOdwIWV8YF2VyF8I');

  // Authentication
  doc.useServiceAccountAuth(creds, function (err) {
  
  // Adding a row in tab #4 with the date and the number 1
  doc.addRow(4, { date: "=today()", progress: "1" }, callback)
  
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
