'use strict'

const _ = require('lodash')

class AnimeService {
  static getDisplayTitle(anime) {
    return anime.romaji_title || anime.title
  }

  static insertDisplayTitle(anime) {
    anime.display_title = AnimeService.getDisplayTitle(anime)
    return anime
  }

  static insertDisplayTitles(animeList) {
    return _(animeList).map(function(item) {return AnimeService.insertDisplayTitle(item)}).value()
  }
}

module.exports = AnimeService
