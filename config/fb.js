'use strict';

const Env = use('Env');

// facebook app settings
module.exports = {
  appID: Env.get('FB_APPID'),
  appSecret: Env.get('FB_APPSECRET'),
  callbackUrl : 'http://'+Env.get('PUBLIC_HOST')+':'+Env.get('PUBLIC_PORT', 80)+'/login_fb_callback'
};
