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

  *library_edit_view (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const userAnimeCol = yield user.anime().fetch()
        const userAnime = userAnimeCol.value()
        AnimeService.insertDisplayTitles(userAnime)

        const allAnime = (yield Anime.all()).value()
        const availableAnime = _.differenceBy(allAnime, userAnime, 'id')
        AnimeService.insertDisplayTitles(availableAnime)

        let currentAnime;
        const animeId = request.param('id')
        if(animeId) {
          currentAnime = userAnimeCol.find('id',parseInt(animeId));
          if(currentAnime) {
            AnimeService.insertDisplayTitle(currentAnime)
          }
        }

        yield response.sendView('library_edit', {user: user.attributes, available_anime: availableAnime, status_types: statusTypes, current_anime: currentAnime})
      } else {
        forget('user_id')  //remove the id from session if it's not valid, because it's useless
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  }

  *library_save (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        const params = request.all()
        const animeId = params.anime

        const userAnimeCol = yield user.anime().fetch()

        if(userAnimeCol.find('id',parseInt(animeId))) {
          yield user.anime().detach(animeId)
        }
        yield user.anime().attach(animeId, {status: params.status, rating: params.rating})
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
