'use strict';

const User = use('App/Model/User');
const Anime = use('App/Model/Anime');
const AnimeService = use("App/Services/AnimeService");
const _ = require('lodash');


const statusTypes = {
  planning: "Planning",
  watching: "Watching",
  on_hold: "On Hold",
  completed: "Completed",
  dropped: "Dropped",
  ignored: "Ignored"
};


class UserController {
  *library(request, response) {
    const userAnime = (yield request.user.anime().fetch()).value();
    AnimeService.insertDisplayTitles(userAnime);

    const allAnime = (yield Anime.all()).value();
    const availableAnime = _.differenceBy(allAnime, userAnime, 'id');
    AnimeService.insertDisplayTitles(availableAnime);

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
    AnimeService.insertDisplayTitles(userAnime);

    const allAnime = (yield Anime.all()).value();
    const availableAnime = _.differenceBy(allAnime, userAnime, 'id');
    AnimeService.insertDisplayTitles(availableAnime);

    let currentAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnimeCol.find('id', parseInt(animeId));
      if (currentAnime) {
        AnimeService.insertDisplayTitle(currentAnime)
      }
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

    response.redirect('/library')
  }

  *library_remove(request, response) {
    const params = request.all();
    yield request.user.anime().detach(params.id);
    yield request.user.update();

    response.redirect('/library')
  }

  *user_profile(request, response) {
    const userAnime = yield request.user.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime.status === 'watching'
    }).value();
    AnimeService.insertDisplayTitles(watching);
    yield response.sendView('user_profile', {user: request.user.attributes, watching: watching})
  }
}

module.exports = UserController
