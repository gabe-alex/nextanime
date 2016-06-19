'use strict';

const Validator = use('Validator');
const Collection = use('Collection');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use("Config");
const co = require('co');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


//Prepare local login strategy
passport.use('local', new LocalStrategy(
  function (username, password, done) {
    return co(function* () {
      const user = yield User.where('username', username).first().fetch();

      if (!user.size()) {   //.size() = num of fields returned, will be 0 of no records are found
        return done(null, false, {username: Config.get('messages.validation.username.exists')});
      }

      const result = yield Hash.verify(password, user.get('password'));
      if (!result) {
        return done(null, false, {password:  Config.get('messages.validation.password.matches')});
      }

      return done(null, user);
    });
  }
));

//Prepare facebook login strategy
passport.use('facebook', new FacebookStrategy(
  {
    clientID        : Config.get('fb.appID'),
    clientSecret    : Config.get('fb.appSecret'),
    callbackURL     : Config.get('fb.callbackUrl')
  },
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {

    console.log('profile', profile);

    // asynchronous
    process.nextTick(function* () {

      // find the user in the database based on their facebook id
      const user = yield User.findOne({ 'fb_id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          const fbUser = new User();

          // set all of the facebook information in our user model
          fbUser.fb.id    = profile.id; // set the users facebook id
          fbUser.fb.access_token = access_token; // we will save the token that facebook provides to the user

          // save our user to the database
          fbUser.save(function(err) {
            if (err)
              return console.error(err);

            // if successful, return the new user
            return done(null, fbUser);
            
          });
        }

      });
    });

  }));




class AccountController {
  *view_register (request, response) {
    yield response.sendView('register')
  }

  *do_register (request, response) {
    const params = request.all();

    //Generic validations
    const rules = {
      username : 'required|min:3',
      password : 'required|min:6',
      password_confirm: 'required|same:password'
    };

    const validation = yield Validator.validateAll(rules, params);
    const validationMessages = Config.get('messages.validation');
    let errors = {};
    if (validation.fails()) {
      errors = new Collection(validation.messages())
        .groupBy('field')
        .mapValues(function(value) {return new Collection(value).first().validation})  //eliminate pointless array and bad message
        .mapValues(function(value, key) {return validationMessages[key][value]})  //add better error messages
        .value()
    }

    if(!errors.username) {
      //Check if username is available
      const user = yield User.where('username', params.username).first().fetch();
      if(user.size()) {
        errors.username = validationMessages.username.unique
      }
    }

    if(!new Collection(errors).isEmpty()) {
      const view = yield response.view('register', {params: params, errors: errors});
      return response.badRequest(view)
    }

    const hashedPassword = yield Hash.make(params.password);
    yield User.create({username: params.username, password: hashedPassword});

    //TODO: show success message
    yield response.redirect('/')
  }

  *view_login (request, response) {
    yield response.sendView('login')
  }

  *do_local_login (request, response) {
    request.body = request.all();  //Workaround for passport expecting form data in request.body

    //Prepare passport's auth function and then call it
    const passport_func = passport.authenticate('local', function (err, user, err_info) {
      return co(function*() {
        if (err) {
          return console.error(err);
        }

        if (!user) {
          const view = yield response.view('login', {params: request.all(), errors: err_info});
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.get('id'));// saves user id in cookie
        response.redirect('/')
      });
    });
    passport_func(request, response);
  }

  *do_login_fb (request, response) {

  }

  *do_logout (request, response) {
    yield request.session.forget('user_id');
    response.redirect('/');
  }
}



module.exports = AccountController;
