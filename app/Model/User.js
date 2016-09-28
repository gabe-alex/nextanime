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
    return this.belongsToMany('App/Model/Anime', 'users_anime').withPivot('status', 'rating','normalized_rating');
  }
  similar() {
    return this.belongsToMany('App/Model/User', 'users_similar', 'this_user_id', 'other_user_id').withPivot('common_series_nr', 'rating_similarity');
  }
}

module.exports = User;
