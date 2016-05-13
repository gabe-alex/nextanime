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

  static getDisplayEnglishTitle(anime) {
    return anime.english_title
  }

  static insertDisplayEnglishTitle(anime) {
    anime.display_english_title = AnimeService.getDisplayEnglishTitle(anime)
    return anime
  }

  static getDisplayAuthor(anime) {
    return anime.author
  }

  static insertDisplayAuthor(anime) {
    anime.display_author = AnimeService.getDisplayAuthor(anime)
    return anime
  }

  static getDisplayStudio(studios) {
    return studios.name
  }

  static insertDisplayStudio(studios) {
    studios.display_studio = AnimeService.getDisplayStudio(studios)
    return studios
  }

  static getDisplayAnimeDescription(anime) {
    return anime.description
  }

  static insertDisplayAnimeDescription(anime) {
    anime.display_description = AnimeService.getDisplayAnimeDescription(anime)
    return anime
  }

  static getDisplayCharacters(characters) {
    return characters.romaji_name
  }

  static insertDisplayCharacters(characters) {
    characters.display_title = AnimeService.getDisplayCharacters(characters)
    return characters
  }

  static getDisplayCharacters(characters) {
    return characters.romaji_name
  }

  static insertDisplayCharacters(characters) {
    characters.display_title = AnimeService.getDisplayCharacters(characters)
    return characters
  }



  static insertDisplayTitles(animeList) {
    return _(animeList).map(function(item) {return AnimeService.insertDisplayTitle(item)}).value()
  }
}

module.exports = AnimeService
