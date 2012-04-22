var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');
fs.readFile('my.peg','ascii',function(err,data) {
console.log(data);
var parse=PEG.buildParser(data).parse;

assert.deepEqual(parse("(a \t b \n c)"), ["a", "b", "c"]);
assert.deepEqual(parse("'(1 2 3)"), ["quote",[ 1,2,3]]);

});
