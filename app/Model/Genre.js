'use strict';

const Lucid = use('Lucid');


class Genre extends Lucid {
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime () {
    return this.belongsToMany('App/Model/Anime', 'anime_genres')
  }
}

module.exports = Genre;
