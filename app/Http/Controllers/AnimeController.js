'use strict';

const Anime = use('App/Model/Anime');
const Studio = use('App/Model/Studio');
const CastMember = use('App/Model/CastMember');

class AnimeController {
  *view_anime (request, response) {
    const animeId = request.param('id');
    let anime;
    if(request.currentUser) {
      const userAnime = yield request.currentUser.anime().fetch();
      anime = userAnime.find(['id', parseInt(animeId)]);
    }
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
    yield response.sendView('anime', {anime: anime})
  }

  *animedatabase (request, response) {
    const limit = 30;
    const page = request.param('page', '1'); //parameters are seen as string

    const anime = yield Anime.query().with("studio").paginate(parseInt(page),limit); // with BEFORE paginate...gj adonis...G.J.
    console.log(anime.meta.total);

    yield response.sendView('animedatabase', {anime: anime})
  }
}

module.exports = AnimeController;
