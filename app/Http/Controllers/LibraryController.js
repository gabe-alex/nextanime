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

    let currentAnime, newAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnimeCol.find('id', parseInt(animeId));
      if (!currentAnime) {
        currentAnime = (yield  Anime.find(animeId)).attributes;
      }
    }

    yield response.sendView('library_edit', {
      user: request.user.attributes,
      available_anime: availableAnime,
      status_types: statusTypes,
      current_anime: currentAnime
    })
  }

  *library_edit_save(request, response) {
    const params = request.all();
    const animeId = params.anime;

    const userAnimeCol = yield request.user.anime().fetch();

    if (userAnimeCol.find('id', parseInt(animeId))) {
      yield request.user.anime().detach(animeId)
    }
    if(params.save) {
      yield request.user.anime().attach(animeId, {status: params.status, rating: params.rating});
    }
    yield request.user.update();
    yield UserService.rebuildRecommendations(request.user);

    response.redirect('/library')
  }

  *user_profile(request, response) {


    const userAnime = yield request.user.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime._pivot_status === 'watching';
    }).value();
    const completed = userAnime.filter(function (anime) {
      return anime._pivot_status === 'completed';
    }).value();
    yield response.sendView('user_profile', {user: request.user, completed: completed, watching: watching, user_anime: userAnime})
  }
}

module.exports = LibraryController;
