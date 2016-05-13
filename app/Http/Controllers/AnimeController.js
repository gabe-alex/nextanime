'use strict'

const Anime = use('App/Model/Anime')
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
    const anime = (yield Anime.find(animeId))
    if (anime) {
      AnimeService.insertDisplayTitles(anime)
    }

    yield response.sendView('anime', {user: userData, anime: anime})
  }
}

module.exports = AnimeController
