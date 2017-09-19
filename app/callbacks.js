const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/test'; //'mongodb://localhost/test'
//const uri = 'mongodb://mowggli:troWS9ben@ds137464.mlab.com:37464/base_de_donnees_test'
const assert = require('assert');

var jalon= 1;

var Scientist = require('../models/scientist');
/******************************************************************************/
var _mongoose_connect = function  (err) {
      if (err) { return console.log ('ERROR connecting to: ' + uri + '. ' + err);  }
      else {            console.log ('Succeeded connected to: ' + uri);} //console.log("This is the execution of the callback.");
}
/******************************************************************************/
var _saved = function (err,doc){
  if(err){ return console.log('Error saving the document ' + err.message);}
  else{           console.log( 'The document is saved.');}
}
var _created =function (err,doc){
  if(err){ return console.log('Error creating the document ' + err.message);}
  else{           console.log( 'The document is created.');}
}
/******************************************************************************/
var _saved_or_created_scientist = function (err,p,mot){
  if(err){ console.log('Error '+mot+'ing ' + p.fullName + ' ' + err.message);}
  else{
    Scientist.find().exec(function(err,coll) {
      if(err){ return console.log('Error finding Scientist. ' + err.message);}
      else{           console.log(mot+'ed one scientist named '+ JSON.stringify(p.fullName) + ' of '+coll.length+' scientist.');}})
  }
}
var _saved_scientist = function (err,p){_saved_or_created_scientist(err,p,'Sav')}
var _created_scientist = function (err,p){_saved_or_created_scientist(err,p,'Creat')}
/******************************************************************************/
var _showscientists = function  (err, coll) {
  if (err) { return console.log('Error! ' +err.message); }
  else  {
    console.log(vsprintf('%s scientists were found/updated/removed: ',[coll.length]));
    //coll.forEach(x =>{console.log(vsprintf('%s (%s)',[JSON.stringify(x.fullName),x.discipline]));});
    console.log(coll);
  }
}
var _showphysicists = function (err, coll) {
  if (err) { return console.log('Error! ' +err.message); }
  else  {
    console.log(vsprintf('%s physicists of all sorts were found: ',[coll.length]));
    //coll.forEach(x =>{console.log(vsprintf('%s (%s)',[JSON.stringify(x.fullName),x.discipline]));});
    console.log(coll);
  }
}
/******************************************************************************/

module.exports = {
  mongoose_connect: _mongoose_connect,

  saved: _saved,
  created: _created,

  saved_scientist: _saved_scientist,
  created_scientist: _created_scientist,

  showscientists: _showscientists,

  promesse: function () {   console.log('in promise'); },
  landmark: function () {   console.log('JALON '+jalon);  jalon++; }
};
