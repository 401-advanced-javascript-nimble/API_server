# 401 Midterm - Nimble

## API Server

#### Authors: Becky, Chris, Joé, Morgana

## Links & Resources
* [GitHub Repo](https://github.com/401-advanced-javascript-nimble/API_server)
* [Heroku Deployment](https://nimble-api-server.herokuapp.com/)
* [Travis]( --- )

### Documentation

### Modules
* `index.js` -- Initializes mongoose and starts the server.
* `src/app.js` -- Uses express to set server configuration and expose routes.
* `src/models/users.js` -- Defines the database schema and holds methods for users
* `src/router/router.js` -- Defines the routes available on the server and applies authorization middleware where needed.
* `src/authorization/authorization.js` -- Checks Basic and Bearer auth and validates user tokens.
* `src/middleware/error_handler.js` -- Controls behaviour on server errors.

### Setup
#### `.env` Requirements
* SECRET -- token generation
* MONGODB_URI -- database location
* TOKEN_EXPIRATION_TIME -- token lifetime
* PORT -- port to use (when running locally)

### Running the App
* `POST /signup`
* `POST /signin`
* `GET /leaderboard`
* `PUT /socket`
* `GET /admin`

### Operating Instructions
* How do?

#### Tests
* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?

#### UML
![UML](./assets/Nimble_UML.jpg)