'use strict';

const _ = require('lodash');
const co = require('co');
const Anime = use('App/Model/Anime');
const AnnApi = use('App/Utils/AnnApi');
const Socket = use('App/Http/Socket');


class AdminController {
  *admin_edit(request, response) {
    yield response.sendView('administration');
  }

  *import_list(request, response) {
    Socket.messageUser(request.currentUser, 'Database import start');
    Socket.messageUser(request.currentUser, 'Downloading anime list...');
    const decoded = yield new Promise((resolve, reject) => {
      AnnApi.getAllAnime((res) => {
        resolve(res);
      });
    });

    Socket.messageUser(request.currentUser, 'List obtained.');

    //result.report.item si apoi for id in item

    let items = decoded.report.item; //all xml anime
    Socket.messageUser(request.currentUser, 'initial xml ids count: '+ items.length);

    const ann_ids = _(items).map(function(item) {
      return parseInt(item.id[0]);
    }).value();//xml anime id list

    const existingAnnIds = yield Anime.query().whereIn('ann_id', ann_ids).pluck('ann_id');
    Socket.messageUser(request.currentUser, 'num matched anime ids: '+ existingAnnIds.length);
    const removed = _.remove(items, function(item) { //filter and remove from xml all existing anime
      return _(existingAnnIds).includes(parseInt(item.id[0]));
    });
    Socket.messageUser(request.currentUser, 'new xml ids count: '+ items.length);

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

    Socket.messageUser(request.currentUser, 'Finished import');

    response.redirect('back');
  }

  *import_details(request, response) {
    const annIdList = yield Anime.query().whereNotNull('ann_id').pluck('ann_id');
    Socket.messageUser(request.currentUser, 'Adding descriptions...');

    for(const annId of annIdList) {
      const result = yield new Promise((resolve, reject) => {
        AnnApi.getTitleDetails(annId, (res) => {
          resolve(res);
        });
      });

      Socket.messageUser(request.currentUser, 'current ann_id: ' + annId);

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

      yield db_anime.save()
    }
    response.redirect('back')
  }
}

module.exports = AdminController;
