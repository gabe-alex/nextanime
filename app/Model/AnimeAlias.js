'use strict';

const Lucid = use('Lucid');


class AnimeAlias extends Lucid {
  static get table () {
    return 'anime_aliases'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime () {
    return this.belongsTo('App/Model/Anime')
  }
}

module.exports = AnimeAlias;
