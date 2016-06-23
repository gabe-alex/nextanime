'use strict';

const Lucid = use('Lucid');


class AnimeType extends Lucid {
  static get table () {
    return 'anime_types'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime () {
    return this.hasMany('App/Model/Anime')
  }
}

module.exports = AnimeType;
