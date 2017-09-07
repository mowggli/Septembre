const express = require('express');
const fileExists = require('file-exists');
const fs = require('fs');
const app = express();
const port = 4000;
const environment = process.env.NODE_ENV;
const prompt = require('./../my_modules/logging'); // <-- module.exports/require
//import {prompt} from './../my_modules/logging';  // <-- export/import
const answerpost = require('./../my_modules/answerpost');
const __parentdirname = __dirname.substring(0, __dirname.lastIndexOf('/'));

/* serves GET requests from url's like '/filename' */
/* /!\ won't log anything */
app.use(express.static('public'));

/* serves GET request from '/' */
app.get('/', (req, res) => {
  var path = __parentdirname + '/Vues/index.html';
  prompt.reqlog(req,"Serving file '"+path+"'.",0);
  res.statusMessage='GET main page ok';
  res.status(200).sendFile(path);
});

/* serves page '/error' */
app.get('/error', (req, res) => {
  res.statusMessage='GET: error on /error';
  var err = new Error('oops!');
  err.status =500;
  throw err;
  //res.send(absence);
});

/* serves url's like '/myfiles/filename' with the file asked */
app.get('/myfiles/*', (req, res) => {
  var regexp = /\/myfiles\//g;
  var totrim = req.url.match(regexp);   // ou: totrim = regexp.exec(req.url);
  var fileasked = req.url.substr(totrim[0].lastIndexOf('/'));
  var filename = __parentdirname + '/public' + fileasked;
  if (fileExists.sync(filename)) {
    // J'aurai aimé connaitre la façon la plus simple de servir une requete
    // sur une url differente de celle qui a fait la requête.
    var location = '/myfiles' + fileasked;
    prompt.reqlog(req , "Asked for file :" + fileasked + ". It exists. I'm serving it onto " + location + ".", 0);
    res.setHeader('Location', location);
    res.statusMessage='GET static file GOT';
    res.status(201).sendFile(filename);
  } else {
    prompt.reqlog(req , "The file " + filename + " doesn't exist." , 0);
    var err = new Error();
    err.status = 404;
    err.message = "The file " + fileasked + " doesn't exist.";
    res.statusMessage = 'GET which static file?';
    throw err;
  }
});

/* Serves all other get routes that don't match the previous with a 404 error */
app.get('/*', (req, res) => {
  var err = new Error("The url asking is not one I serve."); // ou: err.message = "The url asking is not one I serve.";
  err.status = 404;
  res.statusMessage = 'GET what??';
  throw err;   // ou next(err); ??
});

/* Serves post requests on /api */
app.post('/api', function(req, res,next){
  /* Content reception : */
  var body = '';
  req.on('data', chunk => {
    prompt.arglog(req,"A chunk of data has arrived : " , chunk);
    //...", chunk) n'a pas le meme effet que ..." + chunk)
    body += chunk;
  });
  req.on('end', ()  => {
    try {
        var a=answerpost(body,req);
        res.writeHead(a.statusCode, a.statusMessage, a.headers);
        res.end(a.responseBody);
        // j'aurais bien aimé envoyer la réponse directement depuis answerpost
      } catch (e) {
        var err = e;
        err.status=500;
        res.statusMessage = 'POST fail';
        next( err);
      }
  });
});

/* Serves a 404 error to all remaining post requests */
app.post('*', function(req, res){
  var err = new Error('What??');
  err.status = 404;
  err.message = "The url asking is not one I serve.";
  res.statusMessage = 'POST what??';
  throw err;
});


/* Handling errors */
app.use(function(err, req, res, next) {
  //prompt.errlog(req , err + " Status : " + err.status , 0);
  prompt.errlogerr(req , err.toString(), err.status);
  if(err.status !== 404) {
    res.status(err.status).send(err.message);
  } else {
    res.status(err.status).send(err.message || '** wild goose **');
  }
});


prompt.log("..............................[Environment : "+environment+ "].................................[version " + __filename.substr(__filename.lastIndexOf('/')+1)+"]",'............................................................\n..................................................................................................................................................................');

app.listen(port, () => {
  prompt.log("","............................................Server listening on port "+ port +"..........................................\n..................................................................................................................................................................");
});
