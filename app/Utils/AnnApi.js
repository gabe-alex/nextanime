'use strict';

const request = require('request');
const parseString = require('xml2js').parseString;

const queue = [];
let lastRan = 0;

class AnnApi {
  static get API_DELAY() {
    return 1000;
  }

  static get BASE_REPORTS_URL() {
    return 'https://www.animenewsnetwork.com/encyclopedia/reports.xml';
  }

  static get BASE_DETAILS_URL() {
    return 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml';
  }

  static processRequest(url, callback) {
    request(url, (error, response, body) => {
      if(error) {
        console.error("ANN API Request Error:", error);
      } else if (!error && response.statusCode == 200) {
        parseString(body, (err, decoded) => {
          if(error) {
            console.error("ANN API Decode Error:", error);
          } else {
            callback(decoded);
          }
        });
      }
    });
  }

  static processQueue() {
    if(queue.length == 0) {
      return;
    }

    if(lastRan + this.API_DELAY <= Date.now()) {
      const requestData = queue.shift();
      lastRan = Date.now();
      this.processRequest(requestData.url,requestData.callback);
    }

    setTimeout(() => {
      this.processQueue();
    }, this.API_DELAY);
  }

  static request(url, callback) {
    queue.push({
      url: url,
      callback: callback
    });
    this.processQueue();
  }

  static getAllAnime(callback) {
    return this.request(this.BASE_REPORTS_URL+'?id=155&type=anime&nlist=all', callback);
  }

  static getTitleDetails(title_id, callback) {
    return this.request(this.BASE_DETAILS_URL+'?title='+title_id , callback);
  }
}

module.exports = AnnApi;
