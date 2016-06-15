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
    'required': "Username is required.",
    'exists': "User not found."
  },
  'password' : {
    'required': "Password is required.",
    'matches': "Incorrect password."
  }
}

class LoginController {
  *index (request, response) {
    yield response.sendView('login')
  }

  *submit (request, response) {
    const params = request.all()

    //Generic validations
    const rules = {
      username : 'required',
      password : 'required'
    }

    const validation = yield Validator.validateAll(rules, params)
    if (validation.fails()) {
      const errors = new Collection(validation.messages())
        .groupBy('field')
        .mapValues(function(value) {return new Collection(value).first().validation})  //eliminate pointless array and bad message
        .mapValues(function(value, key) {return validationErrorMessages[key][value]})  //add better error messages
        .value()

      const view = yield response.view('login', {params: params, errors: errors})
      return response.unauthorized(view)
    }

    //Check if username exists
    const user = yield User.where('username', params.username).first().fetch()
    if(!user.size()) {
      const errors = {username: validationErrorMessages.username.exists}
      const view = yield response.view('login', {params: params, errors: errors})
      return response.unauthorized(view)
    }

    const result = yield Hash.verify(params.password, user.get('password'))
    if (!result) {
      const errors = {password: validationErrorMessages.password.matches}
      const view = yield response.view('login', {params: params, errors: errors})
      return response.unauthorized(view)
    }

    yield request.session.put('user_id', user.get('id'))

    return response.redirect('/')
  }

  *logout (request, response) {
    yield request.session.forget('user_id')
    return response.redirect('/')
  }

  *login_pp (request, response) {
    request.body = request.all();

    passport.use('local', new LocalStrategy(
      function (username, password, done) {
        return co(function* () {
          console.log("validation start")

          const params = request.all();

          const rules = {
            username: 'required',
            password: 'required'
          };

          const validation = yield Validator.validateAll(rules, params)
          if (validation.fails()) {
            const errors = new Collection(validation.messages())
              .groupBy('field')
              .mapValues(function (value) {
                return new Collection(value).first().validation
              })  //eliminate pointless array and bad message
              .mapValues(function (value, key) {
                return validationErrorMessages[key][value]
              })  //add better error messages
              .value()

            return done(null, false, errors);
          }

          const user = yield User.where('username', username).first().fetch()
          if (!user.size()) {
            return done(null, false, {username: validationErrorMessages.username.exists});
          }

          const result = yield Hash.verify(params.password, user.get('password'))
          if (!result) {
            return done(null, false, {password: validationErrorMessages.password.matches});
          }

          console.log("verify ok");
          return done(null, user);
        });
      }));

    let passport_func = passport.authenticate('local', function (err, user, err_info) {
      return co(function* () {
        console.log("login start")

        const params = request.all();

        if (err) {
          return console.error(err);
        }

        if (!user) {
          console.log(err_info)
          const view = yield response.view('login', {params: params, errors: err_info})
          return response.unauthorized(view)
        }

        yield request.session.put('user_id', user.get('id'))
        console.log("login ok")
        return response.redirect('/')
      });
    });

    passport_func(request, response)
  }
}

module.exports = LoginController
