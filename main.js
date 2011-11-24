//http://weblogs.asp.net/pwelter34/archive/2005/07/19/google-toolbar-spell-check-api.aspx
var xml2js = require('xml2js'),
request = require('request'),
_  = require('underscore')._;

function xmlsnip(txt){
return '<?xml version="1.0" encoding="utf-8" ?>' + 
'<spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="1">' +
'<text><![CDATA[ '+txt+' ]]></text>'+
'</spellrequest>';
}

exports.check = function(txt,cb){
request({uri:"http://www.google.com/tbproxy/spell?lang=en&hl=en",method:"POST",body:xmlsnip(txt)}, function (error, response, body) {
if(error) cb(error);
  if (!error && response.statusCode == 200) {
var parser = new xml2js.Parser({attrkey: 'dta', charkey: 'opts'});
parser.parseString(body, function (err, result) {

	result.c = _.map(result.c,function(val){
        val.dta.wrd = txt.substr(val.dta.o,val.dta.l);
	val.dta.lvl = val.dta.s; delete val.dta.s;
        val.dta.len = val.dta.l; delete val.dta.l;
        val.dta.offset = val.dta.o; delete val.dta.o;
	if(val.opts) val.opts = val.opts.split("\t")
	return val
	});
	cb(null,result);
    });
  }
});
}
