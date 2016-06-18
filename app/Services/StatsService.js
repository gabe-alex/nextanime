'use strict';

const Recommendation = use("Recommendation");
const Anime = use('App/Model/Anime');

class StatsService {
  static *getTopAnime(count) {
    const recIds = yield Recommendation.bestRated(count);
    return Anime.whereIn('id',recIds).fetch();
  }

  static *getNewAnime(count) {
    return Anime.orderBy('created_at','desc').limit(count).fetch();
  }
}

module.exports = StatsService;
