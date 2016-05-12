'use strict'

class HomeController {

  * index (request, response) {
    const view = yield response.view('index')
    response.send(view)
  }

  * animepage (request, response) {
    const view = yield response.view('anime')
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
