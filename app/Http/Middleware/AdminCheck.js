'use strict';

//This module contains various translations, in order to support modules designed for Express.js

class AdminCheck {
  *handle (request, response, next) {
    if(request.currentUser.role != 'admin') {
      return response.redirect('/')
    }

    yield next; // tells the middleware to move to the next layer, whenever we pass the request to the next handler
  }
}

module.exports = AdminCheck;
