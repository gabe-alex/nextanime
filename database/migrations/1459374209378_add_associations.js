'use strict'

const Schema = use('Schema')

class NewSchema extends Schema {

  up () {
    this.table('anime', function (table) {
      table.integer('type_id').unsigned().references('id').inTable('anime_types').onUpdate('CASCADE').onDelete('SET NULL')
      table.integer('studio_id').unsigned().references('id').inTable('studios').onUpdate('CASCADE').onDelete('SET NULL')
    })
    
    this.table('anime_aliases', function (table) {
      table.integer('anime_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('anime_genres', function (table) {
      table.integer('anime_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('genre_id').unsigned().notNullable().references('id').inTable('genres').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('anime_relations', function (table) {
      table.integer('anime_from_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('anime_to_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('relation_id').unsigned().notNullable().references('id').inTable('anime_relation_types').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('cast', function (table) {
      table.integer('anime_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('person_id').unsigned().notNullable().references('id').inTable('people').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('character_id').unsigned().notNullable().references('id').inTable('characters').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('character_aliases', function (table) {
      table.integer('character_id').unsigned().notNullable().references('id').inTable('characters').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('staff', function (table) {
      table.integer('anime_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('person_id').unsigned().notNullable().references('id').inTable('people').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('role_id').unsigned().notNullable().references('id').inTable('staff_roles').onUpdate('CASCADE').onDelete('CASCADE')
    })
    
    this.table('users_anime', function (table) {
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('anime_id').unsigned().notNullable().references('id').inTable('anime').onUpdate('CASCADE').onDelete('CASCADE')
    })
  }
  
  
  down () {
    this.table('anime', function (table) {
      table.dropColumn('type')
      table.dropColumn('studio_id')
    })
    
    this.table('anime_aliases', function (table) {
      table.dropColumn('anime_id')
    })
    
    this.table('anime_genres', function (table) {
      table.dropColumn('anime_id')
      table.dropColumn('genre_id')
    })
    
    this.table('anime_relations', function (table) {
      table.dropColumn('anime_from')
      table.dropColumn('anime_to')
      table.dropColumn('relation_id')
    })
    
    this.table('cast', function (table) {
      table.dropColumn('anime_id')
      table.dropColumn('person_id')
      table.dropColumn('character_id')
    })
    
    this.table('character_aliases', function (table) {
      table.dropColumn('character_id')
    })
    
    this.table('staff', function (table) {
      table.dropColumn('anime_id')
      table.dropColumn('person_id')
      table.dropColumn('role_id')
    })
    
    this.table('users_anime', function (table) {
      table.dropColumn('user_id')
      table.dropColumn('anime_id')
    })
  }
}

module.exports = NewSchema
