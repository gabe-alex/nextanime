'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class RecommendationProvider extends ServiceProvider {
  *register () {
    this.app.singleton('App/Recommendation', function (app) {
      const Recommendation = require('./Recommendation/index')
      const Config = app.use('Config');
      const Anime = use('App/Model/Anime');
      return new Recommendation(Config, Anime);
    })
  }
}

module.exports = RecommendationProvider;
