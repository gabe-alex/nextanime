'use strict';

const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use('Config');
const _ = require('lodash');
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
      const user = yield User.query().where('email', email).first();

      if (!user) {
        return done(null, false, {email: Config.get('messages.validation.email.exists')});
      }

      const result = yield Hash.verify(password, user.password);
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
  function(access_token, refresh_token, profile, done) {
    return co(function* () {
      let user = yield User.query().where('fb_id', profile.id).first();

      if (!user) {
        user = new User();
        user.profile_name = profile.displayName;
        user.fb_id = profile.id;
        user.fb_access_token = access_token;
        yield user.save();
      }
      return done(null, user);
    });
  }
));


class AccountController {
  *view_register (request, response) {
    yield response.sendView('register');
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
    let errors = {};
    if (validation.fails()) {
      errors = _(validation.messages())
        .groupBy('field')
        .mapValues(function(value) {return new _(value).first().validation})  //eliminate pointless array and bad message
        .mapValues(function(value, key) {return validationMessages[key][value]})  //add better error messages
        .value();
    }

    if(!errors.email) {
      //Check if email is available
      const userMail = yield User.query().where('email', params.email).first();
      if(userMail) {
        errors.email = validationMessages.email.unique;
      }
    }

    if(!_(errors).isEmpty()) {
      const view = yield response.view('register', {params: params, errors: errors});
      return response.badRequest(view)
    }

    const addr = addrs.parseOneAddress(params.email);
    const profile_name = addr.local;

    const hashedPassword = yield Hash.make(params.password);

    const user = new User();
    user.profile_name = profile_name;
    user.email = params.email;
    user.password = hashedPassword;
    yield user.save();

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
          return response.unauthorized(view);
        }

        if (!user) {
          const view = yield response.view('login', {params: request.all(), errors: err_info});
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.id);
        response.redirect('/')
      });
    });
    passport_func(request, response);
  }

  *login_fb_start (request, response) {
    const passport_func = passport.authenticate('facebook', function (err, user, err_info) {
      return co(function*() {
        if (err) {
          console.error(err);
          const view = yield response.view('login', {errors: {fb: err.message}});
          return response.unauthorized(view)
        }
      });
    });

    passport_func(request, response);
  }

  *login_fb_callback (request, response) {
    const passport_func = passport.authenticate('facebook', function (err, user, err_info) {
      return co(function*() {
        if (err) {
          console.error(err);
          const view = yield response.view('login', {errors: {fb: err.message}});
          return response.unauthorized(view)
        }

        if (!user) {
          const view = yield response.view('login', {errors: err_info});
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.id);
        response.redirect('/');
      });
    });
    passport_func(request, response);
  }

  *do_logout (request, response) {
    yield request.session.forget('user_id');
    response.redirect('/');
  }
}

module.exports = AccountController;
