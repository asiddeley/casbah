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

const fs=require("fs")
const Canvas = require("canvas")
const path=require("path")

//colour index to rgb string
const cix2rgb=function(c){
	switch (c){
	case 0: return "rgb(0,0,0)"; break; //black
	case 1: return "rgb(255,0,0)"; break; //red
	case 2: return "rgb(255,255,0)"; break; //yellow
	case 3: return "rgb(0,255,0)"; break; //green
	case 4: return "rgb(0,255,255)"; break; //cyan	
	case 5: return "rgb(0,0,255)"; break; //blue
	case 6: return "rgb(255,0,255)"; break; //magenta
	case 7: return "rgb(255,255,255)"; break; //white
	case 8: return "rgb(128,128,128)"; break; //lightest grey
	case 9: return "rgb(64,64,64)"; break; //grey
	case 10: return "rgb(32,32,32)"; break; //grey
	case 11: return "rgb(16,16,16)"; break; //grey
	case 12: return "rgb(8,8,8)"; break; //grey
	case 13: return "rgb(4,4,4)"; break; //grey
	case 14: return "rgb(2,2,2)"; break; //darkest grey
	default: return "rgb(0,0,0)"; break; //black
	}
}


exports.make_png=function(sld, background){
	//sld - filename of source acad sld file to convert eg. '/uploads/test.sld'

	var i = sld.indexOf(".")
	if (i != -1 ) {var png=sld.substring(0,i)+".png"} 
	else {var png=sld+".png"; sld+=".sld";}
	//console.log("source:",sld);
	//console.log("dest:",png);
	
	
	fs.readFile(sld, function(err, data){
		var i=0; //byte index	
		
		if (err) {console.log(err.message); return;}
		const buf = Buffer.from(data);
		//buf.readUIntBE(offset, byteLength[, noAssert])
		console.log("\nFILENAME")
		console.log(sld)
		console.log("HEADER")
		console.log("ID (AutoCAD Slide):", buf.toString("ascii", 0, 13))
		console.log("always 56:", buf.readUInt8(17).toString(16))
		console.log("level indicator (2):", buf.readUInt8(18))

		const width=buf.readUInt16LE(19)
		console.log("width:", width)
		const height=buf.readUInt16LE(21)
		console.log("height:", height)

		const canvas = new Canvas(width, height)
		const ctx = canvas.getContext('2d')
		ctx.translate(0, height)
		ctx.scale(1,-1);
		//ctx.rotate(Math.PI);

		ctx.fillStyle=cix2rgb(background);

		ctx.fillRect(0,0,width, height);

		console.log("aspect ratio:", buf.readUInt32LE(23)/10000000)
		console.log("hardware fill (0 or 2):", buf.readUInt16LE(27)) 
		console.log("LE test (1234):", buf.readUInt16LE(29).toString(16))
		console.log("BE test (1234):", buf.readUInt16BE(29).toString(16))
		console.log("----------")
		i+=31; //advance index

		var x,y;
		var eof=false, first=false, hob, lob;
		while (i<buf.length && !eof){
			//RECORD TYPE
			hob=buf.readUInt8(i+1); //High order 
			lob=buf.readUInt8(i); //low order byte
			//VECTOR
			if(hob <= 0x7F){
				//console.log("Vector");
				ctx.moveTo(buf.readUInt16LE(i),	buf.readUInt16LE(i+2));
				ctx.lineTo(buf.readUInt16LE(i+4),buf.readUInt16LE(i+6));
				ctx.stroke();
				i+=8; 
			} 
			//RESERVED
			else if (hob <= 0xFA ) {i+=2;}
			//OFFSET VECTOR
			else if (hob == 0xFB ){
				console.log("Offset vector");
				i+=2;
			}
			//END OF FILE
			else if (hob == 0XFC){
				console.log("End of file");
				eof=true;
				i+=2;
			}
			//FILL
			else if (hob == 0XFD){
				x=buf.readInt16LE(i+2);
				y=buf.readInt16LE(i+4); 
				//console.log("Solid fill:", x, y);
				i+=6; 
				if (y<0){
					//start of fill
					if (first==false){first=true;}
					//end of fill
					else {ctx.closePath(ctx);ctx.fill(ctx);}
				}
				else {
					if (first==true){ctx.beginPath();ctx.moveTo(x,y);first=false;}
					else {ctx.lineTo(x,y);}
				}				
			}
			//COMMON ENDPOINT VECTOR
			else if (hob==0XFE){
				console.log("Common endpoint vector");
				i+=5;
			}
			else if (hob==0XFF){
				//console.log("New colour", lob);
				ctx.strokeStyle=cix2rgb(lob);
				ctx.fillStyle=cix2rgb(lob);
				i+=2;
			}
		} //while not eof
		//write

		var out = fs.createWriteStream(png);
		var stream = canvas.pngStream();
		stream.on('data', function(chunk){ out.write(chunk);});
		stream.on('end', function(){ console.log('The PNG stream ended');});
		out.on('finish', function(){ console.log('The PNG file was created.');});
	
		
	}); //readFile
	

} //convert

