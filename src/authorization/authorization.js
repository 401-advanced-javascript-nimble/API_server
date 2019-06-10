'use strict';

const User = require('../models/users.js');

module.exports = (req, res, next) => {
  
  try {
    let [authType, authString] = req.headers.authorization.split(/\s+/);
    
    switch( authType.toLowerCase() ) {
    case 'basic': 
      return _authBasic(authString);
    case 'bearer':
      return _authBearer(authString);
    default: 
      return _authError();
    }
  }
  catch(e) {
    res.status(403).send('Forbidden');
  }
  
  function _authBasic(str) {
    let base64Buffer = Buffer.from(str, 'base64');
    let bufferString = base64Buffer.toString();
    let [username, password] = bufferString.split(':');
    let auth = {username,password};
    req.body = auth;
    
    return User.authenticateBasic(auth)
      .then(user => _authenticate(user) )
      .catch(next);
  }

  function _authBearer(token) {
    try {
      return User.authenticateToken(token)
        .then(user => {
          _authenticate(user);
        })
        .catch(console.error);
    }
    catch(e) {
      console.log(e);
      res.sendStatus(403);
    }
  }

  function _authenticate(user) {
    if(user) {
      req.user = user;
      if(req.user.role === 'superuser-admin') {
        req.token = user.generateKey();
      }
      else {
        req.token = user.generateToken();
      }
      next();
    }
    else {
      _authError();
    }
  }
  
  function _authError() {
    next('Invalid User ID/Password');
  }
};