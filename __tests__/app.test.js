'use strict';
/**
 * @jest-environment node
 */
process.env.SECRET = 'test';
process.env.TOKEN_EXPIRATION_TIME = '30m';

const jwt = require('jsonwebtoken');
const server = require('../src/app.js').server;
const supergoose = require('./supergoose.js');

const mockRequest = supergoose.server(server);

let adminToken;
let userToken;
beforeAll(async (done) => {
  await supergoose.startDB();
  done();
});

afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  it('can create a user', () => {
    return mockRequest.post('/signup')
      .send({username:'user', password: 'pass'})
      .then(results => {
        userToken = results.text;
        const decodedToken = jwt.verify(results.text, process.env.SECRET);
        expect(decodedToken.id).toBeDefined();
        expect(decodedToken.role).toEqual('user');
        expect(decodedToken.tokenType).toEqual('user');
      });
  });

  it('can create an admin', () => {
    return mockRequest.post('/signup')
      .send({username:'admin', password: 'pass', role: 'superuser-admin'})
      .then(results => {
        adminToken = results.text;
        const decodedToken = jwt.verify(results.text, process.env.SECRET);
        expect(decodedToken.id).toBeDefined();
        expect(decodedToken.role).toEqual('superuser-admin');
        expect(decodedToken.tokenType).toEqual('key');
      });
  });

  it('can signin with basic', () => {
    return mockRequest.post('/signin')
      .auth('user', 'pass')
      .then(results => {
        let decodedToken = jwt.verify(results.text, process.env.SECRET);
        expect(decodedToken.id).toBeDefined();
        expect(decodedToken.role).toEqual('user');
        expect(decodedToken.tokenType).toEqual('user');
      });
  });

  it('can access route with bearer auth', () => {
    return mockRequest.post('/validate')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(results => {
        expect(results.status).toBe(204);
      });
  });
  it('returns an error if auth header is invalid', () => {
    return mockRequest.post('/validate')
      .set('Authorization', `WRONG! ${adminToken}`)
      .then(results => {
        expect(results.status).toBe(500);
        // expect(results.text).toBe('Forbidden');
      });
  });
  
  describe('middleware', () => {
    it('error handler returns a server error', () => {
      return mockRequest.post('/signup')
        .send({password: 'pass', role: 'user'})
        .then(results => {
          expect(results.status).toBe(500);
        });  
    });
    it('404 handler returns a 404 error', () => {
      return mockRequest.post('/nope')
        .then(results => {
          expect(results.status).toBe(404);
          expect(results.text).toBe('Not Found');
        });  
    });
  });

  describe('router', () => {
    it('an admin can reach the admin route', () => {
      return mockRequest.get('/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .then(results => {
          expect(results.status).toBe(200);
          expect(results.text).toEqual('Welcome admin');
        });
    });
    it('a user cannot reach the admin route', () => {
      return mockRequest.get('/admin')
        .set('Authorization', `Bearer ${userToken}`)
        .then(results => {
          expect(results.status).toBe(403);
          expect(results.text).toEqual('Forbidden');
        });
    });
    it('can reach the updateStats route', () => {
      mockRequest.patch('/updateStats')
        .set('Authorization', `Bearer ${userToken}`)
        .then(results => {
          expect(results.status).toBe(200);
          expect(results.body.username).toBe('user');
          expect(results.body.wins).toBe(1);
        })
        .catch(console.error);
    });
  });
});