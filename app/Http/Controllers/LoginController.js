'use strict'

const Validator = use('Validator'),
  Collection = use('Collection'),
  User = use('App/Model/User'),
  Hash = use('Hash')

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
      const errors = {username: validationErrorMessages.username.unique}
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
}

module.exports = LoginController
