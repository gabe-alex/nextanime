'use strict'

const Lucid = use("Lucid")

class Studio extends Lucid {
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

module.exports = Studio
