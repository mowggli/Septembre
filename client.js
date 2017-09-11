const request = require('request');
const sprintf = require('sprintf-js').sprintf;
vsprintf = require('sprintf-js').vsprintf
var okreq =0;
var erreq=0;

/* Common callback : */

var callback = function(err, res, body){
  if(err){
    console.log('\nerror:      \n'+ err);
    erreq++;
  } else {
    console.log('\nstatus Code and Message:    ('+ res.statusCode + ')  ' + res.statusMessage);
    //console.log('href:                       '+ this.uri.href);
    if (res.statusCode==200) {
      okreq++;
    } else {
      erreq++;
    }
    console.log('path:                       '+ this.uri.path);
    console.log('body:               '+ body);
  }
  console.log(vsprintf('#successful requests :%s\n#failed requests :%s', [okreq,erreq]));
}

// GET Requests :
// GET requests that should follow through
request('http://localhost:4000/', callback);
request('http://localhost:4000/file.txt', callback);
request('http://localhost:4000/documents/otherfile.txt', callback);
request('http://localhost:4000/myfiles/file.txt', callback);
request('http://localhost:4000/myfiles/documents/otherfile.txt', callback);
request('http://localhost:4000/public/file.txt', callback);
request('http://localhost:4000/public/documents/myfiles/myfile.txt', callback);
request('http://localhost:4000/public/documents/myfiles/public/mypublicfile.txt', callback);
request('http://localhost:4000/public/documents/public/publicfile.txt', callback);
request('http://localhost:4000/public/documents/public/myfiles/publicmyfile.txt', callback);
// GET requests that should produce a 404 error
request('http://localhost:4000/dir/myfiles/documents/otherfile.txt', callback);

request('http://localhost:4000/myfiles/notafile.txt', callback);
request('http://localhost:4000/notadir', callback);
request('http://localhost:4000/notafile.txt', callback);
request('http://localhost:12000/', callback);
request('http://localhost:4000/error', callback);
// POST Requests :
request.post({url: 'http://localhost:4000/api',body: JSON.stringify({arg:7})}, callback);
request.post({url: 'http://localhost:4000/api',body: JSON.stringify({arg:8.0})}, callback);
request.post({url: 'http://localhost:4000/api',body: JSON.stringify({arg:9, arg2:13, arg3:[102]})}, callback);
// POST Requests that fail:
request.post({url: 'http://localhost:4000/api',body: JSON.stringify({arg:'12'})}, callback);
request.post({url: 'http://localhost:4000/api',body: JSON.stringify({arg1:12})}, callback);
request.post('http://localhost:4000/public/file.txt', callback);
request.post('http://localhost:4000/api', callback); // fait tout planter
// --> Fail 10 SERVE 13
