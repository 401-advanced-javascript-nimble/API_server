'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/users.js');
const authorization = require('../authorization/authorization.js');

//========================================
// Routes
//========================================


router.post('/signup', signUp);
router.post('/signin', authorization, signIn);
router.get('/leaderboard', leaderboard);
router.patch('/updateStats', updateStats);
router.get('/admin', authorization, adminRoute);
router.post('/validate', authorization, validate);

//========================================
// Callback Functions
//========================================


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
  console.log('this is request.body', request.body);
  // User.find({username: request.body.username, password: request.body.password});
  User.findOne({username: request.body.username})
    .then(user => {
      console.log('this is user:', user);
      request.token = user.generateToken();
      response.send(request.token);
    });

  console.log('this is request.token:', request.token);
  // response.status(200).send('Welcome Back');
}

/**
 * @function leaderboard
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function leaderboard(request, response, next) {
  //TODO: Database

  User.find({})
    .limit(5)
    .sort({wins: -1})
    .select({_id: 0, username: 1, wins: 1})
    .exec( (err, data) => {
      response.status(200).send({TopScores: data});
    });


}

function updateStats(request, response, next){
  let [authType, token] = request.headers.authorization.split(/\s+/);

  User.authenticateToken(token)
    .then( user => {
      console.log(user);
      const id = user._id;
      let wins = user.wins;
      wins ++;
      User.findByIdAndUpdate(id, {wins: wins}, {new:true, useFindAndModify:false}).then(result => {
        console.log(result);
      });
    });
  response.sendStatus(200);
}

/**
 * @function adminRoute
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function adminRoute(request, response, next) {

  console.log('this is a request body', request);
  if(request.user.role !== 'superuser-admin') {
    response.status(403).send('Forbidden');
  }
  else {
    response.status(200).send('Welcome admin');
  }
}

function validate(request, response, next) {
  response.sendStatus(204);
}

//========================================

module.exports = router;