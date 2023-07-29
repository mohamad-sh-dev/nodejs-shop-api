const autoBind = require('auto-bind');

module.exports = class BaseController {
  constructor() {
    autoBind(this);
  }
};
