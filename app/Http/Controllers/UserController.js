'use strict';

const Anime = use('App/Model/Anime');
const Recommendation = use("Recommendation");
const _ = require('lodash');
const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');
const Config = use('Config');
const co = require('co');
const addrs = require("email-addresses");
const passport = require('passport');
const Helpers = use('Helpers');

const statusTypes = {
  planning: "Planning",
  watching: "Watching",
  on_hold: "On Hold",
  completed: "Completed",
  dropped: "Dropped",
  ignored: "Ignored"
};


class UserController {
  *user_profile(request, response) {

    const userAnime = yield request.currentUser.anime().fetch();
    const watching = userAnime.filter(function (anime) {
      return anime._pivot_status === 'watching';
    });
    const completed = userAnime.filter(function (anime) {
      return anime._pivot_status === 'completed';
    });
    
    /*
    const friends = user(function (anime) {
      return anime._pivot_status === 'completed';
    });*/

    yield response.sendView('user_profile', {completed: completed.value(), watching: watching.value(), user_anime: userAnime.value()/*,friend: friends.value()*/})
  }

  *user_edit(request, response) {
    yield response.sendView('user_edit');
  }

  *user_edit_save(request, response) {
    const params = request.all();
    let updated = 0;
    if(params.action === 'update_email') {
      const rules = {
        current_password: 'required',
        email : 'required|email'
      };

      const validation = yield Validator.validateAll(rules, params);
      const validationMessages = Config.get('messages.validation');
      let errors = {};
      if (validation.fails()) {
        errors = _(validation.messages())
          .groupBy('field')
          .mapValues(function(value) {return new _(value).first().validation})
          .mapValues(function(value, key) {return validationMessages[key][value]})
          .value();
      }

      if(!errors.current_password) {
        const matches = yield Hash.verify(params.current_password, request.currentUser.password);
        if (!matches) {
          errors.current_password = validationMessages.current_password.matches;
        }
      }

      if(!errors.email) {
        //Check if email is available
        const user = yield User.query().where('email', params.email).first();
        if(user) {
          errors.email = validationMessages.email.unique;
        }
      }

      if(!_(errors).isEmpty()) {
        const view = yield response.view('user_edit', {action: 'update_email', params: params, errors: errors});
        return response.badRequest(view);
      }
      else{

        const addr = addrs.parseOneAddress(params.email);
        const profile_name = addr.local;

        request.currentUser.profile_name = profile_name;
        request.currentUser.email = params.email;
        yield request.currentUser.save();
        updated = 1;
        const view = yield response.view('user_edit', {params: params,updated: updated});
        return response.send(view);
      }

    } else if(params.action === 'update_password') {

      const rules = {
        current_password: 'required',
        password : 'required|min:6',
        password_confirm: 'required|same:password'
      };

      const validation = yield Validator.validateAll(rules, params);
      const validationMessages = Config.get('messages.validation');
      let errors = {};
      if (validation.fails()) {
        errors = _(validation.messages())
          .groupBy('field')
          .mapValues(function(value) {return new _(value).first().validation})
          .mapValues(function(value, key) {return validationMessages[key][value]})
          .value();
      }

      if(!errors.current_password) {
        const matches = yield Hash.verify(params.current_password, request.currentUser.password);
        if (!matches) {
          errors.current_password = validationMessages.current_password.matches;
        }
      }

      if(!_(errors).isEmpty()) {
        const view = yield response.view('user_edit', {action: 'update_password', params: params, errors: errors});
        return response.badRequest(view)
      }

      else{

        const hashedPassword = yield Hash.make(params.password);

        request.currentUser.password = hashedPassword;
        yield request.currentUser.save();
        updated = 1;
        const view = yield response.view('user_edit', {params: params,updated: updated});
        return response.send(view);
      }
    }

    if(params.action === 'update_avatar') {
      // getting file instance
      const avatar = request.file('avatar_photo', {
        maxSize: '2mb',
        allowedExtensions: ['jpg', 'png', 'jpeg']
      })

      const userId = request.param('id')
      const user = yield User.findOrFail(userId)
      console.log(avatar.extension());
      console.log(user);
      /*const fileName = `${userId}.${avatar.extension()}`

       yield avatar.move(Helpers.storagePath('/images'), fileName)
       if (!avatar.moved()) {
       response.badRequest(avatar.errors())
       return
       }
       response.send('Avatar updated successfully');*/
      updated = 1;
      const view = yield response.view('user_edit', {updated: updated});
      return response.send(view);
    }

    yield response.sendView('user_edit');
  }


  *library_view(request, response) {
    const userAnime = yield request.currentUser.anime().fetch();

    yield response.sendView('library', {
      user_anime: userAnime.value()
    })
  }


  *library_edit_view(request, response) {
    const userAnime = yield request.currentUser.anime().fetch();

    const allAnime = yield Anime.all();
    const availableAnime = allAnime.differenceBy(userAnime.value(), 'id');

    let currentAnime, newAnime;
    const animeId = request.param('id');
    if (animeId) {
      currentAnime = userAnime.find(['id', parseInt(animeId)]);
      if (!currentAnime) {
        currentAnime = yield Anime.find(animeId);
      }
    }

    yield response.sendView('library_edit', {
      available_anime: availableAnime.value(),
      status_types: statusTypes,
      current_anime: currentAnime
    })
  }


  *library_edit_save(request, response) {
    const params = request.all();
    const animeId = params.anime;

    const userAnime = yield request.currentUser.anime().fetch();

    if (userAnime.find(['id', parseInt(animeId)])) {
      yield request.currentUser.anime().detach([animeId]);
    }
    if(params.save) {
      yield request.currentUser.anime().attach({[animeId]: {status: params.status, rating: params.rating}});
    }
    yield request.currentUser.update();
    yield Recommendation.rebuildRecommendations(request.currentUser);

    response.redirect('/library')
  }
}

module.exports = UserController;
