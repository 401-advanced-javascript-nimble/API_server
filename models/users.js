'use strict';

const schema = require('./schemas/users-schema.js');

class Users {

  constructor() {
  }

  get(_id) {
    let query = _id ? {_id} : {};
    try { return schema.find(query, {__v: 0}); }
    catch(e) { console.log(e) }
  }
  
  post(record) {
    let query = new schema(record);
    try { return query.save(); }
    catch(e) { console.log(e) }
  }

  put(_id, record) {
    let query = {...record};
    try { return schema.findOneAndUpdate({_id}, query, {new: true, projection:{__v: 0}}); }
    catch(e) { console.log(e) }
  }

  delete(_id) {
    let query = {_id};
    return schema.remove(query);
  }

}

module.exports = Users;




// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');



// const usedTokens = [];

// users.pre('save', function(next) {
//   bcrypt.hash(this.password, 10)
//     .then(hashedPassword => {
//       this.password = hashedPassword;
//       next();
//     })
//     .catch(console.error);
// });

// users.statics.createFromOauth = function(email) {

//   if(! email) { return Promise.reject('Validation Error'); }

//   return this.findOne( {email} )
//     .then(user => {
//       if( !user ) { throw new Error('User Not Found'); }
//       console.log('Welcome Back', user.username);
//       return user;
//     })
//     .catch(error => {
//       console.log('Creating new user');
//       let username = email;
//       let password = 'none';
//       return this.create({username, password, email});
//     });
// };

// users.statics.authenticateBasic = function(auth) {
//   let query = {username:auth.username};
//   return this.findOne(query)
//     .then( user => user && user.comparePassword(auth.password) )
//     .catch(error => {throw error;});
// };

// users.statics.authenticateToken = function(token) {
//   if (usedTokens.includes(token)) {
//     throw new Error('token already used');
//   }
//   const decryptedToken = jwt.verify(token, process.env.SECRET);
//   if (!!process.env.SINGLE_USE_TOKENS) {
//     if(decryptedToken.type !== 'key') {
//       usedTokens.push(token);
//     }
//   }
//   return this.findOne({_id: decryptedToken.id});
// };

// users.methods.comparePassword = function(password) {
//   return bcrypt.compare( password, this.password )
//     .then(valid => valid ? this : null);
// };

// users.methods.generateToken = function(type) {
//   let token = {
//     id: this._id,
//     role: this.role,
//     type: type || 'user',
//   };

//   if (token.type !== 'key') {
//     return jwt.sign( token, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME || 900 } );
//   }
//   else {
//     return jwt.sign(token, process.env.SECRET)
//   }
// };

// users.methods.generateKey = function() {
//   return this.generateToken('key');
// }