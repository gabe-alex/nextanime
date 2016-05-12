'use strict'

const UserService = use("App/Services/UserService"),
  User = use('App/Model/User'),
  AnimeService = use("App/Services/AnimeService")

class RecommendationsController {
  *index (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        yield UserService.rebuildRecommendations(user)  //TODO: don't do this every time
        const recs = (yield UserService.getRecommendations(user)).value()
        AnimeService.insertDisplayTitles(recs)
        yield response.sendView('recommendations', {user: user.attributes, anime: recs})
      } else {
        yield request.session.forget('user_id')
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }
}

module.exports = RecommendationsController
