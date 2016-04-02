'use strict'

const Lucid = use("Lucid")

class CastMember extends Lucid {
  static get table () {
    return 'cast'
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
  person () {
    return this.belongsTo('App/Model/Person')
  }
  character () {
    return this.belongsTo('App/Model/Character')
  }
}

module.exports = CastMember
