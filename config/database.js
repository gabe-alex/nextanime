'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the settings to be used while setting up a database
  | it is a reference of defined connections below in this file.
  |
  */
  connection: 'mysql',

  /*
  |--------------------------------------------------------------------------
  | Migrations Table
  |--------------------------------------------------------------------------
  |
  | By default adonis database migrations table is set to adonis_schema.
  | Here is your chance to override it.
  |
  */
   migrationsTable: 'adonis_schema',

  /*
  |--------------------------------------------------------------------------
  |   Mysql Connection
  |--------------------------------------------------------------------------
  |
  |   Below is configuration for mysql database, if your application is
  |   dependent upon mysql , define your credentials inside .env file,
  |   as it is a good practice to keep environment configuration
  |   isolated for each environment.
  |
  |--------------------------------------------------------------------------
  |   npm install --save mysql
  |--------------------------------------------------------------------------
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('MYSQL_HOST', 'localhost'),
      user: Env.get('MYSQL_USER', 'root'),
      password: Env.get('MYSQL_PASSWORD', ''),
      database: Env.get('MYSQL_DATABASE', 'nextanime')
    }
  },

/*
|--------------------------------------------------------------------------
|   Feel Free
|--------------------------------------------------------------------------
|
|  Feel free to define as many connections you like to define.
|
*/

  redis: {
    connection: {
      host: Env.get('REDIS_HOST', 'localhost'),
      port: Env.get('REDIS_PORT', 6379)
    }
  }
}
