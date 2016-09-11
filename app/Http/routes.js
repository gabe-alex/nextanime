'use strict';

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| Router helps you in defining urls and their corresponding actions. Adonis
| Router is an upto date implementation of HTTP specs and handle common
| conventions gracefully.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route');


Route.get('/', 'HomeController.index');

Route.get('/anime/:id', 'AnimeController.view_anime');
Route.get('/animedatabase/:page?', 'AnimeController.animedatabase');

Route.get('/login', 'AccountController.view_login');
Route.post('/login', 'AccountController.local_login');
Route.get('/login_fb', 'AccountController.login_fb');
Route.get('/login_tw', 'AccountController.login_tw');
Route.get('/logout', 'AccountController.do_logout');

Route.group('auth', function () {
  Route.get('/search', 'AnimeController.search');

  Route.get('/userprofile', 'UserController.user_profile');

  Route.get('/library', 'UserController.library_view');
  Route.get('/library/edit', 'UserController.library_edit_view');
  Route.get('/library/edit/:id', 'UserController.library_edit_view');

  Route.post('/library/edit', 'UserController.library_edit_save');

  Route.get('/recommendations', 'RecommendationsController.index');

  Route.get('/useredit', 'UserController.user_edit');
  Route.post('/useredit', 'UserController.user_edit_save');
}).middleware('auth');

Route.group('admin', function () {
  Route.get('/administration', 'AdminController.admin_edit');
  Route.get('/administration/import_list', 'AdminController.import_list');
  Route.get('/administration/import_details', 'AdminController.import_details');
}).middleware('auth', 'admin');
