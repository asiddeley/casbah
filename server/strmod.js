/**********************************
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

exports.substitute=function(sql, params){
	/**************
	Returns a string with substitutions applied to matched substrings within the string.
	1st arrument is the subject string
	2nd argument is an object of key:values
	Where any key matches any portion of 1st argument, that portion is substituted with the corresponding value. 
	
	Why is this function required when db.run has it built in db.run(sql, params, callback) ?
	Because if params have more elements than the sql has placeholders it throws an error
	This function is more forgiving
	*************/
	
	//console.log("sql_params...")
	//ensure these aren't touching terms
	sql=sql.replace(/\(/g, " ( ") 
	sql=sql.replace(/\)/g, " ) ") 
	sql=sql.replace(/=/g, " = ") 
	sql=sql.replace(/,/g , " , ") 
	//console.log("sql after grooming...", sql)
	var terms=sql.split(" ") 
	for (var i in terms){
		
		//term starts with '$' so a parameter, substitute it with it's corresponding vlaue
		if ( terms[i].indexOf("$")==0 ) {
			//console.log("term before...", terms[i].substring(1))
			terms[i]='"'+params[terms[i].substring(1)]+'"'
			//console.log("term after...", terms[i])
		}		
	}
	return terms.join(" ") //unsplit
}

