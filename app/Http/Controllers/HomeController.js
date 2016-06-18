'use strict';

const User = use('App/Model/User');
const Anime = use('App/Model/Anime');
const UserService = use("App/Services/UserService");

class HomeController {

  * index (request, response) {
    let userData;
    let recs;
    const userId =  yield request.session.get('user_id');
    if(userId) {
      const user = yield User.find(userId);
      userData = user.attributes;
      recs = (yield UserService.getRecommendations(user)).value();
    }

    yield response.sendView('index', {user: userData, recs: recs})

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
