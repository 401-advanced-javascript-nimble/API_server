'use strict';

const mongoose = require('mongoose');

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String, required:true},
  stats: {type: Object},
  role: {type: String, default:'user', enum: ['superuser-admin', 'socket', 'user'], required:true},
});

module.exports = mongoose.model('users', users);