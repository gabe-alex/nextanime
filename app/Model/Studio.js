'use strict';

const Lucid = use('Lucid');


class Studio extends Lucid {
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

module.exports = Studio;
