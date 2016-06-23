'use strict';

const Lucid = use('Lucid');


class User extends Lucid {
  static get createTimestamp () {
    return null
  }
  static get updateTimestamp () {
    return null
  }

  anime() {
    return this.belongsToMany('App/Model/Anime', 'users_anime').withPivot(/*'rating',*/ 'status');
  }
}

module.exports = User;
