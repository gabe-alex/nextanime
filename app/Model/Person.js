'use strict';

const Lucid = use('Lucid');


class Person extends Lucid {
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  cast_roles () {
    return this.hasMany('App/Model/CastMember')
  }
  staff_roles () {
    return this.hasMany('App/Model/StaffMember')
  }
}

module.exports = Person;

