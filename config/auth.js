'use strict'

const Config = use('Config')

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Authenticator
  |--------------------------------------------------------------------------
  |
  | Authenticator is a combination of HTTP Authentication scheme and the
  | serializer to be used for retrieving users. Below is the default
  | authenticator to be used for every request.
  |
  | Available Schemes - basic, session, jwt, api
  | Available Serializers - Lucid, Database
  |
  */
  authenticator: 'session',

  /*
  |--------------------------------------------------------------------------
  | Session Authenticator
  |--------------------------------------------------------------------------
  |
  | Session authenticator will make use of sessions to maintain the login
  | state for a given user.
  |
  */
  session: {
    scheme: 'session',
    serializer: 'Lucid',
    model: 'App/Model/User',
    uid: 'email',
    password: 'password'
  },

  /*
  |--------------------------------------------------------------------------
  | Basic Auth Authenticator
  |--------------------------------------------------------------------------
  |
  | Basic Authentication works on Http Basic auth header.
  |
  */
  basicAuth: {
    scheme: 'basic',
    serializer: 'Lucid',
    model: 'App/Model/User',
    uid: 'email',
    password: 'password'
  },

  /*
  |--------------------------------------------------------------------------
  | JWT Authenticator
  |--------------------------------------------------------------------------
  |
  | Jwt authentication works with a payload sent with every request under
  | Http Authorization header.
  |
  */
  jwt: {
    scheme: 'jwt',
    serializer: 'Lucid',
    model: 'App/Model/User',
    secret: Config.get('app.appKey')
  },

  /*
  |--------------------------------------------------------------------------
  | API Authenticator
  |--------------------------------------------------------------------------
  |
  | Api authenticator authenticates are requests based on Authorization
  | header.
  |
  | Make sure to define relationships on User and Token model as defined
  | in documentation
  |
  */
  api: {
    scheme: 'api',
    serializer: 'Lucid',
    model: 'App/Model/Token'
  }

}
