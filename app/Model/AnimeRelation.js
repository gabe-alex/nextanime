'use strict'

const Lucid = use("Lucid")

class AnimeRelation extends Lucid {
  static get table () {
    return 'anime_relations'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  anime () {
    return this.belongsTo('App/Model/Anime', 'anime_from')
  }
  related_anime () {
    return this.belongsTo('App/Model/Anime', 'anime_to')
  }
  type () {
    return this.belongsTo('App/Model/AnimeRelationType')
  }
}

module.exports = AnimeRelation
