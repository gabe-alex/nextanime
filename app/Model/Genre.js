'use strict'

const Lucid = use("Lucid")

class Genre extends Lucid {
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  anime () {
    return this.belongsToMany('App/Model/Anime', 'anime_genres')
  }
}

module.exports = Genre
