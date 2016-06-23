'use strict';

const Env = use('Env');

const port = Env.get('PORT', '80');

// facebook app settings
module.exports = {
  appID: Env.get('FB_APPID'),
  appSecret: Env.get('FB_APPSECRET'),
  callbackUrl : 'http://'+Env.get('HOST', 'localhost')+(port==='80' && '' || ':'+port)+'/login_fb_callback'
};
