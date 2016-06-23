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
Route.get('/animedatabase', 'AnimeController.animedatabase');

Route.get('/register', 'AccountController.view_register');
Route.post('/register', 'AccountController.do_register');

Route.get('/login', 'AccountController.view_login');
Route.post('/login', 'AccountController.do_local_login');
Route.get('/login_fb', 'AccountController.login_fb_start');
Route.get('/login_fb_callback', 'AccountController.login_fb_callback');
Route.get('/logout', 'AccountController.do_logout');

Route.get('/userprofile', 'UserController.user_profile');

Route.get('/library', 'UserController.library_view');
Route.get('/library/edit', 'UserController.library_edit_view');
Route.get('/library/edit/:id', 'UserController.library_edit_view');
Route.post('/library/edit', 'UserController.library_edit_save');

Route.get('/recommendations', 'RecommendationsController.index');
