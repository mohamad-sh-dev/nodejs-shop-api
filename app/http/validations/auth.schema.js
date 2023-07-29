const createHttpError = require('http-errors');

function validateRequestBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      next(createHttpError.BadRequest(error.message));
    }
  };
}
function validateRequestParams(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.params);
      next();
    } catch (error) {
      next(createHttpError.BadRequest(error.message));
    }
  };
}

module.exports = {
  validateRequestBody,
  validateRequestParams
};
