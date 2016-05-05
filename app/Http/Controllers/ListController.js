'use strict'

const List = use('App/Model/Anime'),
  ListService = use("App/Services/ListService")

class ListController {
  *library (request, response) {
    const userId =  yield request.session.get('user_id')
    if(userId) {
      const anime = yield Anime.all()
      if (anime) {
        const titleAnime = (yield anime.title().fetch()).value()
        const englishTitleAnime = (yield anime.english_title().fetch()).value()
        const descriptionAnime = (yield anime.description().fetch()).value()
        ListService.insertDisplayTitles(titleAnime)
        ListService.insertDisplayEnglishTitles(englishTitleAnime)
        ListService.insertDisplayDescriptions(descriptionAnime)
        yield response.sendView('animedatabase', {anime: anime.attributes})
      } else {
        forget('user_id')
        response.redirect('/mainpage')
      }
    } else {
        response.redirect('/mainpage')
      }
  }
}

module.exports = ListController
