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
  User.findOne({username: request.body.username})
    .then(user => {
      request.token = user.generateToken();
      response.send(request.token);
    });
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
  let id;
  let wins;
  User.authenticateToken(token)
    .then( foundUser => {
      id = foundUser._id;
      wins = foundUser.wins;
      wins ++;
    })
    .then(() => {
      User.findByIdAndUpdate({id},
        {wins: wins},
        {new:true, useFindAndModify:false}
      );
    })
    .then(result => {
      response.status(200).send(result);
    })
    .catch(error => {
      console.log({error});
    });
}


/**
 * @function adminRoute
 * @param {*} request Express HTTP Request object
 * @param {*} response Express HTTP Response object
 * @param {*} next Express next middleware function
 */
function adminRoute(request, response, next) {
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