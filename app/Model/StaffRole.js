'use strict'

const Lucid = use("Lucid")

class StaffRole extends Lucid {
  static get table () {
    return 'staff_roles'
  }
  static get timestamps () {
    return false
  }
  static get softDeletes () {
    return false
  }
  
  staff () {
    return this.hasMany('App/Model/StaffMember')
  }
}

module.exports = StaffRole
