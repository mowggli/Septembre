var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var ScientistSchema = new Schema({
      type: String,
      name: {first: String, last: { type: String, trim: true } },
      dates: { birth: Number, death: Number },
      age: { type: Number, min: 0, max: 165},
      knownFor: Buffer, //https://docs.nodejitsu.com/articles/advanced/buffers/how-to-use-buffers/
      discipline: String,
      living: Boolean
    },{toObject:{virtuals:true},toJSON:{virtuals: true}});


// Virtual
ScientistSchema
.virtual('fullName')
.get(function () {  return this.name.first + ' ' + this.name.last; });


var currentTime = new Date();
var currentYear = currentTime.getFullYear();

/*
ScientistSchema
.virtual('alive')
.get(function(){
  //console.log('this is '+JSON.stringify(this));
  if (this.dates.death) {
    var age = Math.abs(this.dates.death - this.dates.birth);
    //var age =
    return "No, died in "+this.dates.death+" at the age of "+age+" years old.";}
  else {
    var age = Math.abs(currentYear - this.dates.birth);
    return "Yes ("+age+" years old right now).";}
});
*/

/*
ScientistSchema
.virtual('virtualAge')
.get(function () {
  //console.log('this is '+JSON.stringify(this));
  if (this.dates.death) {
    return Math.abs(this.dates.death - this.dates.birth);
  } else {
    var currentYear = currentTime.getFullYear();
    return Math.abs(currentYear - this.dates.birth);
  }
});
*/

//Export model
module.exports = mongoose.model('Scientist', ScientistSchema);
