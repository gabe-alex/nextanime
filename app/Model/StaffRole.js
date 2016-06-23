'use strict';

const Lucid = use('Lucid');


class StaffRole extends Lucid {
  static get table () {
    return 'staff_roles'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  staff () {
    return this.hasMany('App/Model/StaffMember')
  }
}

module.exports = StaffRole;
