'use strict'

const User = use('App/Model/User'),
  AnimeService = use("App/Services/AnimeService")

class UserController {
  *library (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const userAnime = (yield user.anime().fetch()).value()
        AnimeService.insertDisplayTitles(userAnime)
        yield response.sendView('library', {user: user.attributes, anime: userAnime})
      } else {
        forget('user_id')
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }
}

module.exports = UserController
