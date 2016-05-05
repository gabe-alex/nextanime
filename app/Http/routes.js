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
Route.get('/mainpage', 'HomeController.mainpage')
Route.get('/animepage', 'HomeController.animepage')
Route.get('/userprofile', 'HomeController.userprofile')

Route.get('/register', 'RegistrationController.index')
Route.post('/register', 'RegistrationController.submit')

Route.get('/login', 'LoginController.index')
Route.post('/login', 'LoginController.submit')

Route.get('/library', 'UserController.library')
Route.get('/animedatabase', 'ListController.animedatabase')
Route.get('/recommendations', 'RecommendationsController.index')
