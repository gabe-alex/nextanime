'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Routes helps you in defining http endpoints/urls which will be used
| by outside world to interact with your application. Adonis has a
| lean and rich router to support various options out of the box.
|
*/
const Route = use('Route')

Route.get('/', 'HomeController.index')

Route.get('/anime/:id', 'AnimeController.view_anime')

Route.get('/userprofile', 'UserController.user_profile')

Route.get('/register', 'AccountController.view_register')
Route.post('/register', 'AccountController.do_register')

Route.get('/login', 'AccountController.view_login')
Route.post('/login', 'AccountController.do_local_login')
Route.get('/login_fb', 'AccountController.login_fb_start')
Route.get('/login_fb_callback', 'AccountController.login_fb_callback')
Route.get('/logout', 'AccountController.do_logout')

Route.get('/library', 'UserController.library').middlewares(['auth'])
Route.get('/library/edit/:id', 'UserController.library_edit_view').middlewares(['auth'])
Route.post('/library/save', 'UserController.library_save').middlewares(['auth'])
Route.post('/library/remove', 'UserController.library_remove').middlewares(['auth'])

Route.get('/animedatabase', 'ListController.animedatabase')

Route.get('/recommendations', 'RecommendationsController.index').middlewares(['auth'])



