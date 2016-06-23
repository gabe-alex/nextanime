'use strict';

const Lucid = use('Lucid');


class CharacterAlias extends Lucid {
  static get table () {
    return 'character_aliases'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  character () {
    return this.belongsTo('App/Model/Character')
  }
}

module.exports = CharacterAlias;
