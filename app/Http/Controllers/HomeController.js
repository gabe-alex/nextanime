'use strict';

const User = use('App/Model/User');
const Anime = use('App/Model/Anime');
const Recommendation = use("Recommendation");

class HomeController {
  *index (request, response) {
    let user, recs;
    const userId =  yield request.session.get('user_id');
    if(userId) {
      user = yield User.find(userId);
      recs = yield Recommendation.getRecommendations(user, 5);
    }
    const top = yield Recommendation.getTopAnime(5);
    const newAnime = yield Anime.query().orderBy('created_at','desc').limit(5).fetch();

    yield response.sendView('home', {user: user, recs: recs.value(), top: top.value(), new: newAnime.value()});
  }
}

module.exports = HomeController;
