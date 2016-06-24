'use strict';

const Recommendation = use("Recommendation");
const User = use('App/Model/User');


class RecommendationsController {
  *index(request, response) {
    const userId =  yield request.session.get('user_id');
    if(userId) {
      request.user = yield User.query().where('id', userId).with('anime').first();
    }
    
    const recs = yield Recommendation.getRecommendations(request.user, 30);
    yield response.sendView('recommendations', {user: request.user.attributes, anime: recs.value()})
  }
}

module.exports = RecommendationsController;
