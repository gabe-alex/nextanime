'use strict';

const Recommendation = use("Recommendation");


class RecommendationsController {
  *index(request, response) {
    const recs = yield Recommendation.getRecommendations(request.currentUser, 30);
    yield response.sendView('recommendations', {anime: recs.value()})
  }
}

module.exports = RecommendationsController;
