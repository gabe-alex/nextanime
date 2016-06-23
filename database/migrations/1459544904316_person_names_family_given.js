'use strict'

const Schema = use('Schema')

class People extends Schema {

  up () {
    //using raw because renameColumn() drops the NOT NULL attribute
    this.raw("ALTER TABLE `people`" +
             "CHANGE COLUMN `last_name` `family_name` VARCHAR(255) NOT NULL," +
             "CHANGE COLUMN `first_name` `given_name` VARCHAR(255) NOT NULL," +
             "CHANGE COLUMN `romaji_last_name` `romaji_family_name` VARCHAR(255) NULL,"+
             "CHANGE COLUMN `romaji_first_name` `romaji_given_name`  VARCHAR(255) NULL;")
  }

  down () {
    this.raw("ALTER TABLE `people`" +
             "CHANGE COLUMN `family_name` `last_name` VARCHAR(255) NOT NULL," +
             "CHANGE COLUMN `given_name` `first_name` VARCHAR(255) NOT NULL,"+
             "CHANGE COLUMN `romaji_family_name` `romaji_last_name` VARCHAR(255) NULL,"+
             "CHANGE COLUMN `romaji_given_name` `romaji_first_name`  VARCHAR(255) NULL;")
  }
  
}

module.exports = People
