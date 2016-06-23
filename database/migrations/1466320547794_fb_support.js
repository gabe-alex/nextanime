'use strict'

const Schema = use('Schema')

class Users extends Schema {

  up () {
    this.raw("ALTER TABLE `users`" +
      "CHANGE COLUMN `username` `username` VARCHAR(255) NULL," +
      "CHANGE COLUMN `password` `password` VARCHAR(255) NULL," +
      "ADD COLUMN `fb_id` VARCHAR(255) NULL UNIQUE AFTER `password`," +
      "ADD COLUMN `fb_access_token` VARCHAR(255) NULL AFTER `fb_id`;")
  }

  down () {
    this.raw("ALTER TABLE `users`" +
      "CHANGE COLUMN `username` `username` VARCHAR(255) NOT NULL," +
      "CHANGE COLUMN `password` `password` VARCHAR(255) NOT NULL," +
      "DROP COLUMN `fb_id`," +
      "DROP COLUMN `fb_access_token`;")
  }

}

module.exports = Users
