'use strict'

class HomeController {

  * index (request, response) {
    const view = yield response.view('PageTemplateLicenta')
    response.send(view)
	/*
	let testvar = 24
    response.send(view, {test: testvar, test2: 'lol'})*/
  }

  * mainpage (request, response) {
    const view = yield response.view('MainPageLicenta')
    response.send(view)
  }

  * animepage (request, response) {
    const view = yield response.view('AnimePageLicenta')
    response.send(view)
  }

  * userprofile (request, response) {
    const view = yield response.view('user_profile')
    response.send(view)
  }
  * animedatabase (request, response) {
    const view = yield response.view('animedatabase')
    response.send(view)
  }
}

module.exports = HomeController
