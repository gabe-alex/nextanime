'use strict'

const Env = use('Env')
const Helpers = use('Helpers')

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'mysql'),


  /*
  |--------------------------------------------------------------------------
  | Mysql
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Mysql database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'nextanime')
    },
    debug: false
  },


  redis: {
    host: Env.get('REDIS_HOST', 'localhost'),
    port: Env.get('REDIS_PORT', 6379),
    auth: Env.get('REDIS_AUTH')
  }

}
