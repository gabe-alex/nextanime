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
    const studios = (yield Studio.find(studioId))
    if (anime) {
      AnimeService.insertDisplayTitles(anime)
      AnimeService.insertDisplayEnglishTitle(anime)
      AnimeService.insertDisplayNrEps(anime)
      AnimeService.insertDisplayAnimeDescription(anime)
      AnimeService.insertDisplayStudio(studios)
    }

    yield response.sendView('anime', {user: userData, anime: anime, studio: studios})
  }
}

module.exports = AnimeController
