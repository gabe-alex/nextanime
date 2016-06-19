'use strict';

const Env = use('Env');

// facebook app settings
module.exports = {
  appID: Env.get('FB_APPID'),
  appSecret: Env.get('FB_APPSECRET'),
  callbackUrl : 'http://localhost:'+Env.get('APP_PORT')+'/login_fb'
};
