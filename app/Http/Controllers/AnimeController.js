'use strict';

const Anime = use('App/Model/Anime');
const Studio = use('App/Model/Studio');
const CastMember = use('App/Model/CastMember');
const User = use('App/Model/User');

class AnimeController {
  *view_anime (request, response) {
    let user;
    const userId =  yield request.session.get('user_id');
    if(userId) {
      user = yield User.query().where('id', userId).with('anime.studio').first();
    }

    const animeId = request.param('id');
    let anime;
    if(user && user.relations.anime)
      anime = user.relations.anime.find(['id', parseInt(animeId)]);
    if (!anime) {
      anime = yield Anime.query().where('id', animeId).with('studio').first();
    }

    /*const cast = yield CastMember.where('anime_id', 1).with('person', 'character').fetch();
    for(let i=0; i<cast.value().length; i++) {
      console.log(cast.value()[i]);
    }*/

    /*if(!anime.nr_episodes)
    {
      return anime.nr_episodes == "Unknown";
    }*/
    yield response.sendView('anime', {user: user, anime: anime})
  }

  *animedatabase (request, response) {
    const anime = yield Anime.query().with('studio').fetch();
    yield response.sendView('animedatabase', {anime: anime.value()})
  }
}

module.exports = AnimeController;
