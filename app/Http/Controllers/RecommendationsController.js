'use strict';

const UserService = use("App/Services/UserService");
const User = use('App/Model/User');


class RecommendationsController {
  *index(request, response) {
    const recs = (yield UserService.getRecommendations(request.user)).value();
    yield response.sendView('recommendations', {user: request.user.attributes, anime: recs})
  }
}

module.exports = RecommendationsController;
