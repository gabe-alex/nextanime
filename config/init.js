/**
 * Created by onete on 6/13/2016.
 */

var facebook = require('./fb');
//var twitter = require('./twitter');
var User = require('App/Model/User');

module.exports = function(passport){

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ');console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Facebook and Twitter
  facebook(passport);
  twitter(passport);

}
