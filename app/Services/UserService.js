'use strict'

const Recommendation = use("Recommendation"),
  Anime = use('App/Model/Anime'),
  async = require('generator-async'),
  _ = require('lodash'),
  co = require('co')

class UserService {
  static updateRedisRating(userId, itemId, status, rating, userMean) {
    return co(function* () {
      switch (status) {
        case 'watching':
        case 'completed':
          if (!rating || rating >= userMean) {
            yield Recommendation.addLike(userId, itemId, true)
          } else {
            yield Recommendation.addDislike(userId, itemId, true)
          }
          break;
        case 'ignored':
        case 'dropped':
          yield Recommendation.addDislike(userId, itemId, true)
          break;
        case 'planning':
        default:
          yield Recommendation.removeRating(userId, itemId, true)
      }
      yield Recommendation.updateItem(itemId)
    })
  }

  static calcUserMean(userAnime) {
    let num_rated = 0;
    let sum_ratings = 0;
    _(userAnime.value()).forEach(function(item) {
      if (item._pivot_rating) {
        sum_ratings += item._pivot_rating
        num_rated++
      }
    })
    return sum_ratings/num_rated;
  }

  static *rebuildRecommendations(user) {
    const userAnime = yield user.anime().fetch()
    const mean = this.calcUserMean(userAnime)

    yield Recommendation.clearUserRatings(user.id)

    yield async.forEach(userAnime.value(), function*(item) {
      yield UserService.updateRedisRating(user.id, item.id, item._pivot_status, item._pivot_rating, mean)
    })
  }

  static *getRecommendations(user) {
    yield Recommendation.updateUser(user.id)
    const recIds = yield Recommendation.getRecommandations(user.id)
    return Anime.whereIn('id',recIds).fetch()
  }
}

module.exports = UserService
