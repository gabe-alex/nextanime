'use strict';

const Lucid = use('Lucid');


class AnimeRelation extends Lucid {
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime () {
    return this.belongsTo('App/Model/Anime', 'anime_from')
  }
  related_anime () {
    return this.belongsTo('App/Model/Anime', 'anime_to')
  }
  type () {
    return this.belongsTo('App/Model/AnimeRelationType')
  }
}

module.exports = AnimeRelation;
