'use strict';

const Lucid = use('Lucid');


class Character extends Lucid {
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  aliases () {
    return this.hasMany('App/Model/CharacterAlias')
  }
  cast () {
    return this.hasMany('App/Model/CastMember')
  }
}

module.exports = Character;
