'use strict'

const Schema = use('Schema')

class People extends Schema {

  up () {
    //using raw because renameColumn() drops the NOT NULL attribute
    this.raw("ALTER TABLE `people`" +
             "CHANGE COLUMN `name` `last_name` VARCHAR(255) NOT NULL," +
             "CHANGE COLUMN `romaji_name` `romaji_last_name` VARCHAR(255) NULL,"+
             "ADD COLUMN `first_name` VARCHAR(255) NOT NULL AFTER `last_name`,"+
             "ADD COLUMN `romaji_first_name` VARCHAR(255) NULL AFTER `romaji_last_name`;")
  }

  down () {
     this.raw("ALTER TABLE `people`" +
              "CHANGE COLUMN `last_name` `name` VARCHAR(255) NOT NULL," +
              "CHANGE COLUMN `romaji_last_name` `romaji_name` VARCHAR(255) NULL,"+
              "DROP COLUMN `first_name`,"+
              "DROP COLUMN `romaji_first_name`;")
  }
  
}

module.exports = People
