'use strict';

const UserService = use("App/Services/UserService");
const User = use('App/Model/User');
const AnimeService = use("App/Services/AnimeService");


class RecommendationsController {
  *index(request, response) {
    yield UserService.rebuildRecommendations(request.user);  //TODO: don't do this every time
    const recs = (yield UserService.getRecommendations(request.user)).value();
    AnimeService.insertDisplayTitles(recs);
    yield response.sendView('recommendations', {user: request.user.attributes, anime: recs})
  }
}

module.exports = RecommendationsController;
