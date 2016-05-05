'use strict'

const List = use('App/Model/Anime'),
  ListService = use("App/Services/ListService")

class ListController {
  *library (request, response) {

      const anime = yield Anime.all()
      if (anime) {
        const titleAnime = (yield anime.title().fetch()).value()
        const englishTitleAnime = (yield anime.english_title().fetch()).value()
        const descriptionAnime = (yield anime.description().fetch()).value()
        ListService.insertDisplayTitles(userAnime)
        yield response.sendView('animebase', {anime: anime.attributes})
      } else {
        forget('anime')
        response.redirect('/mainpage')
      }

  }
}

module.exports = ListController
