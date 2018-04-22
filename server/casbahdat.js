/**********************************
CASBAH * Contract Admin Site * Be Architectural Heroes


MIT License

Copyright (c) 2018 Andrew Siddeley

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
const path=require("path")
const sqlite=require("sqlite3").verbose()

var db;

exports.close=function(){db.close();console.log("Database closed.");}

exports.init=function(){
	//Open database
	db=new sqlite.Database(path.join(global.appRoot,"database","casbah.db"))
	//var databasecount=1
}

exports.query=function (req, res) {
	const rows=[]	
	//databasecount+=1
	const sql=req.body.SQL
	try {
		db.serialize( function () {
			db.all(sql, function(err, rows){
				console.log("SQL:",sql)
				var stat=(err==null)?"OK":"Error - "+err
				//console.log("database query#"+databasecount.toString() + " " + stat)
				res.json({err:err, rows:rows})
			})		
		})
	} 
	catch(err) {console.log("SQLITE ERROR...", err)}
}


