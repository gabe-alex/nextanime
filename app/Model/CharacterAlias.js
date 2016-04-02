'use strict'

const Lucid = use("Lucid")

class CharacterAlias extends Lucid {
  static get table () {
    return 'character_aliases'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  character () {
    return this.belongsTo('App/Model/Character')
  }
}

module.exports = CharacterAlias
