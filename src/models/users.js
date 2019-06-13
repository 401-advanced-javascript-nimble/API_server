'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//========================================
// Schema
//========================================

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  wins: {type: Object, default: 0},
  role: {type: String, default:'user', enum: ['superuser-admin', 'socket', 'user'], required:true},
});

//========================================
// Hooks
//========================================


users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(console.error);
});

//========================================
// Statics
//========================================

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

users.statics.authenticateToken = function(token) {
  const decryptedToken = jwt.verify(token, process.env.SECRET);
  return this.findOne({_id: decryptedToken.id});
};

//========================================
// Methods
//========================================


users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then(valid => valid ? this : null);
};

users.methods.generateToken = function(tokenType) {
  let token = {
    id: this._id,
    role: this.role,
    tokenType: tokenType || 'user',
  };
  if (token.tokenType !== 'key') {
    console.log('Generating token...');
    return jwt.sign( token, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME } );
  }
  else {
    console.log('Generating key...');
    return jwt.sign(token, process.env.SECRET);
  }
};

users.methods.generateKey = function() {
  return this.generateToken('key');
};

//========================================

module.exports = mongoose.model('users', users);