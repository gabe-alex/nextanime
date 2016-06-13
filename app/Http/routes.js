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
Route.post('/login', 'LoginController.submit')
Route.get('/logout', 'LoginController.logout')

Route.get('/library', 'UserController.library')
Route.get('/library/edit/:id', 'UserController.library_edit_view')
Route.post('/library/save', 'UserController.library_save')
Route.post('/library/remove', 'UserController.library_remove')

Route.get('/animedatabase', 'ListController.animedatabase')

Route.get('/recommendations', 'RecommendationsController.index')



var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // route for facebook authentication and login
  // different scopes while logging in
  router.get('/login/facebook',
    passport.authenticate('facebook', { scope : 'email' }
    ));

  // handle the callback after facebook has authenticated the user
  router.get('/login/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/home',
      failureRedirect : '/'
    })
  );

  // route for twitter authentication and login
  // different scopes while logging in
  router.get('/login/twitter',
    passport.authenticate('twitter'));

  // handle the callback after facebook has authenticated the user
  router.get('/login/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/twitter',
      failureRedirect : '/'
    })
  );

  /* GET Twitter View Page */
  router.get('/twitter', isAuthenticated, function(req, res){
    res.render('twitter', { user: req.user });
  });

  return router;
}

