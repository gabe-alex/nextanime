'use strict';

const Ouch = use('youch');
const Env = use('Env');
const Http = exports = module.exports = {};
const View = use('View');

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {

  //handle access attempts without auth
  if(error.name == 'InvalidLoginException') {
    yield request.session.put('redirect_url', request.originalUrl());
    response.redirect('/login')
    return;
  }


  /**
   * DEVELOPMENT REPORTER
   */

  if (Env.get('NODE_ENV') === 'development') {
    const ouch = new Ouch().pushHandler(
      new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
    );
    ouch.handleException(error, request.request, response.response, (output) => {
      console.log('Handled error gracefully');
    });
    return;
  }

  /**
   * PRODUCTION REPORTER
   */
  const status = error.status || 500;
  console.error(error);
  yield response.status(status).sendView('errors/index', {error});
};

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  View.filter('date', function (date_str) {
    var d = new Date(date_str);
    return d.toLocaleDateString('en-US');
  });

  View.filter('display_title', function (anime) {
    return anime.romaji_title || anime.english_title || anime.title;
  });

  View.filter('cover', function (anime, callback) {
    return '<img src="//nextanime.net/media/anime_covers/'+anime.id+'.jpg" class="img-responsive" onerror="this.src =\'/images/cover_placeholder.png\';">';
  });
};
