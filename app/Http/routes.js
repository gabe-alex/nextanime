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

Route.get('/register', 'RegistrationController.index')
Route.post('/register', 'RegistrationController.submit')

Route.get('/login', 'LoginController.index')
Route.post('/login', 'LoginController.local_login')
Route.get('/logout', 'LoginController.logout')

Route.get('/library', 'UserController.library').middlewares(['auth'])
Route.get('/library/edit/:id', 'UserController.library_edit_view').middlewares(['auth'])
Route.post('/library/save', 'UserController.library_save').middlewares(['auth'])
Route.post('/library/remove', 'UserController.library_remove').middlewares(['auth'])

Route.get('/animedatabase', 'ListController.animedatabase')

Route.get('/recommendations', 'RecommendationsController.index').middlewares(['auth'])



