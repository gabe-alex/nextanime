'use strict'

const Schema = use('Schema')

class NewSchema extends Schema {

  up () {
    
    this.create('anime', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('title').notNullable()
      table.string('romaji_title')
      table.string('english_title')
      table.text('description')
      table.integer('nr_episodes')
      table.integer('episode_length')
      table.date('air_start')
      table.date('air_end')
    })
    
    this.create('anime_aliases', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('title').notNullable()
    })
    
    this.create('anime_genres', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('name').notNullable().unique()
    })
    
    this.create('anime_relations', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.boolean('required')
    })
    
    this.create('anime_relation_types', function (table) {
      table.increments('id')
      
      table.string('name').notNullable().unique()
    })
    
    this.create('anime_types', function (table) {
      table.increments('id')
      
      table.string('name').notNullable()
    })
    
    this.create('cast', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
    })
    
    this.create('characters', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('name').notNullable()
      table.string('romaji_name')
    })
    
    this.create('character_aliases', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('name').notNullable()
    })
    
    this.create('genres', function (table) {
      table.increments('id')
      
      table.string('name').notNullable().unique()
    })
    
    this.create('people', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('name').notNullable()
      table.string('romaji_name')
    })
    
    this.create('staff', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
    })
    
    this.create('staff_roles', function (table) {
      table.increments('id')
      
      table.string('name').notNullable().unique()
    })
    
    this.create('studios', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('name').notNullable()
    })
    
    this.create('users', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.string('username').notNullable().unique()
      table.string('password').notNullable()
    })
    
    this.create('users_anime', function (table) {
      table.increments('id')
      table.timestamps()
      table.dateTime('deleted_at')
      
      table.enum('status',['planning','watching','on_hold','completed','dropped','ignored']).notNullable()
      table.text('notes')
      table.integer('rating')
    })
    
  }

  down () {
    this.drop('anime')
    this.drop('anime_aliases')
    this.drop('anime_genres')
    this.drop('anime_types')
    this.drop('anime_relations')
    this.drop('anime_relation_types')
    this.drop('cast')
    this.drop('characters')
    this.drop('character_aliases')
    this.drop('genres')
    this.drop('people')
    this.drop('staff')
    this.drop('staff_roles')
    this.drop('studios')
    this.drop('users')
    this.drop('users_anime')
  }
  
}

module.exports = NewSchema
