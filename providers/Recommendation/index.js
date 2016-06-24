'use strict';

const QueueHandler = require('./QueueHandler')
const raccoon = require('raccoon');
const co = require('co');
const async = require('generator-async');

class Recommendation {
  constructor (Config, Anime) {
    this.animeModel = Anime;

    this.queueHandler = new QueueHandler(this);

    raccoon.config.className = 'nextanime';
    raccoon.config.numOfRecsStore = 30;

    const host = Config.get('database.redis.host');
    const port = Config.get('database.redis.port');
    const auth = Config.get('database.redis.auth');
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

  getRecommandations (userId, count) {
    return new Promise((resolve, reject) => {
      raccoon.recommendFor(userId, count-1, function (results) {  //count-1 because redis has bounds inclusive
        resolve(results)
      })
    })
  }

  bestRated(count) {
    return new Promise((resolve, reject) => {
      raccoon.bestRatedWithScores(count-1, function (results) {
        resolve(results)
      })
    })
  }

  calcUserMean(userAnime) {
    let num_rated = 0;
    let sum_ratings = 0;
    userAnime.forEach(function(item) {
      if (item._pivot_rating) {
        sum_ratings += item._pivot_rating;
        num_rated++;
      }
    });
    return sum_ratings/num_rated;
  }

  updateRedisRating(userId, itemId, status, rating, userMean) {
    const context = this;
    return co(function*() {  //need this because async expects it in a specific format(?)
      switch (status) {
        case 'watching':
        case 'completed':
          if (!rating || rating >= userMean) {
            yield context.addLike(userId, itemId, true);
          } else {
            yield context.addDislike(userId, itemId, true);
          }
          break;
        case 'ignored':
        case 'dropped':
          yield context.addDislike(userId, itemId, true);
          break;
        case 'planning':
        default:
          yield context.removeRating(userId, itemId, true);
      }
      yield context.updateItem(itemId);
    });
  }

  *rebuildRecommendations(user) {
    const userAnime = yield user.anime().fetch();
    const mean = this.calcUserMean(userAnime);

    const context = this;
    yield async.forEach(userAnime.value(), function*(item) {
      yield context.updateRedisRating(user.id, item.id, item._pivot_status, item._pivot_rating, mean);
    });
  }

  *getRecommendations(user, count) {
    this.queueHandler.scheduleUpdate(user.id);  //note: this is executed aync
    const recIds = yield this.getRecommandations(user.id, count);
    return yield this.animeModel.query().whereIn('id', recIds).fetch();
  }

  *getTopAnime(count) {
    const recIds = yield this.bestRated(count);
    return yield this.animeModel.query().whereIn('id', recIds).fetch();
  }
}

module.exports = Recommendation;