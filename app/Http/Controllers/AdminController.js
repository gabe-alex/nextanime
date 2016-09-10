'use strict';

const Anime = use('App/Model/Anime');
const Recommendation = use("Recommendation");
const _ = require('lodash');
const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use('Config');
const co = require('co');
//const addrs = require("email-addresses");
const passport = require('passport');
const Helpers = use('Helpers');

const fs = require('fs');
const parseString = require('xml2js').parseString;

const gutil = require( 'gulp-util' );

class AdminController {

  *admin_edit(request, response) {
    yield response.sendView('administration');
  }

  *admin_edit_save(request, response) {
    //const db = request.file('db');
    const db = request.file('database_file', {
      maxSize: '2mb', // prevents uploads of big files, which are not necessary, also good against DoS's
      allowedExtensions: ['xml', 'txt', 'json'],
      hash: true //for checking data integrity for db uploads
      //multiple : false , was set globally to not allow uploading of multiple files, preventing DoS's
    });

    if(!db.exists()){
      response.send("Unable to upload file");
    }
    db.clientSize(); // for testing
    db.extension();
    db.tmpPath();

    //console.log(db.clientSize());
    //console.log(db.extension());
    //console.log(db.tmpPath());

    fs.readFile(db.tmpPath(), 'utf8', function(err, contents) {
      //console.log(contents);
      parseString(contents, function (err, result) {
        return co(function*(){
          gutil.log('Database import init');

          fs.unlink(db.tmpPath()); //delete file after extracting contents

          //result.report.item si apoi for id in item

          let items = result.report.item; //all xml anime

          const ann_ids = _(items).map(function(item) {
            return parseInt(item.id[0]);
          }).value();//xml anime id list


          gutil.log('initial xml ids count ', items.length);
          const animeList = yield Anime.query().whereIn('ann_id', ann_ids).fetch(); //searches all common anime between the db and xml , by ann_id
          const animeIds = animeList.map('ann_id').value(); //or _map(animeList,'ann_id') //identified all common or existing anime
          gutil.log('num matched anime ids', animeIds.length);
          const removed = _.remove(items, function(item) { //filter and remove from xml all existing anime
            return _(animeIds).includes(parseInt(item.id[0]));
          });
          gutil.log('new xml ids count ', items.length);

          for(let i=items.length-1; i>=0; i--) {
            const item = items[i];
            //console.log(item.id[0]);
            //console.log(item.name[0]);
            //console.log(item.type[0]);

            const anime = new Anime();
            anime.ann_id = item.id[0];
            anime.english_title = item.name[0];
            anime.type = item.type[0].toLowerCase();
            yield anime.save();  //anime has been saved!
          }

          gutil.log('Finished import');
        });
      });
    });

    yield response.sendView('administration');
  }

}

module.exports = AdminController;
