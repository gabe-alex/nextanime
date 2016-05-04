'use strict'

const Lucid = use("Lucid")

class User extends Lucid {
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }

  anime () {
    return this.belongsToMany('App/Model/Anime', 'users_anime').withPivot('rating', 'status')
  }
}

module.exports = User
