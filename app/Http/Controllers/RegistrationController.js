'use strict'

const Validator = use('Validator'),
  Collection = use('Collection'),
  User = use('App/Model/User'),
  Hash = use('Hash')

const validationErrorMessages = {
  'username' : {
    'required': "Username is required.",
    'unique': "Username is already taken."
  },
  'password' : {
    'required': "Password is required.",
    'min': "Password must have at least 6 characters."
  },
  'password_confirm' : {
    'required': "Password Confirm is required.",
    'same': "Passwords don't match."
  }
}

class RegistrationController {
  *index (request, response) {
    yield response.sendView('register')
  }

  *submit (request, response) {
    const params = request.all()

    //Generic validations
    const rules = {
      username : 'required',
      password : 'required|min:6',
      password_confirm: 'required|same:password'
    }

    const validation = yield Validator.validateAll(rules, params)
    let errors = {}
    if (validation.fails()) {
      errors = new Collection(validation.messages())
        .groupBy('field')
        .mapValues(function(value) {return new Collection(value).first().validation})  //eliminate pointless array and bad message
        .mapValues(function(value, key) {return validationErrorMessages[key][value]})  //add better error messages
        .value()
    }

    if(!errors.username) {
      //Check if username is available
      const user = yield User.where('username', params.username).first().fetch()
      if(user.size()) {
        errors.username = validationErrorMessages.username.unique
      }

      if(!new Collection(errors).isEmpty()) {
        const view = yield response.view('register', {params: params, errors: errors})
        return response.badRequest(view)
      }
    }

    const hashedPassword = yield Hash.make(params.password)
    yield User.create({username: params.username, password: hashedPassword})

    //TODO: show success message
    yield response.sendView('register')
  }
}

module.exports = RegistrationController
