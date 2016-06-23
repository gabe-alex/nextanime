'use strict';

const User = use('App/Model/User');
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
    const userId =  yield request.session.get('user_id');
    if(userId) {
      request.user = yield User.query().where('id', userId).first();
    }

    const userAnime = yield request.user.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime._pivot_status === 'watching';
    });
    const completed = userAnime.filter(function (anime) {
      return anime._pivot_status === 'completed';
    });
    yield response.sendView('user_profile', {user: request.user, completed: completed.value(), watching: watching.value(), user_anime: userAnime.value()})
  }


  *library_view(request, response) {
    const userId =  yield request.session.get('user_id');
    if(userId) {
      request.user = yield User.query().where('id', userId).first();
    }

    const userAnime = yield request.user.anime().fetch();
    const allAnime = yield Anime.all();
    const availableAnime = allAnime.differenceBy(userAnime, 'id');

    yield response.sendView('library', {
      user: request.user,
      user_anime: userAnime.value(),
      available_anime: availableAnime.value(),
      status_types: statusTypes
    })
  }


  *library_edit_view(request, response) {
    const userId =  yield request.session.get('user_id');
    if(userId) {
      request.user = yield User.query().where('id', userId).first();
    }

    const userAnime = yield request.user.anime().fetch();

    const allAnime = yield Anime.all();
    const availableAnime = allAnime.differenceBy(userAnime, 'id');

    let currentAnime, newAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnime.find(['id', parseInt(animeId)]);
      if (!currentAnime) {
        currentAnime = yield Anime.find(animeId);
      }
    }

    yield response.sendView('library_edit', {
      user: request.user,
      available_anime: availableAnime.value(),
      status_types: statusTypes,
      current_anime: currentAnime
    })
  }


  *library_edit_save(request, response) {
    const userId =  yield request.session.get('user_id');
    if(userId) {
      request.user = yield User.query().where('id', userId).with('anime').first();
    }

    const params = request.all();
    const animeId = params.anime;

    const userAnime = yield request.user.anime().fetch();

    if (userAnime.find(['id', parseInt(animeId)])) {
      yield request.user.anime().detach(animeId);
    }
    if(params.save) {
      yield request.user.anime().attach({[animeId]: {status: params.status, rating: params.rating}});
    }
    yield request.user.update();
    yield Recommendation.rebuildRecommendations(request.user);

    response.redirect('/library')
  }
}

module.exports = LibraryController;
