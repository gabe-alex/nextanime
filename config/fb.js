'use strict';

const Env = use('Env');

const port = Env.get('PUBLIC_PORT', '80');

// facebook app settings
module.exports = {
  appID: Env.get('FB_APPID'),
  appSecret: Env.get('FB_APPSECRET'),
  callbackUrl : 'http://'+Env.get('PUBLIC_HOST', 'localhost')+(port=='80' && '' || ':'+port)+'/login_fb_callback'
};
