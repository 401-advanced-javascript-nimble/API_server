'use strict';

/**
 * App module 
 * @module src/app
 * @exports Object -Object containing the express app and a start command
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/error_handler.js');
const notFoundHandler = require('./middleware/404.js');
const router = require('./router/router.js');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

let running = false;

module.exports = {
  running: running, // <-- for testing
  server: app,
  start: port => {
    if(!running) {
      app.listen(port, () => {
        running = true;
        console.log(`Express server is up on port ${port}`);
      });
    }
    else {
      console.log('Express server is already running');
    }
  },
};