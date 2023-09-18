const createHttpError = require('http-errors');

function validateRequestBody(schema, bodyType = 'body') {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[bodyType]);
      next();
    } catch (error) {
      next(createHttpError.BadRequest(error.message));
    }
  };
}
module.exports = {
  validateRequestBody,
};
