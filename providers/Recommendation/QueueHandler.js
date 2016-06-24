'use strict';

const async = require('generator-async');

class QueueHandler {
  constructor(recInstance) {
    this.recInstance = recInstance;

    this.NUM_CONCURRENT = 10;
    this.MIN_INTERVAL = 60;
    this.delayed = [];
    this.queue = [];
    this.running = 0;
    this.last_ran = {};
  }

  scheduleUpdate(user_id) {
    if (this.last_ran[user_id] && (Date.now() - this.last_ran[user_id] < this.MIN_INTERVAL * 1000)) {  //delay requests happening too often
      if (this.delayed.indexOf(user_id) === -1) { //if a request was already delayed, ignore further requests from that user
        this.delayed.push(user_id);

        const context = this;
        setTimeout(function () {
          var index = context.delayed.indexOf(user_id);
          if (index > -1) {
            context.delayed.splice(index, 1);
          }
          context.scheduleUpdate(user_id);
        }, this.MIN_INTERVAL * 1000 - (this.last_ran[user_id] && (Date.now() - this.last_ran[user_id])));
      }
    } else {
      this.queue.push(user_id);
      if (this.running < this.NUM_CONCURRENT) {
        this.execQueued();
      }
    }
  }

  execQueued() {
    const context = this;
    async.run(function*() {
      const user_id = context.queue.shift();
      context.last_ran[user_id] = Date.now();
      context.running++;
      yield context.recInstance.updateUser(user_id);
      context.running--;
      if(context.queue.length > 0) {
        context.execQueued();
      }
    })
  }
}

module.exports = QueueHandler;
