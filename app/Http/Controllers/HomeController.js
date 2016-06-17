'use strict'

const User = use('App/Model/User')
const Anime = use('App/Model/Anime')
const AnimeService = use("App/Services/AnimeService")

class HomeController {

  * index (request, response) {
    let userData;
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const user = yield User.find(userId)
      userData = user.attributes
    }

    const view = yield response.view('index', {user: userData})
    response.send(view)

    const animeId = request.param('id')
    const anime = (yield Anime.find(animeId))
    if (anime) {
      AnimeService.getDisplayNrEps(anime)
    }

    yield response.sendView('anime', {user: userData, anime: anime})

  }

  * userprofile (request, response) {
    const view = yield response.view('user_profile')
    response.send(view)
  }
  * animedatabase (request, response) {
    const view = yield response.view('animedatabase')
    response.send(view)
  }
}

module.exports = HomeController
