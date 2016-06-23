'use strict';

const Lucid = use('Lucid');


class StaffMember extends Lucid {
  static get table () {
    return 'staff'
  }
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }
  
  anime () {
    return this.belongsTo('App/Model/Anime')
  }
  person () {
    return this.belongsTo('App/Model/Person')
  }
  role () {
    return this.belongsTo('App/Model/StaffRole')
  }
}

module.exports = StaffMember;
