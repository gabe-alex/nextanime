'use strict';

const Anime = use('App/Model/Anime');

class ListController {
  *animedatabase (request, response) {
    const anime = (yield Anime.with('studio').fetch()).value();
    if (anime) {
      yield response.sendView('animedatabase', {anime: anime})
    }
  }
}

module.exports = ListController;
