'use strict'

const User = use('App/Model/User'),
  AnimeService = use("App/Services/AnimeService")


class UserController {
  *library (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const userAnime = (yield user.anime().fetch()).value() //returneaza direct din tabelul anime
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

  *user_profile(request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const userAnime = yield user.anime().fetch()
        const watching = userAnime.filter(function (anime) {
          return anime.status === 'watching'
        }).value()
        AnimeService.insertDisplayTitles(watching)
        yield response.sendView('user_profile', {user: user.attributes, watching: watching})
      } else {
        response.redirect('/')
      }
    } else {
      response.redirect('/')
    }
  }
}

module.exports = UserController
