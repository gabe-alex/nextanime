'use strict';

const Anime = use('App/Model/Anime');
const Studio = use('App/Model/Studio');
const CastMember = use('App/Model/CastMember');

class AnimeController {
  *view_anime (request, response) {
    const animeId = request.param('id');
    let anime;
    if(request.currentUser) {
      const userAnime = yield request.currentUser.anime().with('studio').fetch(); // don't frget .with('studio')
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

  *search (request, response) {
    const query = request.param('query');

    const foundAnime = yield Anime.query().where('title', 'like', query+'%').orWhere('romaji_title', 'like', query+'%').orWhere('english_title', 'like', query+'%').limit(20).fetch();
    const userAnime = yield request.currentUser.anime().fetch();
    const availableAnime = foundAnime.differenceBy(userAnime.value(), 'id');

    response.json(availableAnime.value());
  }
}

module.exports = AnimeController;
