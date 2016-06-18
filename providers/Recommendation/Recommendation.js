'use strict';

const raccoon = require('raccoon');


class Recommendation {
  constructor (Config) {
    raccoon.config.className = 'nextanime';
    raccoon.config.numOfRecsStore = 30;

    const host = Config.get('database.redis.connection.host');
    const port = Config.get('database.redis.connection.port');
    const auth = Config.get('database.redis.connection.auth');
    raccoon.connect(port, host, auth);
  }


  addLike (userId, itemId, omitUpdate) {
    return new Promise((resolve, reject) => {
      raccoon.liked(userId, itemId, omitUpdate, function(results) {
        resolve(results)
      })
    })
  }

  addDislike (userId, itemId, omitUpdate) {
    return new Promise((resolve, reject) => {
      raccoon.disliked(userId, itemId, omitUpdate, function(results) {
        resolve(results)
      })
    })
  }

  removeRating (userId, itemId, omitUpdate) {
    return new Promise((resolve, reject) => {
      raccoon.unRated(userId, itemId, omitUpdate, function(results) {
        resolve(results)
      })
    })
  }

  clearUserRatings (userId, omitUpdate) {
    return new Promise((resolve, reject) => {
      raccoon.clearUser(userId, omitUpdate, function(results) {
        resolve(results)
      })
    })
  }

  clearItemRatings (itemId, omitUpdate) {
    return new Promise((resolve, reject) => {
      raccoon.clearItem(itemId, omitUpdate, function(results) {
        resolve(results)
      })
    })
  }

  updateUser (userId) {
    return new Promise((resolve, reject) => {
      raccoon.updateUser(userId, function (results) {
        resolve(results)
      })
    })
  }

  updateItem (itemId) {
    return new Promise((resolve, reject) => {
      raccoon.updateItem(itemId, function (results) {
        resolve(results)
      })
    })
  }

  getRecommandations (userId) {
    return new Promise((resolve, reject) => {
      raccoon.recommendFor(userId, 30, function (results) {  //TODO: put num. of recs in a config
        resolve(results)
      })
    })
  }

  bestRated() {
    return new Promise((resolve, reject) => {
      raccoon.bestRatedWithScores(30, function (results) {  //TODO: put num. of ratings in a config
        resolve(results)
      })
    })
  }
}

module.exports = Recommendation;
