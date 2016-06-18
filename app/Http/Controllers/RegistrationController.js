'use strict';

const Validator = use('Validator'),
  Collection = use('Collection'),
  User = use('App/Model/User'),
  Hash = use('Hash'),
  Config = use("Config");

class RegistrationController {
  *index (request, response) {
    yield response.sendView('register')
  }

  *submit (request, response) {
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
}

module.exports = RegistrationController;
