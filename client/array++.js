/*****
CASBAH
Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
*****/
exports.array_diff=function(a, b) {
	//Thanks to https://radu.cotescu.com/javascript-diff-function/
	//saftey first
	if (typeof a=="undefined"){a=[];}
	if (typeof b=="undefined"){b=[];}
	if (a.length < b.length) {var t=a; a=b; b=t;}
	
	//diffArray
	var seen = []
	var diff = [];
	for ( var i = 0; i < b.length; i++) { seen[b[i]] = true; }
	for ( var i = 0; i < a.length; i++) { if (!seen[a[i]]) { diff.push(a[i]);}}
	return diff;
};

exports.array_insert_after=function(list, item, neighbour){
	//copy rows array before modifying it
	//var orig=[]; for (var i in list){orig[i]=list[i];}

	var pos=list.indexOf(neighbour);
	if (pos == -1){	list.push(item);}
	else {list.splice(pos+1, 0, item);}
	
	//console.log("array_add_at list, item, neighbour, position:", JSON.stringify(list), item, neighbour, pos);	
	
	return list;
};

exports.array_nth_swap=function(arr, n, offset){
	/**
	Moves nth item up one spot in the array
	@param arr - array of items
	@param n - index of first item to swap
	@param offset - index offset for other item to swap
	**/
	if (typeof offset=="undefined"){offset = -1;}
	//n is likely to be a string so ensure it's a number
	var d=Number(n)+offset;
	//console.log("swap item ", n, " & ", d);
	if (n>=0 && n<arr.length && d >= 0 && d<arr.length){
		//console.log("swap occured");
		var temp=arr[d];arr[d]=arr[n];arr[n]=temp;
	};
	return arr;
};

exports.array_fromindex_toindex=function(arr, nf, nt){
	nf=Number(nf); //from
	nt=Number(nt); //to
	if (nt<nf){
		arr.splice(nt,0,arr[nf]);
		arr.splice(nf+1,1);
	} else if (nf<nt){
		//console.log("from",nf,"to",nt, "arr", arr);
		arr.splice(nt+1,0,arr[nf]);
		//console.log("arr", arr);
		arr.splice(nf,1);
		//console.log("arr", arr);
	}	
}

exports.array_remove=function(list, item){
	/**
	copy rows array before modifying it
	**/
	var pos=list.indexOf(item);
	if (pos > -1){list.splice(pos, 1);}
	return list;
};

exports.array_rowidorder=function(rows, rowids){
	/***
	Modifies rows, re-ordering its items by rowid key as listed in rowids 
	@param rows Eg. [{rowid:1, ...}, {rowid:2, ...}, ...]
	@param rowids Eg. [2,1,3,4,5...]
	***/

	//copy rows array before modifying it
	var orig=[]; for (var i in rows){orig[i]=rows[i];}
	
	var getrowbyid=function(rowid){
		for(var i in orig){
			//console.log("GET rowid, orig[i]", rowid, orig[i].rowid);
			if (orig[i].rowid==rowid) {	return orig[i];	}
		} 
		//default 
		return null;
	};
	
	var r=null, j=0;
	for (var i in rowids){
		//console.log("FOR rows[i], getrowbyid", rows[i], getrowbyid( rowids[i] ) )
		r=getrowbyid( rowids[i] );
		if (r != null) {rows[j]=r; j++;}
	};
	
	//delete any remaining 
	while (j<rows.length){rows.splice(j,1); j++;}
	
};



