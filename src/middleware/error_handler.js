'use strict';

module.exports = (err, req, res, next) => {
  console.log('__SERVER_ERROR__');
  console.log(err);
  res.sendStatus(500);
};
