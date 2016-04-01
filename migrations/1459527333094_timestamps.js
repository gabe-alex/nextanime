'use strict'

const Schema = use('Schema')

class NewSchema extends Schema {

  up () {   
    this.table('anime_aliases', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    this.table('anime_genres', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    this.table('anime_relations', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    this.table('cast', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })    
    this.table('character_aliases', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    this.table('staff', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    this.table('users_anime', function (table) {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('deleted_at')
    })
    
    //Using raw queries because knex doesn't currently support changing column type...
    this.raw("ALTER TABLE `anime`" +
             "CHANGE COLUMN `created_at` `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
             "CHANGE COLUMN `updated_at` `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
             "DROP COLUMN `deleted_at`;")
    this.raw("ALTER TABLE `characters`" +
             "CHANGE COLUMN `created_at` `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
             "CHANGE COLUMN `updated_at` `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
             "DROP COLUMN `deleted_at`;")
    this.raw("ALTER TABLE `people`" +
             "CHANGE COLUMN `created_at` `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
             "CHANGE COLUMN `updated_at` `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
             "DROP COLUMN `deleted_at`;")
    this.raw("ALTER TABLE `studios`" +
             "CHANGE COLUMN `created_at` `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
             "CHANGE COLUMN `updated_at` `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
             "DROP COLUMN `deleted_at`;")
    this.raw("ALTER TABLE `users`" +
             "CHANGE COLUMN `created_at` `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
             "CHANGE COLUMN `updated_at` `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
             "DROP COLUMN `deleted_at`;")
  }

  down () {
    this.table('anime_aliases', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('anime_genres', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('anime_relations', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('cast', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('character_aliases', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('staff', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    this.table('users_anime', function (table) {
      table.dateTime('created_at').after('id')
      table.dateTime('updated_at').after('created_at')
      table.dateTime('deleted_at').after('updated_at')
    })
    
    this.raw("ALTER TABLE `anime`" +
             "CHANGE COLUMN `created_at` `created_at` DATETIME NULL," +
             "CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL," +
             "ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;")
    this.raw("ALTER TABLE `characters`" +
             "CHANGE COLUMN `created_at` `created_at` DATETIME NULL," +
             "CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL," +
             "ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;")
    this.raw("ALTER TABLE `people`" +
             "CHANGE COLUMN `created_at` `created_at` DATETIME NULL," +
             "CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL," +
             "ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;")
    this.raw("ALTER TABLE `studios`" +
             "CHANGE COLUMN `created_at` `created_at` DATETIME NULL," +
             "CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL," +
             "ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;")
    this.raw("ALTER TABLE `users`" +
             "CHANGE COLUMN `created_at` `created_at` DATETIME NULL," +
             "CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL," +
             "ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`;")
  }

}

module.exports = NewSchema
