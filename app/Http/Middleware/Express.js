'use strict';

//This module contains various translations, in order to support modules designed for Express.js

class Express {
  *handle (request, response, next) {
    request.query = request.get();

    request.body = request.post();


    response.setHeader = response.header;

    //in express, statusCode is a value, but in Adonis it's a function, so we call the function before response.end()
    response.oldEnd = response.end;
    response.end = function() {
      if (this.statusCode) {
        this.status(this.statusCode)
      }
      this.oldEnd();
    };

    yield next
  }
}

module.exports = Express;
