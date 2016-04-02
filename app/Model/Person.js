'use strict'

const Lucid = use("Lucid")

class Person extends Lucid {
  static get table () {
    return 'people'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  cast_roles () {
    return this.hasMany('App/Model/CastMember')
  }
  staff_roles () {
    return this.hasMany('App/Model/StaffMember')
  }
}

module.exports = Person
