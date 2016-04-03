'use strict'

class HomeController {

  * index (request, response) {
    const view = yield response.view('adonis')
    response.send(view)
	/*
	let testvar = 24
    response.send(view, {test: testvar, test2: 'lol'})*/
  }
  
  * mainpage (request, response) {
    const view = yield response.view('LicentaMainPage')
    response.send(view)
  }
  
  * animepage (request, response) {
    const view = yield response.view('LicentaAnimePage')
    response.send(view)
  }
  
  * userprofile (request, response) {
    const view = yield response.view('LicentaUserPage')
    response.send(view)
  }

}

module.exports = HomeController
