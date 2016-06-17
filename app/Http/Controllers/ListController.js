'use strict';

const Anime = use('App/Model/Anime');

class ListController {
  *animedatabase (request, response) {
    const anime = (yield Anime.all()).value();
    if (anime) {
      yield response.sendView('animedatabase', {anime: anime})
    }
  }
}

module.exports = ListController;
