'use strict'

const User = use('App/Model/User'),
  Anime = use('App/Model/Anime'),
  AnimeService = use("App/Services/AnimeService"),
  _ = require('lodash')

const statusTypes = {
  planning: "Planning",
  watching: "Watching",
  on_hold: "On Hold",
  completed: "Completed",
  dropped: "Dropped",
  ignored: "Ignored",
}

class UserController {
  *library (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const userAnime = (yield user.anime().fetch()).value()
        AnimeService.insertDisplayTitles(userAnime)

        const allAnime = (yield Anime.all()).value()
        const availableAnime = _.differenceBy(allAnime, userAnime, 'id')
        AnimeService.insertDisplayTitles(availableAnime)

        yield response.sendView('library', {user: user.attributes, user_anime: userAnime, available_anime: availableAnime, status_types: statusTypes})
      } else {
        forget('user_id')  //remove the id from session if it's not valid, because it's useless
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }

  *library_add (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const params = request.all()
        yield user.anime().attach(params.anime, {status: params.status, rating: params.rating})
        yield user.update()

        response.redirect('/library')
      } else {
        forget('user_id')
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }

  *library_remove (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const params = request.all()
        yield user.anime().detach(params.id)
        yield user.update()

        response.redirect('/library')
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
