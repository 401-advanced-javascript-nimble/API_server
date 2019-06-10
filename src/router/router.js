'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/users.js');
const authorization = require('../authorization/authorization.js');

router.post('/signup', signUp);
router.get('/signin', authorization, signIn);
router.get('/leaderboard', leaderboard);
router.put('/socket', socket);
router.get('/admin', authorization, adminRoute);

/**
 * @function signUp
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function signUp(request, response, next) {

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
//come back once socket server connection is setup//
function socket(request, response, next){
  // let gameResults = request.body;
  // if(request.body){

  // }
  response.sendStatus(200);
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
  console.log('this is a request body', request);
  if(request.user.role !== 'superuser-admin') {
    response.status(403).send('Forbidden');
  }
  else {
    response.status(200).send('Welcome admin');
  }
}

module.exports = router;