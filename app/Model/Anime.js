'use strict'

const Lucid = use("Lucid")

class Anime extends Lucid {
  static get table () {
    return 'anime' //because everyone knows the plural for anime is not "animes"...
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  aliases () {
    return this.hasMany('App/Model/AnimeAlias')
  }
  type () {
    return this.belongsTo('App/Model/AnimeType', 'type_id')
  }
  studio () {
    return this.belongsTo('App/Model/Studio')
  }
  genres () {
    return this.belongsToMany('App/Model/Genre', 'anime_genres')
  }
  cast () {
    return this.hasMany('App/Model/CastMember')
  }
  staff () {
    return this.hasMany('App/Model/StaffMember')
  }
  relations () {
    return this.hasMany('App/Model/AnimeRelation', 'anime_from_id')
  }
  users () {
    return this.belongsToMany('App/Model/User', 'users_anime')
  }
}

module.exports = Anime
