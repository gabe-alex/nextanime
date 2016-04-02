'use strict'

const Lucid = use("Lucid")

class AnimeType extends Lucid {
  static get table () {
    return 'anime_types'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  anime () {
    return this.hasMany('App/Model/Anime')
  }
}

module.exports = AnimeType
