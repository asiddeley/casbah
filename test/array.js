var assert = require('assert');

describe('Array', function() {
	
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  /*
  describe('Equality {a:{b:1}} VS {a:{b:1}}', function() {
    it('should return OK, but Docs say not', function() {
		assert.equal( {a:{b:1}}, {a:{b:1}} )
    })
  })
  */
   
})


var FS=require("fs")
describe("fs [fileSystem]", function(){
	
	describe("#readdirSync(__dirname)", function(){
		var c=FS.readdirSync(__dirname)
		it("should return an array...", function() {
			assert.ok(c instanceof Array)
		})		
	})	
})


