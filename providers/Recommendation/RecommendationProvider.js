'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class RecommendationProvider extends ServiceProvider {
  *register () {
    this.app.singleton('App/Recommendation', function (app) {
      const Recommendation = require('./Recommendation')
      const Config = app.use('Config')
      return new Recommendation(Config)
    })
  }
}

module.exports = RecommendationProvider