/**************


Slide File Format

Note  This information is for experienced programmers, and is subject to change without notice.

AutoCAD slide files are screen images written by the MSLIDE command and read by the VSLIDE command. This section describes the format of slide files for the benefit of developers who wish to incorporate support for AutoCAD slides into their programs.

A slide file consists of a header portion (31 bytes) and one or more data records of variable length. All coordinates and sizes written to the slide file reflect the graphics area of the display device from which the slide was created with point (0,0) located at the lower-left corner of the graphics area. For AutoCAD Release 9 and later, the slide file header consists of the following fields:
Slide file header

Field 			Bytes 	Description
/////// note - Start with byte index 1 (not 0)
ID string 		17		"AutoCAD Slide" CR LF ^Z NUL
Type indicator 	1		Currently set to 56 (decimal)
Level indicator 1		Currently set to 2
High X dot		2		width of the graphics area: 1, in pixels
High Y dot		2		Height of the graphics area: 1, in pixels
Aspect ratio	4		Graphics area aspect ratio (horizontal size/vertical size in inches), scaled by 10,000,000. This value is always written with the least significant byte first.
Hardware fill	2		Either 0 or 2 (value is unimportant)
Test number		2		A number (1234 hex) used to determine whether all 2-byte values in the slide were written with the high-order byte first (Intel 8086-family CPUs) or the low-order byte first (Motorola 68000-family CPUs)
TOTAL			31


Data records follow the header. Each data record begins with a 2-byte field whose high-order byte is the record type. The remainder of the record may be composed of 1-byte or 2-byte fields as described in the following table. To determine whether the 2-byte fields are written with the high-order byte first or the low-order byte first, examine the Test number field of the header that is described earlier.

Slide file data records	Record 

type(hex) 	Bytes	Meaning			Description

00-7F		8		Vector			The from-X coordinate for an ordinary vector. From-Y, to-X, and to-Y follow in that order as 2-byte values. The from point is saved as the last point.

80-FA		--		Undefined		Reserved for future use.

FB			5		Offset vector	The low-order byte and the following three bytes specify the endpoints (from-X, from-Y, to-X, to-Y) of a vector, in terms of offsets (-128 to +127) from the saved last point. The adjusted from point is saved as the last point for use by subsequent vectors.

FC			2		End of file		The low-order byte is 00.

FD			6		Solid fill		The low-order byte is always zero. The following two 2-byte values specify the X and Y coordinates of one vertex of a polygon to be solid filled. Three to ten such records occur in sequence. A Solid fill record with a negative Y coordinate indicates the start or end of such a flood sequence. In the start record, the X coordinate indicates the number of vertex records to follow.

FE			3		Common endpoint vector	This is a vector starting at the last point. The low-order byte and the following byte specify to-X and to-Y in terms of offsets (-128 to +127) from the saved last point. The adjusted to point is saved as the last point for use by subsequent vectors.

FF			2		New color		Subsequent vectors are to be drawn using the color number indicated by the low-order byte.

If a slide contains any vectors at all, a New color record will be the first data record. The order of the vectors in a slide, and the order of the endpoints of those vectors, may vary.

For example, the following is an annotated hex dump of a simple slide file created on an IBM PC/AT with an IBM Enhanced Graphics Adapter. The slide consists of a white diagonal line from the lower-left corner to the upper-right corner of the graphics area, a green vertical line near the lower-left corner, and a small red rectangle at the lower-left corner.
41 75 74 6F 43 41         ID string ("AutoCAD Slide" CR LF ^Z NUL)
44 20 53 6C 69 64
65 0D 0A 1A 00
56                        Type indicator (56)
02                        Level indicator (2)
3C 02                     High X dot (572)
24 01                     High Y dot (292)
0B 80 DF 00               Aspect ratio (14,647,307 / 10,000,000 = 1.46)
02 00                     Hardware fill (2)
34 12                     Test number (1234 hex)
07 FF                     New color (7 = white)
3C 02 24 01 00 00 00 00   Vector from 572,292 to 0,0. 572,292 becomes
                          "last" point
3 FF                      New color (3 = green)
0F 00 32 00 0F 00 13 00   Vector from 15,50 to 15,19. 15,50 becomes
                          "last" point
01 FF                     New color (1 = red)
12 FB E7 12 CE            Offset vector from 15+18,50-25 (33,25) to 15+18,50-
                          50 (33,0). 33,25 becomes "last" point  
DF FE 00                  Common-endpoint vector from 33,25 to 33-33,25+0
                           (0,25). 0,25 becomes "last" point
00 FE E7                  Common-endpoint vector from (0,25) to 0+0,25-25
                           (0,0). 0,0 becomes "last" point
21 FE 00                  Common-endpoint vector from (0,0) to 0+33,0+0
                           (33,0).33,0 becomes "last" point

00 FC                     End of file 

*******************/








