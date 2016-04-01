'use strict'

const Schema = use('Schema')

class AnimeGenres extends Schema {

  up () {
    this.table('anime_genres', function (table) {
      table.dropColumn('name')
    })
  }

  down () {
    this.table('anime_genres', function (table) {
      table.string('name').notNullable().unique()
    })
  }

}

module.exports = AnimeGenres
