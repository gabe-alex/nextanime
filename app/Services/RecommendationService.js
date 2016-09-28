'use strict';

const _ = require('lodash');
const pcorr = require( 'compute-pcorr' );

const Database = use('Database');
const Anime = use('App/Model/Anime');
const User = use('App/Model/User');

class RecommendationService {
  static get WATCHED_STATUS_LIST() {
    return ['watching', 'completed', 'on_hold'];
  }
  static get MIN_COMMON_SERIES() {
    return 3;
  }
  static get MIN_PEARSON_SIMILARITY() {
    return 0.5;
  }
  static get MAX_NUM_SIMILAR_USERS() {
    return 10;
  }

  getUsersCommonAnimeCount(userId) {
    return Database.select('ua2.user_id as other_user_id').count('ua1.anime_id as common_anime_nr')
      .from('users_anime as ua1')
      .innerJoin('users_anime as ua2', function() {
        this.on('ua1.anime_id', '=', 'ua2.anime_id')
          .andOn(Database.raw('ua1.status in (?)', [RecommendationService.WATCHED_STATUS_LIST]))
          .andOn(Database.raw('ua2.status in (?)', [RecommendationService.WATCHED_STATUS_LIST]))
          .andOn('ua2.user_id', '!=', 'ua1.user_id')
          .andOn('ua1.user_id', '=', userId)
      })
      .groupBy('other_user_id')
      .having('common_anime_nr', '>=', RecommendationService.MIN_COMMON_SERIES);
  }

  getUserCommonAnime(userId, otherId) {
    return Database.select('ua1.anime_id as anime_id', 'ua1.rating as user_rating', 'ua2.rating as other_user_rating')
      .from('users_anime as ua1')
      .innerJoin('users_anime as ua2', function() {
        this.on('ua1.anime_id', '=', 'ua2.anime_id')
          .andOn(Database.raw('ua1.status in (?)', [RecommendationService.WATCHED_STATUS_LIST]))
          .andOn(Database.raw('ua2.status in (?)', [RecommendationService.WATCHED_STATUS_LIST]))
          .andOn('ua2.user_id', '=', otherId)
          .andOn('ua1.user_id', '=', userId)
      });
  }

  *updateAnime(anime) {
    anime.rating = (yield anime.users().fetch()).meanBy('_pivot_normalized_rating');
    console.log(anime.rating);
    yield anime.save();
  }

  *update(user, anime) {
    yield this.updateAnime(anime);

    const similarUserList = yield user.similar().fetch();
    for(const similarUser of similarUserList) {
      yield user.similar().detach([similarUser.id]);
      yield similarUser.similar().detach([user.id]);
      yield similarUser.save();
    }

    const userCommonAnimeList = yield this.getUsersCommonAnimeCount(user.id);

    console.log('common anime count list', userCommonAnimeList);

    for(const userCommonAnime of userCommonAnimeList) {
      const otherUserId = userCommonAnime.other_user_id;
      const commonAnimeNr = userCommonAnime.common_anime_nr;

      const commonAnimeList = yield this.getUserCommonAnime(user.id, otherUserId);
      const commonRatedAnimeList = _.filter(commonAnimeList, (commonAnime) => !_.isNil(commonAnime.user_rating) && !_.isNil(commonAnime.other_user_rating));
      const userRatingList = _.map(commonRatedAnimeList, 'user_rating');
      const otherUserRatingList = _.map(commonRatedAnimeList, 'other_user_rating');

      console.log('user common', otherUserId, commonAnimeList);
      console.log('user rating', userRatingList);
      console.log('other rating', otherUserRatingList);

      console.log('pearson', pcorr(userRatingList, otherUserRatingList));

      //the pearson module returns a matrix with the result for each combination. we only care about first x second, so we can use [0][1] or [1][0]
      const pearsonSimilarity = pcorr(userRatingList, otherUserRatingList)[0][1];

      console.log('user similarity', otherUserId, {common_series_nr: commonAnimeNr, rating_similarity: pearsonSimilarity});

      if(pearsonSimilarity >= RecommendationService.MIN_PEARSON_SIMILARITY) {
        const otherUser = yield User.findOrFail(otherUserId);
        yield user.similar().attach({[otherUser.id]: {common_series_nr: commonAnimeNr, rating_similarity: pearsonSimilarity}});
        yield otherUser.similar().attach({[user.id]: {common_series_nr: commonAnimeNr, rating_similarity: pearsonSimilarity}});
        yield otherUser.save();
      }
    }

    const userAnimeList = yield user.anime().fetch();
    user.min_rating = userAnimeList.minBy('_pivot_rating')._pivot_rating;
    user.max_rating = userAnimeList.maxBy('_pivot_rating')._pivot_rating;

    for(const userAnime of userAnimeList) {
      if(userAnime._pivot_rating && user.min_rating && user.max_rating && user.max_rating - user.min_rating) {
        const normalized_rating = 1 + 9 * (userAnime._pivot_rating - user.min_rating) / (user.max_rating - user.min_rating);
        console.log(userAnime._pivot_rating, user.max_rating, user.min_rating, normalized_rating);

        yield user.anime().detach([userAnime.id]);
        yield user.anime().attach({
          [userAnime.id]: {status: userAnime._pivot_status, rating: userAnime._pivot_rating, normalized_rating: normalized_rating}
        });
        yield this.updateAnime(userAnime);
      }
    }

    yield user.save();
  }

  getReccomendedAnime(userId, numReccomendations) {
    numReccomendations = numReccomendations || 10;

    const userAnimeQuery = Database.select('anime_id')
      .from('users_anime')
      .where('user_id', userId);

    const similarUsersQuery = Database.select('other_user_id')
      .from('users_similar')
      .where('this_user_id', userId)
      .orderBy('common_series_nr', 'desc')
      .orderBy('rating_similarity', 'desc')
      .limit(RecommendationService.MAX_NUM_SIMILAR_USERS)
      .as('similar_users');

    return Database.select('users_anime.anime_id', 'anime.rating as avg_rating').count('users_anime.anime_id as nr_appearances')
      .from('users_anime')
      .innerJoin(similarUsersQuery, 'users_anime.user_id', 'similar_users.other_user_id')
      .innerJoin('anime', 'users_anime.anime_id', 'anime.id')
      .whereNotIn('users_anime.anime_id', userAnimeQuery)
      .andWhere('users_anime.status', 'in', RecommendationService.WATCHED_STATUS_LIST)
      .groupBy('users_anime.anime_id')
      .orderBy('nr_appearances', 'desc')
      .orderBy('avg_rating', 'desc')
      .limit(numReccomendations);
  }

  *getRecommendations(user, numReccomendations) {
    const reccomendedAnimeList = yield this.getReccomendedAnime(user.id, numReccomendations);
    console.log(reccomendedAnimeList);
    const reccomendedAnimeIdList = _.map(reccomendedAnimeList, 'anime_id');
    const reccomendedAnime = yield Anime.query().whereIn('id', reccomendedAnimeIdList).fetch();

    //database doesn't care about given id order, so we need to re-order them
    const reccomendedAnimeListKeyed = _.keyBy(reccomendedAnimeList, 'anime_id');
    return reccomendedAnime
      .orderBy((anime) => reccomendedAnimeListKeyed[anime.id].nr_appearances, 'desc')
      .orderBy((anime) => reccomendedAnimeListKeyed[anime.id].avg_rating, 'desc');
  }

  *getTopAnime(numTop) {
    numTop = numTop || 10;

    return yield Anime.query().where('rating', '>=', 5).orderBy('rating', 'desc').limit(numTop).fetch();
  }
}

module.exports = RecommendationService;
