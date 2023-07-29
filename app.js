/* eslint-disable no-new */
require('dotenv').config();
const Application = require('./app/http/server');

new Application(process.env.PORT, process.env.DB_URI);
