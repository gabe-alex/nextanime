'use strict'

const Lucid = use("Lucid")

class AnimeRelationType extends Lucid {
  static get table () {
    return 'anime_relation_types'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  anime () {
    return this.hasMany('App/Model/AnimeRelation')
  }
}

module.exports = AnimeRelationType
