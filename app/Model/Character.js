'use strict'

const Lucid = use("Lucid")

class Character extends Lucid {
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  aliases () {
    return this.hasMany('App/Model/CharacterAlias')
  }
  cast () {
    return this.hasMany('App/Model/CastMember')
  }
}

module.exports = Character
