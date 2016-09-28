'use strict';

const Anime = use('App/Model/Anime');
const RecommendationService = make("App/Services/RecommendationService");

class HomeController {
  *index (request, response) {
    let recs;
    if(request.currentUser) {
      recs = (yield RecommendationService.getRecommendations(request.currentUser)).value();
    }
    //const top = (yield Recommendation.getTopAnime(5)).value();
    const top = [];
    const newAnime = yield Anime.query().orderBy('created_at','desc').limit(5).fetch();

    yield response.sendView('home', {recs: recs, top: top, new: newAnime.value()});
  }
}

module.exports = HomeController;
