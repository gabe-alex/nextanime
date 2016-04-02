'use strict'

const Lucid = use("Lucid")

class AnimeAlias extends Lucid {
  static get table () {
    return 'anime_aliases'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  anime () {
    return this.belongsTo('App/Model/Anime')
  }
}

module.exports = AnimeAlias
