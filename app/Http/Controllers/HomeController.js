'use strict';

const User = use('App/Model/User');
const Anime = use('App/Model/Anime');
const UserService = use("App/Services/UserService");

class HomeController {

  * index (request, response) {
    let user;
    let recs;
    const userId =  yield request.session.get('user_id');
    if(userId) {
      user = yield User.find(userId);
      recs = (yield UserService.getRecommendations(user)).value();
    }

    yield response.sendView('index', {user: user.attributes, recs: recs})

  }

  * userprofile (request, response) {
    const view = yield response.view('user_profile');
    response.send(view)
  }
  * animedatabase (request, response) {
    const view = yield response.view('animedatabase');
    response.send(view)
  }
}

module.exports = HomeController;
