'use strict'

const Lucid = use("Lucid")

class User extends Lucid {
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  static get hidden () {
    return ['password']
  }
  
  anime () {
    return this.belongsToMany('App/Model/Anime', 'users_anime')
  }
}

module.exports = User
