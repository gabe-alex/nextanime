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

  //TODO : get rid of useless getters
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
    characters.display_characters = AnimeService.getDisplayCharacters(characters)
    return characters
  }

  static getDisplayActors(cast) {
    return cast.romaji_name
  }

  static insertDisplayActors(cast) {
    cast.display_actors = AnimeService.getDisplayActors(cast)
    return cast
  }

  static getDisplayNrEps(anime) {
    return anime.nr_episodes
  }

  static insertDisplayNrEps(anime) {
    anime.display_nr_eps = AnimeService.getDisplayNrEps(anime)
    return anime
  }


  static insertDisplayTitles(animeList) {
    return _(animeList).map(function(item) {return AnimeService.insertDisplayTitle(item)}).value()
  }
}

module.exports = AnimeService
