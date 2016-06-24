'use strict';

const Anime = use('App/Model/Anime');
const Recommendation = use("Recommendation");

class HomeController {
  *index (request, response) {
    let recs;
    if(request.currentUser) {
      recs = (yield Recommendation.getRecommendations(request.currentUser, 5)).value();
    }
    const top = yield Recommendation.getTopAnime(5);
    const newAnime = yield Anime.query().orderBy('created_at','desc').limit(5).fetch();

    yield response.sendView('home', {recs: recs, top: top.value(), new: newAnime.value()});
  }
}

module.exports = HomeController;
