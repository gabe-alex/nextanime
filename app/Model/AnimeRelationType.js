'use strict';

const Lucid = use('Lucid');


class AnimeRelationType extends Lucid {
  static get table () {
    return 'anime_relation_types'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime () {
    return this.hasMany('App/Model/AnimeRelation')
  }
}

module.exports = AnimeRelationType;
