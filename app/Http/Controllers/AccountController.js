'use strict';

const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use('Config');
const _ = require('lodash');
const co = require('co');
const addrs = require("email-addresses");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


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

function login_callback (err, user, err_info, request, response) {
  return co(function*() {
    if (err) {
      console.error(err);
      const view = yield response.view('login', {action: 'login', errors: {system: err.message}});
      return response.unauthorized(view);
    }

    if (!user) {
      const view = yield response.view('login', {action: 'login', params: request.all(), errors: err_info});
      return response.unauthorized(view)
    }

    yield request.auth.login(user);

    const redirect_url = yield request.session.get('redirect_url', '/');
    yield request.session.forget('redirect_url');
    response.redirect(redirect_url);
  });
}


class AccountController {


  *view_login (request, response) {
    yield response.sendView('login');
  }

  *local_login (request, response) {
    const params = request.all();

    if(params.action === 'register') {
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
        const view = yield response.view('login', {action: 'register', params: params, errors: errors});
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

      yield request.auth.login(user);

      const redirect_url = yield request.session.get('redirect_url', '/');
      yield request.session.forget('redirect_url');
      response.redirect(redirect_url);

    } else {
      try {
        yield request.auth.attempt(params.email, params.password);
        
        const redirect_url = yield request.session.get('redirect_url', '/');
        yield request.session.forget('redirect_url');
        response.redirect(redirect_url);
      } catch(e) {
        const errors = {};
        switch(e.name) {
          case 'UserNotFoundException':
            errors.email=e.message;
            break;
          case 'PasswordMisMatchException':
            errors.password=e.message;
            break;
        }
        const view = yield response.view('login', {params: params, errors: errors});
        response.badRequest(view);
      }
    }
  }

  *login_fb (request, response) {
    passport.authenticate('facebook', function(err, user, err_info) {
      return login_callback(err, user, err_info, request, response);
    })(request, response);
  }

  *do_logout (request, response) {
    yield request.auth.logout();
    response.redirect('/');
  }
}

module.exports = AccountController;
