'use strict';

const Env = use('Env');

const public_host = Env.get('PUBLIC_HOST', 'localhost');
const public_port = Env.get('PUBLIC_PORT', '3333');

// facebook app settings
module.exports = {
  fb: {
    appID: Env.get('FB_APPID'),
    appSecret: Env.get('FB_APPSECRET'),
    callbackUrl : 'http://'+public_host+(public_port==='80' && '' || ':'+public_port)+'/login_fb'
  },
  tw: {
    appID: Env.get('TW_APPID'),
    appSecret: Env.get('TW_APPSECRET'),
    callbackUrl : 'http://'+public_host+(public_port==='80' && '' || ':'+public_port)+'/login_tw'
  },
  hb: {
    appID: Env.get('HB_APPID'),
    appSecret: Env.get('HB_APPSECRET'),
    callbackUrl : 'http://'+public_host+(public_port==='80' && '' || ':'+public_port)+'/login_hb'
  }

};
