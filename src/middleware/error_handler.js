'use strict';

module.exports = (err, req, res, next) => {
  console.log('__SERVER_ERROR__', err);
  res.sendStatus(500);
};
