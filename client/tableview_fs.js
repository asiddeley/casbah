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

if (typeof casbah=="undefined") {casbah={};}

casbah.TableView=function(options, options1){
	
	this.options=$.extend(
		{datafile:"__datafile.json", defrow:{"unnamed":"unnamed"}},			
		options,
		options1
	);

	this.div$ = null;
	this.previous={rows:[]};
	//this.__init();
};

casbah.TableView.prototype.empty_datafile=function(){
	//DEP
	//returns an empty datafile content as a string for initialization
	//redundant - do this in on server in uploads.js
	return JSON.stringify({"0":this.options.row});
};

casbah.TableView.prototype.add=function(callback){this.insert(row, callback);};

casbah.TableView.prototype.__init=function(){
	//DEP
	var SQL1=this.SQLselectFirst();
	var SQL2=this.SQLinsert(this.options.defrow);
	var that=this;
	//create table (if not exists) 
	casbah.databaseFS(this.SQLcreate(), function(){
		//then add default row (if none exists)
		casbah.databaseFS(SQL1, function(result){if (result.rows.length==0) {
			//then refresh
			casbah.databaseFS(SQL2, function(){that.refresh();} );
		}});
	});
	
};


casbah.TableView.prototype.insert=function(row, callback){
	/**
	Inserts a new row {n:v, n1:v, n2:v...} into table datafile at the end.
	Note that rowid:count is automatically incremented and injected into row. Inserts a new row into the table. If row is null then the tableView.options.defrow is used.	
	@arg callback (as function) Called following table insert operation with a results hash passed as an argument. 
	Accessing the new row is done like so... function(results){var newrowid=results.rows[0].rowid;}
	@arg callback (as boolean true) Means run the standard refresh function defined for this tableview.options.refresh
	if no arg is provided then the insert operation happens without any callback.
	**/
	//console.log("insert...");
	

	//Callback is provided this result object - {rows:[all_rows], err:err, last[inserted_row]}
	//Doesn't need casbah.databaseFS(), this.SQLxxx()
	var that=this;
	$.ajax({
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: $.param(
			action:"DF_INSERT",
			datafile:this.datafile,
			row:(row || this.defrow)	
		),
		error:function(err){console.log("ajax error:", err);},
		success:function(result){ 
			if (typeof callback=="function"){callback(result);}
			else (if callback==true){that.__refresh(result);}
		},
		type: "POST",
		url: "/uploads"
	});	
};

casbah.TableView.prototype.option=function(optionRev){
	//eq. optionRev={filter:"rowid=rowid LIMIT 1"};
	if (typeof optionRev=="undefined"){return this.options;}
	$.extend(this.options, optionRev);	
};

casbah.TableView.prototype.remove=function(rowid, callback){
	/**
	Removes row number rowid from the table. The rowid number is not reused. Although the SQL operation is delete, the function is named remove since delete is reserved

	@param rowid - id or row to remove from table
	@param callback - if present, table renderer will be called after database operation, and is provided a result object like this {rows:[all_rows], err:err, last[inserted_row]}
	
	Doesn't need: casbah.databaseFS(), this.SQLxxx()	
	**/

	$.ajax({
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		data: $.param(
			action:"DF_DELETE",
			datafile:this.datafile,
			rowid:rowid	
		),
		error:function(err){console.log("ajax error:", err);},
		success:function(result){ 
			if (typeof callback=="function"){callback(result);}
			else (if callback==true){that.__refresh(result);}
		},
		type: "POST",
		url: "/uploads"
	});	
};


casbah.TableView.prototype.refresh=function(){
	//console.log("Refresh...");
	var that=this;
	//casbah.databaseFS(that.SQLselect(), function(result){that.__refresh(result);});
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		data: $.param(
			action:"DF_REFRESH",
			datafile:this.datafile,
			defrow:this.defrow	
		),
		error:function(err){console.log("ajax error:", err);},
		success:function(result){ 
			if (typeof callback=="function"){callback(result);}
			else (if callback==true){that.__refresh(result);}
		},
		type: "POST",
		url: "/uploads"
	});		
	
};

//shortform
casbah.TableView.prototype.re=function(){ this.refresh();};

//internal use only
casbah.TableView.prototype.__refresh=function(result){

	//if (result.rows.length==0){console.log("No result for SQL:", this.SQLselect());}

	//calculate the change...
	var rowids=result.rows.map(function(i){return i.rowid;});
	var previds=this.previous.rows.map(function(i){return i.rowid;});
	//console.log("INSERT rowidsPre, rowids", JSON.stringify(rowidsPre), JSON.stringify(rowids));
	var change={
		count:( result.rows.length - this.previous.rows.length ), 
		rowids:casbah.array_diff(rowids, previds)
	};
	this.previous=result;
	//console.log("__refresh change:", JSON.stringify(change));

	//call refresh
	try { this.options.refresh(result, change);} 
	catch(er) {
		console.log("tableView "+this.options.table+", trouble with refresh function:",er);
	}
	
};

casbah.TableView.prototype.save=function(row, rowid, callback){
	this.update(row, rowid, callrefresh);	
};

casbah.TableView.prototype.update=function(row, rowid, callback){

	$.ajax({
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		data: $.param(
			action:"DF_UPDATE",
			datafile:this.datafile,
			row:row,
			rowid:rowid	
		),
		error:function(err){console.log("ajax error:", err);},
		success:function(result){ 
			if (typeof callback=="function"){callback(result);}
			else (if callback==true){that.__refresh(result);}
		},
		type: "POST",
		url: "/uploads"
	});		
};
