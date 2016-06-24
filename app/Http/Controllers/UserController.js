'use strict';

const Anime = use('App/Model/Anime');
const Recommendation = use("Recommendation");
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
  *user_profile(request, response) {
    const userAnime = yield request.currentUser.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime._pivot_status === 'watching';
    });
    const completed = userAnime.filter(function (anime) {
      return anime._pivot_status === 'completed';
    });
    yield response.sendView('user_profile', {completed: completed.value(), watching: watching.value(), user_anime: userAnime.value()})
  }


  *library_view(request, response) {
    const userAnime = yield request.currentUser.anime().fetch();

    yield response.sendView('library', {
      user_anime: userAnime.value()
    })
  }


  *library_edit_view(request, response) {
    const userAnime = yield request.currentUser.anime().fetch();

    const allAnime = yield Anime.all();
    const availableAnime = allAnime.differenceBy(userAnime.value(), 'id');

    let currentAnime, newAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnime.find(['id', parseInt(animeId)]);
      if (!currentAnime) {
        currentAnime = yield Anime.find(animeId);
      }
    }

    yield response.sendView('library_edit', {
      available_anime: availableAnime.value(),
      status_types: statusTypes,
      current_anime: currentAnime
    })
  }


  *library_edit_save(request, response) {
    const params = request.all();
    const animeId = params.anime;

    const userAnime = yield request.currentUser.anime().fetch();

    if (userAnime.find(['id', parseInt(animeId)])) {
      yield request.currentUser.anime().detach([animeId]);
    }
    if(params.save) {
      yield request.currentUser.anime().attach({[animeId]: {status: params.status, rating: params.rating}});
    }
    yield request.currentUser.update();
    yield Recommendation.rebuildRecommendations(request.currentUser);

    response.redirect('/library')
  }
}

module.exports = LibraryController;
