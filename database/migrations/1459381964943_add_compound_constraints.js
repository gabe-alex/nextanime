'use strict'

const Schema = use('Schema')

class NewSchema extends Schema {

  up () {
    this.table('anime_aliases', function (table) {
      table.unique(['title', 'anime_id'])
    })
    
    this.table('anime_genres', function (table) {
      table.unique(['anime_id', 'genre_id'])
    })
    
    this.table('anime_relations', function (table) {
      table.unique(['anime_from_id', 'anime_to_id'])
    })
    
    this.table('cast', function (table) {
      table.unique(['anime_id', 'person_id', 'character_id'])
    })
    
    this.table('character_aliases', function (table) {
      table.unique(['name', 'character_id'])
    })
    
    this.table('staff', function (table) {
      table.unique(['anime_id', 'person_id', 'role_id'])
    })
    
    this.table('users_anime', function (table) {
      table.unique(['user_id', 'anime_id'])
    })
  }

  down () {
  }

}

module.exports = NewSchema
