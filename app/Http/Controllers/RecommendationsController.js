'use strict';

const RecommendationService = make("App/Services/RecommendationService");


class RecommendationsController {
  *index(request, response) {
    const recs = yield RecommendationService.getRecommendations(request.currentUser);
    yield response.sendView('recommendations', {anime: recs.value()})
  }
}

module.exports = RecommendationsController;
