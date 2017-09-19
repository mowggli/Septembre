// instead of npm start lancer avec DEBUG=express:* node server.js ou  DEBUG=express:router node server.js
// ou node debug server.js cf http://www.tutorialsteacher.com/nodejs/debug-nodejs-application
// ou node --inspect server.js

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
app.set('views', __parentdirname + '/Vues');
app.set('view engine', 'ejs');
const CB = require('./callbacks.js');
const mongo = require('mongodb');
const mongoose = require('mongoose'); // import mongoose from 'mongoose';
//const uri = 'mongodb://localhost:27017/test'; //'mongodb://localhost/test'
const uri = 'mongodb://mowggli:troWS9ben@ds137464.mlab.com:37464/base_de_donnees_test'
const assert = require('assert');
const Scientist = require('../models/scientist');
mongoose.Promise = global.Promise; // Use native promises (mpromise?)

/******************************************************************************/
mongoose.connect(uri, CB.mongoose_connect);
var db = mongoose.connection;
db.on('error', (err) => {
  var err = new Error(reqnum +'. Error connecting to the database.');
  err.status =500;
  next(err);
});
/******************************************************************************/


// serves get requests
app.get('/*', (req, res, next) => {
  reqnum++;
  var statuscode =200;
  console.log(vsprintf(' %s. %s a %s %s on %s', [reqnum,'Received', 'GET', 'request', req.url]));
  if (req.url=="/error") {
    var err = new Error(reqnum +". Cannot get /error.");
    err.status =500;
    next(err);
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

// Serves post requests on /api */
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
      if (typeof obj.arg == "string") {
        /*var str = obj.arg.toString();
        //write in file :
        var filename = __parentdirname + "/POSTrequestanswers.json";
        fs.appendFile(filename,  str + "\n", (err) => {
          if(err) {
            // à tester parce que je ne sais pas où irais cette erreur
            return console.log(err+'oops');
          }
        });*/
        /******************************************************************************/
        // Find  scientists in list with that last name
        Scientist.findOne({'name.last':obj.arg}).select('name -_id discipline dates living age').exec(function(err, doc) {
          if (err||doc==null) {
            var answer = reqnum +'. Did not find a scientist with the name \''+obj.arg+'\' in the database.';
          } else {
            var answer = reqnum +'. Found this scientist in the database: '+ doc.fullName + ' ('+doc.dates.birth+'-'+doc.dates.death+') age = '+doc.age+' (alive = '+doc.living+') discpline = '+doc.discipline;
          }
          res.statusMessage=reqnum +". POST OK.";
          res.send(answer);
        });
        /******************************************************************************/
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

// Where do I close the connection??
//http://theholmesoffice.com/mongoose-connection-best-practice/
/*// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination'); //console.log('closed connection');
    process.exit(0);
  });
});
*/

// Handles errors
app.use(errorHandler);

function errorHandler (err, req, res, next) {
  if (process.env.NODE_ENV == 'dev') {
    console.log('E'+err.message);
  }
  //res.status(err.status||404).send(err.message);
  res.status(err.status||404).render('error',{title:err.status+' error',statusCode:err.status,statusMessage:err.message, stack:err.stack.substr(0,100) });
}

// Listens
app.listen(port, () => {
  console.log(sprintf('The %2$s is %3$s on %1$s %4$d.\n', 'port', 'server', 'listening',port));
});
