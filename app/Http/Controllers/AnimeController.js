'use strict';

const Anime = use('App/Model/Anime');
const Studio = use('App/Model/Studio');
const CastMember = use('App/Model/CastMember');
const User = use('App/Model/User');

class AnimeController {
  *view_anime (request, response) {
    let userData, userAnimeCol;
    const userId =  yield request.session.get('user_id');
    if(userId) {
      const user = yield User.find(userId);
      userAnimeCol = yield user.anime().fetch();
      userData = user.attributes
    }

    const animeId = request.param('id');
    let anime;
    if(userAnimeCol)
      anime = userAnimeCol.find('id', parseInt(animeId));
    if (!anime) {
      anime = (yield Anime.find(animeId)).attributes;
    }
    const studio = (yield Studio.find(anime.studio)).attributes;

    /*const cast = yield CastMember.where('anime_id', 1).with('person', 'character').fetch();
    for(let i=0; i<cast.value().length; i++) {
      console.log(cast.value()[i]);
    }*/

    /*if(!anime.nr_episodes)
    {
      return anime.nr_episodes == "Unknown";
    }*/
    yield response.sendView('anime', {user: userData, anime: anime , studio: studio})
  }
}

module.exports = AnimeController;
