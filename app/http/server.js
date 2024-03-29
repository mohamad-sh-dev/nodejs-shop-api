const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const corsMiddleware = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const manageErrors = require('http-errors');
const { allRouets } = require('../router/router');
const { messageCenter } = require('../utilities/messages');
const { swaggerHandler } = require('../../document/swagger.loader');

module.exports = class Application {
  #PORT;

  #DB_URL;

  #app;

  #express;

  constructor(PORT, DB_URL) {
    this.#PORT = PORT;
    this.#DB_URL = DB_URL;
    this.#app = express();
    this.#express = express;
    this.configApplication();
    this.configViewsTemplate();
    this.connectToDatabase();
    this.startServer();
    this.configRoutes();
    this.handleErrors();
  }

  configApplication() {
    this.#app.use(morgan('dev'));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(this.#express.static(path.join(__dirname, '..', '..', 'public')));
    this.#app.use(
      '/apiDocs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerHandler())
    );
  }

  configViewsTemplate() {
    this.#app.set('view engine', 'ejs');
    this.#app.set('views', 'views');
  }

  connectToDatabase() {
    mongoose.connect(this.#DB_URL, (error) => {
      if (error) {
        return console.log(
          'there is problem with connectiong to database',
          error
        );
      }
      console.log('connected to database was succesfull !');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  }

  startServer() {
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log(
        `Server Started On Port ${this.#PORT} => http://localhost:${this.#PORT}`
      );
    });
  }

  configRoutes() {
    this.#app.use(corsMiddleware());
    this.#app.use(allRouets);
  }

  handleErrors() {
    this.#app.use((req, res, next) => {
      next(manageErrors.NotFound('the request is not found'));
    });
    // eslint-disable-next-line no-unused-vars
    this.#app.use((error, req, res, next) => {
      console.log(error);
      const internalServerError = manageErrors.InternalServerError();
      const statusCode = error.statusCode || internalServerError.statusCode;
      const message = error.message || internalServerError.message;
      return res.status(statusCode).json({
        status: messageCenter.public.FAILED,
        message,
      });
    });
  }
};
