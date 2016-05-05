'use strict'

const _ = require('lodash')

class ListService {
  static getDisplayTitle(anime) {
    return anime.romaji_title || anime.title
  }

  static getDisplayEnglishTitle(anime) {
    return anime.english_title
  }

  static getDisplayDescription(anime) {
    return anime.description
  }

  static insertDisplayTitle(anime) {
    anime.display_title = ListService.getDisplayTitle(anime)
    return anime
  }

  static insertDisplayTitles(animeList) {
    return _(animeList).map(function(item) {return ListService.insertDisplayTitle(item)}).value()
  }


  static insertDisplayEnglishTitle(anime) {
    anime.display_english_title = ListService.getDisplayEnglishTitle(anime)
    return anime
  }

  static insertDisplayEnglishTitles(animeList) {
    return _(animeList).map(function(item) {return ListService.insertDisplayEnglishTitle(item)}).value()
  }

  static insertDisplayDescription(anime) {
    anime.display_description = ListService.getDisplayDescription(anime)
    return anime
  }

  static insertDisplayDescriptions(animeList) {
    return _(animeList).map(function(item) {return ListService.insertDisplayDescription(item)}).value()
  }

}

module.exports = ListService
