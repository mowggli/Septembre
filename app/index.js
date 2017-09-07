const express = require('express');
const fileExists = require('file-exists');
const fs = require('fs');// <-- module.exports/require
const sprintf = require('sprintf-js').sprintf;
vsprintf = require('sprintf-js').vsprintf
const app = express();
const port = 4000;
const __parentdirname = __dirname.substring(0, __dirname.lastIndexOf('/'));
var reqnum=0;
var errnum=0;
/* serves GET requests from url's '/filename' tq /public/filename existe */
/* /!\ won't log anything */
//app.use(express.static('public'));

app.set('views', __parentdirname + '/Vues');
app.set('view engine', 'ejs');

/* serves get requests */
app.get('/*', (req, res, next) => {
  reqnum++;
  var statuscode =200;
  console.log(vsprintf(' %s. %s a %s %s on %s', [reqnum,'Received', 'GET', 'request', req.url]));
  if (req.url=="/error") {
    var err = new Error(reqnum +". Cannot get /error.");
    err.status =500;
    throw err;
  } else if (req.url=="/") {
    res.statusMessage=reqnum +". GET OK";
    var variable='les choses changent...';
    var liens=["images/rose.JPG","file.txt","documents/public/myfiles/publicmyfile.txt","dummy.png"];
    res.render('index',{title:"the main page",variable:variable,liens:liens});
  } else {
    var file=req.url;
    if (file.indexOf("/myfiles/")==0) {
        file=file.replace("myfiles", "public");
    }
    if (file.indexOf("/public")!=0) {
        file="/public"+file;
    }
    var file = __parentdirname +  file;
    if (fileExists.sync(file)) {
      res.statusMessage=reqnum +". GET OK.";
      res.status(200).sendFile(file);
    } else {
      var err = new Error(reqnum +". Cannot GET " + req.url);
      next(err);
    }
  }
});

/* Serves post requests on /api */
app.post('/api', function(req, res, next){
  reqnum++;
  console.log(" "+reqnum +". Received a POST request on "+req.url);
  // Alex dit: T'as juste besoin de: req.body (enfin si t'as body-parser...)
  var body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', ()  => {
    if (body != '') {
      var obj = JSON.parse(body);
      if (typeof obj.arg == "number") {
        var str = obj.arg.toString();
        //write in file :
        var filename = __parentdirname + "/POSTrequestanswers.json";
        fs.appendFile(filename,  str + "\n", (err) => {
          if(err) {
            // à tester parce que je ne sais pas où irais cette erreur
            return console.log(err+'oops');
          }
        });
        res.statusMessage=reqnum +". POST OK.";
        res.send(reqnum +'. Argument is '+str+'.');
      } else {
        var err = new Error(reqnum +'. Cannot POST. Type of argument is '+typeof obj.arg+'.');
        err.status =500;
        next(err);
      }
    } else {
      var err = new Error(reqnum +'. Cannot POST. No argument provided.');
      err.status =500;
      next(err);
    }
  });
});

app.use(function(req, res, next){
  var err = new Error(reqnum+'. Not found.');
  next(err);   //ou  throw err;
});

/* Handling errors */
app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV == 'dev') {
    console.log('E'+err.message);
  }
  err.status=err.status||404;
  res.status(err.status||404).send(err.message);
  //res.status(err.status).render('error',{title:err.status+' error',statusCode:err.status,statusMessage:err.message});
});

app.listen(port, () => {
console.log("(using https:\/\/github.com/alexei/sprintf.js to log)");
  console.log(sprintf('The %2$s is %3$s on %1$s %4$d.\n', 'port', 'server', 'listening',port));
  //console.log("Server listening on port ${port}"); //marche pas dans ce fichier
});
