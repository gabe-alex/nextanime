'use strict';

const User = use('App/Model/User');

class Auth {
  *handle (request, response, next) {
    const userId =  yield request.session.get('user_id');
    if(userId) {
      const user = yield User.find(userId);
      if (user) {
        request.user = user;
        yield next
      } else {
        yield request.session.forget('user_id');  //remove the id from session if it's not valid, because it's useless
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }
}

module.exports = Auth;
