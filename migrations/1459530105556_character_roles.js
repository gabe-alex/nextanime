'use strict'

const Schema = use('Schema')

class Cast extends Schema {

  up () {
    this.table('cast', function (table) {
      table.enum('character_role',['main','supporting'])
    })
  }

  down () {
    this.table('cast', function (table) {
      table.dropColumn('character_role')
    })
  }

}

module.exports = Cast
