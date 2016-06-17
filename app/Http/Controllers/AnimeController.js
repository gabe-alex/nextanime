'use strict'

const Anime = use('App/Model/Anime')
const Studio = use('App/Model/Studio')
const Character = use('App/Model/Character')
const AnimeService = use("App/Services/AnimeService")
const User = use('App/Model/User')

class AnimeController {
  *view_anime (request, response) {
    let userData;
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      userData = user.attributes
    }

    const animeId = request.param('id')
    const studioId = request.param('id')
    const anime = (yield Anime.find(animeId))
    const studio = (yield anime.studio().fetch()).value()

    if (anime) {
      //AnimeService.insertDisplayEnglishTitle(anime)
      //AnimeService.insertDisplayNrEps(anime)
      //AnimeService.insertDisplayAnimeDescription(anime)
      AnimeService.insertDisplayStudio(studio)
    }

    yield response.sendView('anime', {user: userData, anime: anime/*, studio: studio*/})
  }

  *index (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      if (user) {
        yield UserService.rebuildRecommendations(user)  //TODO: don't do this every time
        const recs = (yield UserService.getRecommendations(user)).value()
        yield response.sendView('index', {user: user.attributes, recs: recs})
      } else {
        yield request.session.forget('user_id')
        yield response.sendView('index', {})
      }
    } else {
      yield response.sendView('index', {})
    }
  }

  *index (request, response) {

        yield UserService.rebuildRecommendations(user)  //TODO: don't do this every time
        const recs = (yield UserService.getRecommendations(user)).value()
        yield response.sendView('index', {user: user.attributes, recs: recs})

      }
}

module.exports = AnimeController
