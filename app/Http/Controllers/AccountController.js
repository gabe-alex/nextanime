'use strict';

const Validator = use('Validator');
const Collection = use('Collection');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use("Config");
const co = require('co');
const addrs = require("email-addresses");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


//Prepare local login strategy
passport.use('local', new LocalStrategy({
    usernameField: 'email'
  },
  function (email, password, done) {
    return co(function* () {
      const user = yield User.where('email', email).first().fetch();

      if (!user.size()) {   //.size() = num of fields returned, will be 0 of no records are found
        return done(null, false, {email: Config.get('messages.validation.email.exists')});
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
    return co(function* () {
      console.log('profile', profile);

      // find the user in the database based on their facebook id
      let user = yield User.where('fb_id', profile.id).first().fetch();
      if (!user.size()) {
        console.log(profile.displayName);
        const userId = yield User.create({profile_name: profile.displayName, fb_id: profile.id, fb_access_token: access_token});
        user = new Collection((yield User.find(userId)).attributes); //find doesn't keep the same format as where
      }
      return done(null, user);
    });
  }
));


class AccountController {
  *view_register (request, response) {
    yield response.sendView('register')
  }

  *do_register (request, response) {
    const params = request.all();

    //Generic validations
    const rules = {
      email : 'required|email',
      password : 'required|min:6',
      password_confirm: 'required|same:password'
    };

    const validation = yield Validator.validateAll(rules, params);
    const validationMessages = Config.get('messages.validation');
    console.log(validation);
    let errors = {};
    if (validation.fails()) {
      errors = new Collection(validation.messages())
        .groupBy('field')
        .mapValues(function(value) {return new Collection(value).first().validation})  //eliminate pointless array and bad message
        .mapValues(function(value, key) {return validationMessages[key][value]})  //add better error messages
        .value()
    }

    if(!errors.email) {
      //Check if email is available
      const userMail = yield User.where('email', params.email).first().fetch();
      if(userMail.size()) {
        errors.email = validationMessages.email.unique
      }
    }

    if(!new Collection(errors).isEmpty()) {
      const view = yield response.view('register', {params: params, errors: errors});
      return response.badRequest(view)
    }

    const addr = addrs.parseOneAddress(params.email);
    const profile_name = addr.local;

    const hashedPassword = yield Hash.make(params.password);
    yield User.create({profile_name: profile_name, email: params.email, password: hashedPassword});

    //TODO: show success message
    yield response.redirect('/')
  }

  *view_login (request, response) {
    yield response.sendView('login')
  }

  *do_local_login (request, response) {
    //Prepare passport's auth function and then call it
    const passport_func = passport.authenticate('local', function (err, user, err_info) {
      return co(function*() {
        if (err) {
          console.error(err);
          const view = yield response.view('login', {errors: err_info});
          return response.unauthorized(view)
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

  *login_fb_start (request, response) {
    console.log("fb1 start");
    const passport_func = passport.authenticate('facebook', function (err, user, err_info) {
      return co(function*() {
        console.log("pp1 start");
        if (err) {
          console.error(err);
          const view = yield response.view('login', {errors: {fb: err.message}});
          return response.unauthorized(view)
        }

        if (!user) {
          const view = yield response.view('login', {errors: err_info});
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.get('id'));// saves user id in cookie
        response.redirect('/');
        console.log("pp1 end");
      });
    });

    passport_func(request, response);
    console.log("fb1 end");
  }

  *login_fb_callback (request, response) {
    console.log("fb2 start");
    const passport_func = passport.authenticate('facebook', function (err, user, err_info) {
      return co(function*() {
        console.log("pp2 start");
        if (err) {
          console.error(err);
          const view = yield response.view('login', {errors: {fb: err.message}});
          return response.unauthorized(view)
        }
        console.log("pp2 err");
        if (!user) {
          const view = yield response.view('login', {errors: err_info});
          return response.unauthorized(view)
        }
        console.log("pp2 user");
        yield request.session.put('user_id', user.get('id'));// saves user id in cookie
        response.redirect('/');
        console.log("pp2 end");
      });
    });
    passport_func(request, response);
    console.log("fb2 end");
  }

  *do_logout (request, response) {
    yield request.session.forget('user_id');
    response.redirect('/');
  }
}

module.exports = AccountController;
