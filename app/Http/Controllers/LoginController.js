'use strict';

const Validator = use('Validator');
const Collection = use('Collection');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use("Config");
const co = require('co');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


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


class LoginController {
  *index (request, response) {
    yield response.sendView('login')
  }

  *local_login (request, response) {
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

        yield request.session.put('user_id', user.get('id'));
        response.redirect('/')
      });
    });
    passport_func(request, response);
  }

  *logout (request, response) {
    yield request.session.forget('user_id');
    response.redirect('/');
  }
}

module.exports = LoginController;
