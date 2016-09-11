'use strict';

const co = require('co');
const _ = require('lodash');
const parseString = require('xml2js').parseString;
const gutil = require('gulp-util');
const Anime = use('App/Model/Anime');
const AnnApi = use('App/Utils/AnnApi');

class AdminController {

  *admin_edit(request, response) {
    yield response.sendView('administration');
  }

  *import_list(request, response) {
    gutil.log('Database import start');
    gutil.log('Downloading anime list...');
    AnnApi.getAllAnime((downloaded) => {
      gutil.log('List obtained.');
      parseString(downloaded, (err, decoded) => {
        return co(function*(){
          //result.report.item si apoi for id in item

          let items = decoded.report.item; //all xml anime
          gutil.log('initial xml ids count ', items.length);

          const ann_ids = _(items).map(function(item) {
            return parseInt(item.id[0]);
          }).value();//xml anime id list

          const existingAnnIds = yield Anime.query().whereIn('ann_id', ann_ids).pluck('ann_id');
          gutil.log('num matched anime ids', existingAnnIds.length);
          const removed = _.remove(items, function(item) { //filter and remove from xml all existing anime
            return _(existingAnnIds).includes(parseInt(item.id[0]));
          });
          gutil.log('new xml ids count ', items.length);

          for(let i=items.length-1; i>=0; i--) {
            const item = items[i];

            const anime = new Anime();

            anime.ann_id = item.id[0];
            anime.english_title = item.name[0];
            anime.type = item.type[0].toLowerCase();

            if(item.vintage) {
              const dates_matched = item.vintage[0].match(/\d{4}-\d{2}-\d{2}/g);
              if (dates_matched) {
                anime.air_start = dates_matched[0];
                if (dates_matched.length > 1) {
                  anime.air_end = dates_matched[1];
                }
              } else {
                const dates_matched = item.vintage[0].match(/^\d{4}/);
                if (dates_matched) {
                  anime.air_start = dates_matched[0]+'-01-01';
                }
              }
            }

            yield anime.save();  //anime has been saved!
          }

          gutil.log('Finished import');
        });
      });
    });

    response.redirect('back');
  }

  *import_details(request, response) {
    const annIdList = yield Anime.query().whereNotNull('ann_id').pluck('ann_id');
    console.log('Adding descriptions...');
    for(const annId of annIdList) {
      AnnApi.getTitleDetails(annId, (res) => {
        console.log('current ann_id: ' + annId);

        parseString(res, (err, result) => {
          co(function*() {
            const db_anime = yield Anime.query().where('ann_id', annId).first();

            const xml_amine = result.ann.anime[0];
            const infoList = xml_amine.info;
            for (const info of infoList) {
              //console.log(info.$.type, info._);
              switch (info.$.type) {
                case "Plot Summary":
                  //console.log(info._);
                  db_anime.description = info._;
                  break;
              }
            }

            yield db_anime.save();
          });
        });
      });
    }

    response.redirect('back');
  }

}

module.exports = AdminController;
