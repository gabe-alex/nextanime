'use strict';

const User = use('App/Model/User');
const Anime = use('App/Model/Anime');
const UserService = use("App/Services/UserService");
const _ = require('lodash');


const statusTypes = {
  planning: "Planning",
  watching: "Watching",
  on_hold: "On Hold",
  completed: "Completed",
  dropped: "Dropped",
  ignored: "Ignored"
};


class LibraryController {
  *library(request, response) {
    const userAnime = (yield request.user.anime().fetch()).value();

    const allAnime = (yield Anime.all()).value();
    const availableAnime = _.differenceBy(allAnime, userAnime, 'id');

    yield response.sendView('library', {
      user: request.user.attributes,
      user_anime: userAnime,
      available_anime: availableAnime,
      status_types: statusTypes
    })
  }

  *library_edit_view(request, response) {
    const userAnimeCol = yield request.user.anime().fetch();
    const userAnime = userAnimeCol.value();

    const allAnime = (yield Anime.all()).value();
    const availableAnime = _.differenceBy(allAnime, userAnime, 'id');

    let currentAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnimeCol.find('id', parseInt(animeId));
    }

    yield response.sendView('library_edit', {
      user: request.user.attributes,
      available_anime: availableAnime,
      status_types: statusTypes,
      current_anime: currentAnime
    })
  }

  *library_save(request, response) {
    const params = request.all();
    const animeId = params.anime;

    const userAnimeCol = yield request.user.anime().fetch();

    if (userAnimeCol.find('id', parseInt(animeId))) {
      yield request.user.anime().detach(animeId)
    }
    yield request.user.anime().attach(animeId, {status: params.status, rating: params.rating});
    yield request.user.update();
    yield UserService.rebuildRecommendations(request.user);

    response.redirect('/library')
  }

  *library_remove(request, response) {
    const params = request.all();
    yield request.user.anime().detach(params.id);
    yield request.user.update();
    yield UserService.rebuildRecommendations(request.user);

    response.redirect('/library')
  }

  *user_profile(request, response) {
    const userAnime = yield request.user.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime.status === 'watching'
    }).value();
    yield response.sendView('user_profile', {user: request.user.attributes, watching: watching})
  }
}

module.exports = LibraryController;
