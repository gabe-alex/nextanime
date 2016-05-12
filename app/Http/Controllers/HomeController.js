'use strict'

const User = use('App/Model/User');

class HomeController {

  * index (request, response) {
    let user;
    const userId =  yield request.session.get('user_id')
    if(userId) {
      user = yield User.find(userId)
    }

    const view = yield response.view('index', {user: user.attributes})
    response.send(view)
  }

  * animepage (request, response) {
    const view = yield response.view('anime')
    response.send(view)
  }

  * userprofile (request, response) {
    const view = yield response.view('user_profile')
    response.send(view)
  }
  * animedatabase (request, response) {
    const view = yield response.view('animedatabase')
    response.send(view)
  }
}

module.exports = HomeController
