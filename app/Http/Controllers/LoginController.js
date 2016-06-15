'use strict'

const Validator = use('Validator'),
  Collection = use('Collection'),
  User = use('App/Model/User'),
  Hash = use('Hash'),
  co = require('co')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const validationErrorMessages = {
  'username' : {
    'exists': "User not found."
  },
  'password' : {
    'matches': "Incorrect password."
  }
}

class LoginController {
  *index (request, response) {
    yield response.sendView('login')
  }

  *local_login (request, response) {
    request.body = request.all();  //workaround for passport expecting form data in request.body

    passport.use('local', new LocalStrategy(
      function (username, password, done) {
        return co(function* () {
          const user = yield User.where('username', username).first().fetch()
          if (!user.size()) {
            return done(null, false, {username: validationErrorMessages.username.exists});
          }

          const result = yield Hash.verify(params.password, user.get('password'))
          if (!result) {
            return done(null, false, {password: validationErrorMessages.password.matches});
          }

          return done(null, user);
        });
      }
    ));

    const passport_func = passport.authenticate('local', function (err, user, err_info) {
      return co(function*() {
        if (err) {
          return console.error(err);
        }

        if (!user) {
          console.log(err_info)
          const view = yield response.view('login', {params: request.all(), errors: err_info})
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.get('id'))
        return response.redirect('/')
      });
    });
    passport_func(request, response)
  }

  *logout (request, response) {
    yield request.session.forget('user_id')
    return response.redirect('/')
  }
}

module.exports = LoginController
