'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/users.js');
const authorization = require('../authorization/authorization.js');

router.post('/signup', signUp);
router.get('/signin', authorization, signIn);
router.get('/leaderboard', leaderboard);
router.get('/admin', authorization, adminRoute);

/**
 * @function signUp
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function signUp(request, response, next) {
  //TODO: Database:
  //pass new user info through the mongoose model and create a user
  //sign them in?
  let user = new User(request.body);
  user.save()
    .then( (user) => {
      if (user.role === 'superuser-admin') {
        request.token = user.generateKey();
      }
      else {
        request.token = user.generateToken();
      }
      request.user = user;
      response.set('token', request.token);
      response.cookie('auth', request.token);
      response.send(request.token);
    }).catch(next);
  // response.status(200).send('Thank you for signing up!');

}

/**
 * 
 * @function signIn
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function signIn(request, response, next) {
  //TODO: look into keeping them signed in 
  //if authorized, keep them signed in
  response.status(200).send('Welcome Back');
}

/**
 * @function leaderboard
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function leaderboard(request, response, next) {
  //TODO: Database
  //get high scores from database
  response.status(200).send('Top Scores:');

}

/**
 * @function adminRoute
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function adminRoute(request, response, next) {
  //TODO: authorization
  //only admin users (handle in authorization)
  response.status(200).send('Welcome admin');
}

module.exports = router;